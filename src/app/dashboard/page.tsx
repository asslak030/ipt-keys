"use client";

import { UserButton } from "@clerk/nextjs";
import { BookOpen, Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import CopyButton from "../component/copy-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Separator } from "~/components/ui/separator";
import { Badge } from "~/components/ui/badge";
import Link from "next/link";
import AuthGuard from "../component/AuthGuard";
import { useEffect, useState } from "react";

type KeyItem = {
  id: string;
  name: string;
  masked: string;
  createdAt: number | string;
  revoked: boolean;
};

export default function DashboardPage() {
  const [name, setName] = useState("My API Key");
  const [justCreated, setjustCreated] = useState<{
    key: string;
    id: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<KeyItem[]>([]);

  async function createKey() {
    setLoading(true);
    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (res.ok) {
        setjustCreated({
          key: data.key,
          id: data.id,
        });
        await load();
      } else {
        alert(data.error ?? "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }

  async function load() {
    const res = await fetch("/api/keys", { cache: "no-store" });
    const data = await res.json();
    setItems(data.items ?? []);
  }

  async function revokeKey(id: string) {
    const res = await fetch(`/api/keys?keyId=${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error ?? "Something went wrong");
    }
    await load();
  }

  useEffect(() => {
    load();
  }, [createKey, revokeKey]);

  return (
    <AuthGuard>
      <div className="mx-auto max-w-4xl space-y-6 py-6">
        {/* Top ToolBar */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Key Vault</h1>
          <div className="flex gap-2">
            <Link href="/docs">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                aria-label="View Documentation"
              >
                <BookOpen /> Documentation
              </Button>
            </Link>
            <UserButton />
          </div>
        </div>

        {/* Generate API Key */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Generate API Key</CardTitle>
            <Button
              className="flex items-center gap-2"
              aria-label="Create API Key"
              onClick={createKey}
              disabled={loading}
            >
              <Plus /> Create
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Enter API Key Name"
                aria-label="API Key Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {justCreated && (
              <div className="rounded-md border p-3">
                <p className="text-sm font-medium">
                  Here is your API Key (visible once):
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <code className="text-sm break-all">{justCreated.key}</code>
                  <CopyButton value={justCreated.key} />
                </div>
                <p className="text-muted-foreground mt-2 text-xs">
                  Save this key securely. You won&apos;t be able to see it
                  again.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Your Keys */}
        <Card>
          <CardHeader>
            <CardTitle>Your Keys</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell className="font-mono">{row.masked}</TableCell>
                    <TableCell>
                      {new Date(row.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {row.revoked ? (
                        <Badge variant="secondary">Revoked</Badge>
                      ) : (
                        <Badge>Active</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={row.revoked}
                        onClick={() => revokeKey(row.id)}
                      >
                        Revoke
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {items.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-muted-foreground text-center text-sm"
                    >
                      No API keys found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Separator />

        <p>
          Tip: Call secured endpoints with the <code>x-api-key</code> header.
          See{" "}
          <Link className="underline" href="/docs">
            Docs
          </Link>
        </p>
      </div>
    </AuthGuard>
  );
}
