"use client";

import { UserButton } from "@clerk/nextjs";
import { KeyRound, Shield, BookOpen, Sword, Zap } from "lucide-react";
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
  const [postBody, setPostBody] = useState("Fanny");

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
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e17] via-[#1a243a] to-[#2c3e50] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-8">
          {/* Top Toolbar - Enhanced Design */}
          <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between rounded-2xl border border-[#3a506b] bg-[#122036]/80 p-4 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-[#ff0058]/20 p-2">
                <Sword className="h-6 w-6 text-[#ff0058]" />
              </div>
              <h1 className="bg-gradient-to-r from-[#ff0058] to-[#ff7a00] bg-clip-text text-2xl font-bold text-white sm:text-3xl">
                BattlePedia
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 border-[#ff7a00]/30 bg-[#ff7a00]/10 text-[#ff7a00] transition-all hover:scale-105 hover:bg-[#ff7a00]/20"
                  aria-label="Go to Dashboard"
                >
                  <KeyRound className="h-4 w-4" /> Command Center
                </Button>
              </Link>
              <div className="rounded-full border border-[#3a506b] bg-[#122036] p-1">
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
            className="rounded-2xl border border-[#3a506b] bg-[#122036]/80 p-8 backdrop-blur-sm"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-[#ff0058]/20 p-2">
                <BookOpen className="h-6 w-6 text-[#ff0058]" />
              </div>
              <h2 className="text-2xl font-bold text-white">Battle Guide</h2>
            </div>
            <p className="text-gray-300">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-[#ff0058] to-[#ff7a00] bg-clip-text text-transparent">
                BattlePedia
              </span>{" "}
              API documentation. Learn how to forge, command, and deploy your
              battle keys.
            </p>
          </motion.div>
        </div>

        <div className="mx-auto mt-8 grid max-w-6xl gap-8 md:grid-cols-3">
          {/* How Authentication Works Card */}
          <Card className="rounded-2xl border border-[#3a506b] bg-[#122036]/80 shadow-lg backdrop-blur-sm md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-bold text-white">
                <Shield className="h-5 w-5 text-[#ff0058]" />
                Battle Key Deployment
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 text-gray-300">
              <p>
                Authenticate using the{" "}
                <code className="text-[#ff7a00]">x-api-key</code> header. Forge
                a key in the command center and guard it like a true warrior.
              </p>

              <Separator className="bg-[#ff0058]/20" />

              <div>
                <h3 className="font-semibold text-white">BATTLEGROUND URL</h3>
                <pre className="overflow-x-auto rounded-lg border border-[#3a506b] bg-[#1a243a] p-3 text-sm text-[#ff7a00]">
                  <code>{baseUrl + "/api"}</code>
                </pre>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* GET Section */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-white">GET /api/ping</h3>

                  <pre className="overflow-x-auto rounded-lg border border-[#3a506b] bg-[#1a243a] p-3 text-sm text-[#ff7a00]">
                    <code>{`curl -H 'x-api-key: <YOUR KEY>' ${baseUrl}/api/ping`}</code>
                  </pre>

                  <pre className="overflow-x-auto rounded-lg border border-[#3a506b] bg-[#1a243a] p-3 text-sm text-[#ff7a00]">
                    <code>{`const r = await fetch('${baseUrl}/api/ping', {
  headers: { 'x-api-key': process.env.MY_KEY! }
});`}</code>
                  </pre>
                </div>

                {/* POST Section */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-white">POST /api/echo</h3>

                  <pre className="overflow-x-auto rounded-lg border border-[#3a506b] bg-[#1a243a] p-3 text-sm text-[#ff7a00]">
                    <code>
                      {`curl -X POST \\
                      -H 'x-api-key: <YOUR KEY>' \\
                      -H 'Content-Type: application/json' \\
                      -d '{"hello": "world"}' \\
                      ${baseUrl}/api/echo`}
                    </code>
                  </pre>

                  <pre className="overflow-x-auto rounded-lg border border-[#3a506b] bg-[#1a243a] p-3 text-sm text-[#ff7a00]">
                    <code>
                      {`const r = await fetch(\`${baseUrl}/api/echo\`, {
                        method: 'POST',
                        headers: {
                          'x-api-key': process.env.MY_KEY!,
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ hello: 'world' }),
                      });`}
                    </code>
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interactive Tester Card */}
          <Card className="h-full rounded-2xl border border-[#ff0058]/20 bg-[#122036]/80 shadow-lg backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-bold text-white">
                Battle Simulator
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* API Key Input */}
              <Input
                placeholder="Paste your battle key (sk...)"
                className="border-[#3a506b] bg-[#1a243a] text-white"
                value={key}
                onChange={(e) => setKey(e.target.value)}
              />

              {/* Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button
                  className="bg-gradient-to-r from-[#ff0058] to-[#ff7a00] text-white hover:from-[#ff0058] hover:to-[#ff7a00] hover:shadow-[#ff0058]/30"
                  onClick={runGET}
                >
                  Test GET /api/ping
                </Button>
                <Button
                  variant="secondary"
                  className="bg-gradient-to-r from-[#ff0058] to-[#ff7a00] text-white hover:from-[#ff0058] hover:to-[#ff7a00] hover:shadow-[#ff0058]/30"
                  onClick={runPOST}
                >
                  Test POST /api/echo
                </Button>
              </div>

              {/* POST Body Input */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-300">
                  Battle Command (JSON)
                </Label>
                <Textarea
                  className="border-[#3a506b] bg-[#1a243a] text-white"
                  rows={5}
                  value={postBody}
                  onChange={(e) => setPostBody(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-300">
                  Battle Report
                </Label>
                <Textarea
                  className="border-[#3a506b] bg-[#1a243a] font-mono text-sm text-white"
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
