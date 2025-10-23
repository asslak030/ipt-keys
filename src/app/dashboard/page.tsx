"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import {
  BookOpen,
  Plus,
  XCircle,
  Key,
  Calendar,
  Gamepad2,
  ShoppingBag,
  Trophy,
  Zap,
  Users,
  Package,
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
        toast.success("New API key generated successfully!");
        setName("");
        setOpen(false);
        await load();
      } else toast.error(data.error ?? "Failed to create key. Try again!");
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
      <div className="min-h-screen bg-gradient-to-br from-[#1B2838] via-[#2A475E] to-[#3C5A78] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Header - Steam Style */}
          <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between rounded-lg border border-[#4C6B8A] bg-[#171D25] p-6 shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-gradient-to-br from-[#66C0F4] to-[#4B9CD3] p-3 shadow-md">
                <Gamepad2 className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="bg-gradient-to-r from-[#66C0F4] to-[#90BA3C] bg-clip-text text-3xl font-bold text-transparent">
                  HeavensPlay API Manager
                </h1>
                <p className="text-sm text-[#8F98A0]">Developer Portal</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Game Management Button */}
              <Link href="/game-management">
                <Button
                  variant="outline"
                  className="flex items-center gap-3 border-[#90BA3C] bg-[#90BA3C]/10 text-[#90BA3C] transition-all hover:bg-[#90BA3C]/20 hover:text-white"
                  aria-label="Manage Games"
                >
                  <Package className="h-5 w-5" />
                  <span className="hidden sm:inline">Game Management</span>
                  <span className="sm:hidden">Games</span>
                </Button>
              </Link>

              {/* Documentation Button */}
              <Link href="/docs">
                <Button
                  variant="outline"
                  className="flex items-center gap-3 border-[#4C6B8A] bg-[#1B2838] text-[#C7D5E0] transition-all hover:bg-[#2A475E] hover:text-white"
                  aria-label="View Documentation"
                >
                  <BookOpen className="h-5 w-5" />
                  <span className="hidden sm:inline">Documentation</span>
                  <span className="sm:hidden">Docs</span>
                </Button>
              </Link>

              {/* User Button */}
              <div className="rounded-full border-2 border-[#66C0F4]/50 bg-[#1B2838] p-1">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "h-10 w-10",
                    },
                  }}
                />
              </div>
            </div>
          </motion.header>

          {/* Stats Overview - Steam Inspired */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid gap-6 md:grid-cols-3"
          >
            <Card className="border-[#4C6B8A] bg-[#1B2838] shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-[#66C0F4]/20 p-3">
                    <Key className="h-6 w-6 text-[#66C0F4]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#C7D5E0]">{items.length}</p>
                    <p className="text-sm text-[#8F98A0]">Total API Keys</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#4C6B8A] bg-[#1B2838] shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-[#90BA3C]/20 p-3">
                    <ShoppingBag className="h-6 w-6 text-[#90BA3C]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#C7D5E0]">
                      {items.filter((i) => !i.revoked).length}
                    </p>
                    <p className="text-sm text-[#8F98A0]">Active Keys</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#4C6B8A] bg-[#1B2838] shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-[#FF6B35]/20 p-3">
                    <Users className="h-6 w-6 text-[#FF6B35]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#C7D5E0]">
                      {items.filter((i) => i.revoked).length}
                    </p>
                    <p className="text-sm text-[#8F98A0]">Revoked Keys</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Welcome & Key Generation - Steam Layout */}
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Welcome Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="h-full border-[#4C6B8A] bg-[#1B2838] shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl text-[#C7D5E0]">
                    <Trophy className="h-6 w-6 text-[#90BA3C]" />
                    Welcome, {user?.firstName || "Developer"}!
                  </CardTitle>
                  <CardDescription className="text-[#8F98A0]">
                    Heavens API Key Integration Dashboard
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg bg-[#171D25] p-4 border border-[#4C6B8A]">
                    <div className="flex items-center gap-3">
                      <Zap className="h-5 w-5 text-[#66C0F4]" />
                      <div>
                        <p className="font-medium text-[#C7D5E0]">Quick Start Guide</p>
                        <p className="text-sm text-[#8F98A0]">
                          Generate your Heavens Web API key to begin integration
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-[#8F98A0]">
                    Access Heavens's comprehensive APIs for game data, user profiles, 
                    and community features. Manage your keys securely and follow Steam's 
                    API guidelines.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Generate API Key */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="h-full border-[#4C6B8A] bg-[#1B2838] shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl text-[#C7D5E0]">
                    Generate Heavens API Key
                  </CardTitle>
                  <CardDescription className="text-[#8F98A0]">
                    Create new access keys for HeavensPlay Web API
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button
                        className="w-full bg-gradient-to-r from-[#66C0F4] to-[#4B9CD3] text-white transition-all hover:from-[#66C0F4] hover:to-[#4B9CD3] hover:shadow-lg"
                        aria-label="Create API Key"
                      >
                        <Plus className="h-5 w-5" />
                        Generate Heavens Key
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="border-[#4C6B8A] bg-[#1B2838] text-[#C7D5E0]">
                      <DialogHeader>
                        <DialogTitle className="text-[#C7D5E0]">
                          Create Heavens API Key
                        </DialogTitle>
                        <DialogDescription className="text-[#8F98A0]">
                          Name your key for identification
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <Input
                          placeholder="e.g., Game Server, Web Application"
                          aria-label="API Key Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="border-[#4C6B8A] bg-[#171D25] text-[#C7D5E0] placeholder:text-[#8F98A0]"
                        />
                      </div>
                      <DialogFooter>
                        <Button
                          onClick={createKey}
                          disabled={loading}
                          className="bg-gradient-to-r from-[#66C0F4] to-[#4B9CD3] hover:from-[#66C0F4] hover:to-[#4B9CD3]"
                        >
                          {loading ? (
                            "Creating Steam Key..."
                          ) : (
                            <>
                              <Plus className="h-4 w-4" />
                              Generate Key
                            </>
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <AnimatePresence>
                    {justCreated && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="rounded-lg border border-[#66C0F4]/30 bg-[#66C0F4]/10 p-4"
                      >
                        <div className="flex items-center gap-3">
                          <Key className="h-5 w-5 text-[#66C0F4]" />
                          <p className="font-medium text-[#66C0F4]">
                            New Heavens API Key Created
                          </p>
                        </div>
                        <div className="mt-3 flex items-center gap-3 rounded-lg border border-[#4C6B8A] bg-[#171D25] p-3">
                          <code className="flex-1 text-sm break-all text-[#C7D5E0] font-mono">
                            {justCreated.key}
                          </code>
                          <CopyButton value={justCreated.key} />
                        </div>
                        <p className="mt-3 text-xs text-[#8F98A0]">
                          🔐 Store this key securely. It won't be displayed again.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Your Keys Section - Steam Design */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="border-[#4C6B8A] bg-[#1B2838] shadow-lg">
              <CardHeader className="border-b border-[#4C6B8A] pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold text-[#C7D5E0]">
                      Your Heavens API Keys
                    </CardTitle>
                    <CardDescription className="text-[#8F98A0]">
                      Manage and monitor your HeavensPlay Web API access keys
                    </CardDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-[#4C6B8A] bg-[#171D25] text-[#8F98A0]"
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
                      className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
                    >
                      {items.map((row) => (
                        <motion.div
                          key={row.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          whileHover={{ y: -4 }}
                          className="group flex flex-col justify-between rounded-lg border border-[#4C6B8A] bg-[#171D25] p-6 shadow-md transition-all hover:border-[#66C0F4] hover:bg-[#1B2838]"
                        >
                          <div className="space-y-4">
                            <div className="flex items-start justify-between">
                              <h3 className="text-lg font-semibold text-[#C7D5E0] group-hover:text-[#66C0F4] transition-colors">
                                {row.name}
                              </h3>
                              <Badge
                                className={`rounded-full px-3 py-1 text-xs font-medium ${
                                  row.revoked
                                    ? "bg-[#FF6B35]/20 text-[#FF6B35] border-[#FF6B35]/30"
                                    : "bg-[#90BA3C]/20 text-[#90BA3C] border-[#90BA3C]/30"
                                } border`}
                              >
                                {row.revoked ? "Revoked" : "Active"}
                              </Badge>
                            </div>

                            <div className="rounded-lg border border-[#4C6B8A] bg-[#1B2838] p-4">
                              <code className="text-sm break-all text-[#8F98A0] font-mono">
                                {row.masked}
                              </code>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-[#8F98A0]">
                              <Calendar className="h-4 w-4" />
                              <span>
                                Created: {new Date(row.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          <div className="mt-6 flex justify-end">
                            <Button
                              variant="destructive"
                              size="sm"
                              disabled={row.revoked}
                              onClick={() => revokeKey(row.id)}
                              className="gap-2 bg-gradient-to-r from-[#FF6B35] to-[#E5532D] transition-all hover:from-[#FF6B35] hover:to-[#E5532D] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <XCircle className="h-4 w-4" />
                              Revoke Key
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
                      className="flex flex-col items-center justify-center py-16 text-center"
                    >
                      <div className="rounded-lg border border-[#4C6B8A] bg-[#171D25] p-8">
                        <Gamepad2 className="h-12 w-12 text-[#8F98A0] mb-4" />
                        <h3 className="text-xl font-medium text-[#C7D5E0] mb-2">
                          No Steam API Keys
                        </h3>
                        <p className="text-[#8F98A0] max-w-sm">
                          Generate your first HeavensPlay Web API key to start integrating with Steam services
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>

          {/* Footer Documentation - Steam Style */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="rounded-lg border border-[#4C6B8A] bg-[#171D25] p-6"
          >
            <div className="text-center">
              <p className="text-sm text-[#8F98A0] mb-2">
                Need help with HeavensPlay Web API integration?
              </p>
              <div className="flex justify-center gap-4">
                <Link
                  href="/docs"
                  className="inline-flex items-center gap-2 text-[#66C0F4] hover:text-[#90BA3C] transition-colors font-medium"
                >
                  <BookOpen className="h-4 w-4" />
                  Heavens API Documentation
                </Link>
                <span className="text-[#4C6B8A]">|</span>
                <Link
                  href="/game-management"
                  className="inline-flex items-center gap-2 text-[#90BA3C] hover:text-[#66C0F4] transition-colors font-medium"
                >
                  <Package className="h-4 w-4" />
                  Game Management
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AuthGuard>
  );
}