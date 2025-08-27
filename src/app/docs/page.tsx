"use client";

import { UserButton } from "@clerk/nextjs";
import { KeyRound, Shield, BookOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import AuthGuard from "../component/AuthGuard";
import { motion } from "framer-motion";

export default function DocsPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-8">
          {/* Top Toolbar - Enhanced Design */}
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
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 border-indigo-400/30 bg-indigo-500/10 text-indigo-300 transition-all hover:scale-105 hover:bg-indigo-500/20"
                  aria-label="Go to Dashboard"
                >
                  <KeyRound className="h-4 w-4" /> Dashboard
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

          {/* Documentation content would go here */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl bg-gray-800/50 p-8 backdrop-blur-sm"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-indigo-500/10 p-2">
                <BookOpen className="h-6 w-6 text-indigo-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Documentation</h2>
            </div>
            <p>
              Welcome to{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                KeyVault
              </span>{" "}
              API documentation. Learn how to create, manage, and use your API
              keys securely.
            </p>
          </motion.div>
        </div>
      </div>
    </AuthGuard>
  );
}
