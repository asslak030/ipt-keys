"use client";

import { UserButton } from "@clerk/nextjs";
import { KeyRound, Shield, BookOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import AuthGuard from "../component/AuthGuard";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "@radix-ui/react-separator";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { useState } from "react";

const baseUrl =
  typeof window !== "undefined"
    ? window.location.origin
    : "http://localhost:3000/api";

export default function DocsPage() {
  const [key, setKey] = useState("");
  const [out, setOut] = useState("");
  const [postBody, setPostBody] = useState("Hello Tester!");

  async function runGET() {
    const res = await fetch(`${baseUrl}/api/ping`, {
      headers: {
        "x-api-key": key,
      },
    });
    setOut(JSON.stringify(await res.json(), null, 2));
  }

  async function runPOST() {
    const res = await fetch(`${baseUrl}/api/echo`, {
      method: "POST",
      headers: {
        "x-api-key": key,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postBody }),
    });

    setOut(JSON.stringify(await res.json(), null, 2));
  }

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

        <div className="mx-auto mt-8 grid max-w-6xl gap-8 md:grid-cols-3">
          {/* How Authentication Works Card */}
          <Card className="rounded-2xl border border-indigo-500/20 bg-gray-800/50 shadow-lg backdrop-blur-sm md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-bold text-white">
                <KeyRound className="h-5 w-5 text-indigo-400" />
                How Authentication Works
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 text-gray-300">
              <p>
                Authenticate using the{" "}
                <code className="text-indigo-400">x-api-key</code> header. Create
                a key in <code className="text-indigo-400">/keys</code> and store
                it securely.
              </p>

              <Separator className="bg-indigo-500/20" />

              <div>
                <h3 className="font-semibold text-white">BASE URL</h3>
                <pre className="overflow-x-auto rounded-lg bg-gray-900/70 p-3 text-sm text-indigo-300">
                  <code>{baseUrl + "/api"}</code>
                </pre>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* GET Section */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-white">GET /api/ping</h3>

                  <pre className="overflow-x-auto rounded-lg bg-gray-900/70 p-3 text-sm text-indigo-300">
                    <code>{`curl -H 'x-api-key: <YOUR KEY>' ${baseUrl}/api/ping`}</code>
                  </pre>

                  <pre className="overflow-x-auto rounded-lg bg-gray-900/70 p-3 text-sm text-indigo-300">
                    <code>{`const r = await fetch('${baseUrl}/api/ping', {
  headers: { 'x-api-key': process.env.MY_KEY! }
});`}</code>
                  </pre>
                </div>

                {/* POST Section */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-white">POST /api/echo</h3>

                  <pre className="overflow-x-auto rounded-lg bg-gray-900/70 p-3 text-sm text-indigo-300">
                    <code>{`curl -X POST \\
  -H 'x-api-key: <YOUR KEY>' \\
  -H 'Content-Type: application/json' \\
  -d '{"hello": "world"}' \\
  ${baseUrl}/api/echo`}</code>
                  </pre>

                  <pre className="overflow-x-auto rounded-lg bg-gray-900/70 p-3 text-sm text-indigo-300">
                    <code>{`const r = await fetch(\`${baseUrl}/api/echo\`, {
  method: 'POST',
  headers: {
    'x-api-key': process.env.MY_KEY!,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ hello: 'world' }),
});`}</code>
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interactive Tester Card */}
          <Card className="rounded-2xl border border-indigo-500/20 bg-gray-800/50 shadow-lg backdrop-blur-sm h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-bold text-white">
                Interactive Tester
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* API Key Input */}
              <Input
                placeholder="Paste your API key (sk...)"
                className="bg-gray-900/70 text-white"
                value={key}
                onChange={(e) => setKey(e.target.value)}
              />

              {/* Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button
                  className="bg-indigo-600 text-white hover:bg-indigo-700"
                  onClick={runGET}
                >
                  Test GET /api/ping
                </Button>
                <Button
                  variant="secondary"
                  onClick={runPOST}
                  className="bg-purple-600 text-white hover:bg-purple-700"
                >
                  Test POST /api/echo
                </Button>
              </div>

              {/* POST Body Input */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-300">
                  POST body (JSON)
                </Label>
                <Textarea
                  className="bg-gray-900/70 text-white"
                  rows={5}
                  value={postBody}
                  onChange={(e) => setPostBody(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-300">
                  Response
                </Label>
                <Textarea 
                  className="bg-gray-900/70 text-white font-mono text-sm"
                  rows={10} 
                  readOnly 
                  value={out} 
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
}