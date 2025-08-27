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

export default function DashboardPage() {
  const sampleApiKey = "abcd-123-efgh";

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
            >
              <Plus /> Create
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Enter API Key Name"
                aria-label="API Key Name"
              />
            </div>

            {/* Should not show if no API Keys exist */}
            <div className="rounded-md border p-3">
              <p className="text-sm font-medium">
                Here is your API Key (visible once):
              </p>
              <div className="mt-2 flex items-center gap-2">
                <code className="text-sm break-all">{sampleApiKey}</code>
                <CopyButton value={sampleApiKey} />
              </div>
              <p className="text-muted-foreground mt-2 text-xs">
                Save this key securely. You won&apos;t be able to see it again.
              </p>
            </div>
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
                <TableRow>
                  <TableCell>Name of Key</TableCell>
                  <TableCell className="font-mono">{sampleApiKey}</TableCell>
                  <TableCell>8/25/2025</TableCell>
                  <TableCell>
                    <Badge variant="secondary">Revoked</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="destructive" size="sm">
                      Revoke
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Separator />

        <p>
          Tip: Call secured endpoints with the <code>{sampleApiKey}</code>{" "}
          header. See{" "}
          <Link className="underline" href="/docs">
            Docs
          </Link>
        </p>
      </div>
    </AuthGuard>
  );
}
