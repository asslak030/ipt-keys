"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import {
  BookOpen,
  Plus,
  Shield,
  XCircle,
  Key,
  Calendar,
  Sparkles,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import CopyButton from "../component/copy-button";
import { Separator } from "~/components/ui/separator";
import { Badge } from "~/components/ui/badge";
import Link from "next/link";
import AuthGuard from "../component/AuthGuard";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CreateKeySchema } from "~/server/validation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

type KeyItem = {
  id: string;
  name: string;
  masked: string;
  createdAt: number | string;
  revoked: boolean;
};

export default function DashboardPage() {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [justCreated, setjustCreated] = useState<{
    key: string;
    id: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<KeyItem[]>([]);

  async function createKey() {
    setLoading(true);
    try {
      const parsed = CreateKeySchema.safeParse({ name });
      if (!parsed.success) {
        const firstError = parsed.error.errors[0]?.message ?? "Invalid input";
        toast.error(firstError);
        return;
      }

      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();

      if (res.ok) {
        setjustCreated({ key: data.key, id: data.id });
        toast.success("New API key created successfully!");
        setName("");
        setOpen(false);
        await load();
      } else toast.error(data.error ?? "Something went wrong");
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
    if (!res.ok) alert(data.error ?? "Something went wrong");
    toast.success("Key revoked successfully");
    await load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-8">
          {/* Header */}
          <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between rounded-2xl bg-gray-800/50 p-4 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-indigo-500/10 p-2">
                <Shield className="h-6 w-6 text-indigo-400" />
              </div>
              <h1 className="text-2xl font-bold text-white sm:text-3xl">
                Key Vault
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/docs">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 border-indigo-400/30 bg-indigo-500/10 text-indigo-300 transition-all hover:scale-105 hover:bg-indigo-500/20"
                  aria-label="View Documentation"
                >
                  <BookOpen className="h-4 w-4" /> Docs
                </Button>
              </Link>
              <div className="rounded-full bg-gray-700/50 p-1">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "h-8 w-8",
                    },
                  }}
                />
              </div>
            </div>
          </motion.header>

          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="overflow-hidden border-0 bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl">
              <CardContent className="p-0">
                <div className="flex flex-col items-start gap-6 p-6 md:flex-row md:items-center">
                  <div className="flex-1 space-y-4">
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        Welcome back,{" "}
                        <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                          {user?.firstName || "User"}!
                        </span>
                      </h2>
                      <p className="mt-2 text-gray-300">
                        Manage your API keys securely and integrate them with
                        your apps safely.
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex items-center gap-2 rounded-lg bg-gray-700/50 px-3 py-2">
                        <Key className="h-4 w-4 text-indigo-400" />
                        <span className="text-sm text-gray-300">
                          {items.length} API Keys
                        </span>
                      </div>
                      <div className="flex items-center gap-2 rounded-lg bg-gray-700/50 px-3 py-2">
                        <Sparkles className="h-4 w-4 text-purple-400" />
                        <span className="text-sm text-gray-300">
                          {items.filter((i) => !i.revoked).length} Active
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20 blur-md"></div>
                    <div className="relative overflow-hidden rounded-2xl">
                      <img
                        src="https://media3.giphy.com/media/v1.Y2lkPTZjMDliOTUycG01NGsxOXUzem8yZTJoeWN5dXlpc2lhMGxnZW0zeGwzeWlldzltMCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/7x3PHPSMXSONHFuOK4/source.gif"
                        alt="Security Illustration"
                        className="h-40 w-40 object-cover transition-transform duration-500 hover:scale-110"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-700/50 bg-gray-800/30 p-4">
                  <p className="text-sm text-gray-400">
                    <strong className="text-indigo-300">Tip:</strong> Keep your
                    keys private, rotate them regularly, and revoke or rename
                    them anytime for added security.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Generate API Key */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-0 bg-gradient-to-br from-gray-800 to-gray-900 shadow-xl">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold text-white">
                      Generate API Key
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Create a new key to access our API services
                    </CardDescription>
                  </div>
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button
                        className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all hover:from-indigo-600 hover:to-purple-600 hover:shadow-lg"
                        aria-label="Create API Key"
                      >
                        <Plus className="h-4 w-4" /> Create Key
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="border-0 bg-gray-800 text-white sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-white">
                          Create New API Key
                        </DialogTitle>
                        <DialogDescription className="text-gray-400">
                          Provide a descriptive name for your new API key
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-3 py-2">
                        <Input
                          placeholder="e.g., Production Server"
                          aria-label="API Key Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="border-gray-600 bg-gray-700/50 text-white placeholder:text-gray-400"
                        />
                      </div>
                      <DialogFooter>
                        <Button
                          onClick={createKey}
                          disabled={loading}
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 transition-all hover:from-indigo-600 hover:to-purple-600"
                        >
                          {loading ? (
                            "Creating..."
                          ) : (
                            <>
                              <Plus className="h-4 w-4" /> Create Key
                            </>
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>

              <CardContent>
                <AnimatePresence>
                  {justCreated && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-4 shadow-inner"
                    >
                      <div className="flex items-center gap-2">
                        <Key className="h-5 w-5 text-indigo-400" />
                        <p className="text-sm font-medium text-indigo-300">
                          Your new API Key
                        </p>
                      </div>
                      <div className="mt-3 flex items-center gap-2 rounded-lg bg-gray-900/50 p-3">
                        <code className="flex-1 text-sm break-all text-gray-200">
                          {justCreated.key}
                        </code>
                        <CopyButton value={justCreated.key} />
                      </div>
                      <p className="mt-3 text-xs text-gray-400">
                        ⚠️ Save this key securely. You won't be able to see it
                        again.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>

          {/* Your Keys Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="border-0 bg-gradient-to-br from-gray-800 to-gray-900 shadow-xl">
              <CardHeader className="border-b border-gray-700/50 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold text-white">
                      Your API Keys
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Manage and monitor your active API keys
                    </CardDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-gray-700/50 text-gray-300"
                  >
                    {items.filter((i) => !i.revoked).length} Active
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <AnimatePresence mode="wait">
                  {items.length > 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
                    >
                      {items.map((row) => (
                        <motion.div
                          key={row.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          whileHover={{ y: -5 }}
                          className="flex flex-col justify-between rounded-xl border border-gray-700/50 bg-gray-800/30 p-4 shadow-lg transition-all"
                        >
                          <div className="space-y-4">
                            <div className="flex items-start justify-between">
                              <h3 className="font-semibold text-white">
                                {row.name}
                              </h3>
                              <Badge
                                className={`rounded-full px-2 py-1 text-xs ${
                                  row.revoked
                                    ? "bg-red-500/20 text-red-400"
                                    : "bg-emerald-500/20 text-emerald-400"
                                }`}
                              >
                                {row.revoked ? "Revoked" : "Active"}
                              </Badge>
                            </div>

                            <div className="rounded-lg bg-gray-900/50 p-3">
                              <code className="text-sm break-all text-gray-300">
                                {row.masked}
                              </code>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              <Calendar className="h-3 w-3" />
                              <span>
                                Created:{" "}
                                {new Date(row.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  },
                                )}
                              </span>
                            </div>
                          </div>

                          <div className="mt-4 flex justify-end">
                            <Button
                              variant="destructive"
                              size="sm"
                              disabled={row.revoked}
                              onClick={() => revokeKey(row.id)}
                              className="gap-2 transition-all hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <XCircle className="h-4 w-4" />
                              Revoke
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-12 text-center"
                    >
                      <div className="rounded-full bg-gray-700/50 p-4">
                        <Key className="h-8 w-8 text-gray-500" />
                      </div>
                      <h3 className="mt-4 text-lg font-medium text-white">
                        No API keys yet
                      </h3>
                      <p className="mt-2 text-sm text-gray-400">
                        Get started by creating your first API key
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>

          {/* Footer Tip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="rounded-2xl bg-gray-800/50 p-4 backdrop-blur-sm"
          >
            <p className="text-center text-sm text-gray-400">
              Tip: Call secured endpoints with the{" "}
              <code className="rounded-lg bg-gray-700/50 px-2 py-1 text-indigo-300">
                x-api-key
              </code>{" "}
              header.{" "}
              <Link
                className="text-indigo-400 underline hover:text-indigo-300"
                href="/docs"
              >
                View Documentation
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </AuthGuard>
  );
}
