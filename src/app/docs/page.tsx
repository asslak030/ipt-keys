"use client";

import { UserButton } from "@clerk/nextjs";
import { Gamepad2, BookOpen, Terminal, ArrowLeft, Code, Server } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import AuthGuard from "../component/AuthGuard";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { useState } from "react";

const baseUrl =
  typeof window !== "undefined"
    ? window.location.origin
    : "https://ipt-final-topaz.vercel.app/";

interface Game {
  id: number;
  game_name: string;
  category: string;
  price: number;
  description: string;
  image_url?: string;
}

export default function DocsPage() {
  const [key, setKey] = useState("");
  const [out, setOut] = useState("");
  const [gamesData, setGamesData] = useState<Game[]>([]);
  const [postResults, setPostResults] = useState<Game[]>([]);
  const [postBody, setPostBody] = useState("");

  // GET all games
  async function runGET() {
    const res = await fetch(`${baseUrl}/api/ping`, {
      headers: { "x-api-key": key },
    });

    const data = await res.json();
    setOut(JSON.stringify(data, null, 2));

    if (data.data) {
      // Map response to consistent Game type
      setGamesData(
        data.data.map((g: any) => ({
          id: g.id,
          game_name: g.game_name,
          category: g.category,
          price: g.price,
          description: g.description,
          image_url: g.image_url,
        }))
      );
      setPostResults([]);
    } else {
      setGamesData([]);
    }
  }

  // POST search game by name
  async function runPOST() {
    const res = await fetch(`${baseUrl}/api/echo`, {
      method: "POST",
      headers: { "x-api-key": key, "Content-Type": "application/json" },
      body: JSON.stringify({ postBody }),
    });

    const data = await res.json();
    setOut(JSON.stringify(data, null, 2));

    if (data.game) {
      setPostResults(
        (Array.isArray(data.game) ? data.game : [data.game]).map((g: any) => ({
          id: g.id,
          game_name: g.game_name,
          category: g.category,
          price: g.price,
          description: g.description,
          image_url: g.image_url,
        }))
      );
      setGamesData([]);
    } else {
      setPostResults([]);
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-[#1B2838] via-[#2A475E] to-[#3C5A78] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Header */}
          <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between rounded-xl border border-[#4C6B8A] bg-[#171D25] p-6 shadow-lg"
          >
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  className="flex items-center gap-3 border-[#66C0F4] bg-[#66C0F4]/10 text-[#66C0F4] hover:bg-[#66C0F4]/20 hover:text-white transition-all duration-300"
                >
                  <ArrowLeft className="h-5 w-5" />
                  Back to Dashboard
                </Button>
              </Link>

              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-gradient-to-br from-[#66C0F4] to-[#4B9CD3] p-3 shadow-md">
                  <Terminal className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="bg-gradient-to-r from-[#66C0F4] to-[#90BA3C] bg-clip-text text-3xl font-bold text-transparent">
                    GameVault API
                  </h1>
                  <p className="text-sm text-[#8F98A0]">Developer Documentation</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-full border-2 border-[#66C0F4]/50 bg-[#1B2838] p-1">
                <UserButton appearance={{ elements: { avatarBox: "h-8 w-8" } }} />
              </div>
            </div>
          </motion.header>

          {/* API Testing & Docs */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* API Tester Card */}
            <Card className="rounded-xl border border-[#4C6B8A] bg-[#1B2838] shadow-lg h-fit lg:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-bold text-white">
                  <Code className="h-5 w-5 text-[#90BA3C]" />
                  API Testing Suite
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-[#C7D5E0]">API Key</Label>
                  <Input
                    placeholder="Enter your API key (sk...)"
                    className="border-[#4C6B8A] bg-[#171D25] text-white placeholder-[#8F98A0]"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    className="bg-gradient-to-r from-[#66C0F4] to-[#4B9CD3] text-white hover:shadow-lg flex-1"
                    onClick={runGET}
                  >
                    Test GET /api/ping
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-[#90BA3C] to-[#7AA32A] text-white hover:shadow-lg flex-1"
                    onClick={runPOST}
                  >
                    Test POST /api/echo
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-[#C7D5E0]">
                    Request Body (JSON)
                  </Label>
                  <Textarea
                    className="border-[#4C6B8A] bg-[#171D25] text-white placeholder-[#8F98A0]"
                    rows={4}
                    value={postBody}
                    onChange={(e) => setPostBody(e.target.value)}
                    placeholder='{"query": "search"}'
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-[#C7D5E0]">Response</Label>
                  <Textarea
                    className="border-[#4C6B8A] bg-[#171D25] font-mono text-sm text-white"
                    rows={8}
                    readOnly
                    value={out}
                    placeholder="API response will appear here..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* GET Games Database */}
            {gamesData.length > 0 && (
              <Card className="rounded-xl border border-[#4C6B8A] bg-[#1B2838] shadow-lg lg:col-span-3">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl font-bold text-white">
                    <Gamepad2 className="h-5 w-5 text-[#66C0F4]" />
                    Game Database
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {gamesData.map((game) => (
                    <div
                      key={game.id}
                      className="flex flex-col gap-3 rounded-lg border border-[#4C6B8A] bg-[#171D25] p-4 hover:border-[#66C0F4] transition-colors"
                    >
                      <h3 className="text-lg font-bold text-[#66C0F4]">{game.game_name}</h3>
                      <p className="text-xs text-[#8F98A0]">ID: {game.id}</p>
                      <p className="text-sm text-[#C7D5E0]">
                        <span className="font-semibold text-[#90BA3C]">Category:</span>{" "}
                        {game.category}
                      </p>
                      <p className="text-sm text-[#C7D5E0]">
                        <span className="font-semibold text-[#90BA3C]">Price:</span> ₱{game.price}
                      </p>
                      <p className="text-sm text-[#C7D5E0]">
                        <span className="font-semibold text-[#90BA3C]">Description:</span>{" "}
                        {game.description}
                      </p>
                      {game.image_url && (
                        <img
                          src={game.image_url}
                          alt={game.game_name}
                          className="mt-3 rounded-lg w-full h-40 object-cover"
                        />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* POST Search Result */}
            {postResults.length > 0 && (
              <Card className="rounded-xl border border-[#4C6B8A] bg-[#1B2838] shadow-lg lg:col-span-3">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl font-bold text-white">
                    <Code className="h-5 w-5 text-[#90BA3C]" />
                    Search Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {postResults.map((game) => (
                    <div
                      key={game.id}
                      className="flex flex-col gap-3 rounded-lg border border-[#4C6B8A] bg-[#171D25] p-4 hover:border-[#90BA3C] transition-colors"
                    >
                      <h3 className="text-lg font-bold text-[#90BA3C]">{game.game_name}</h3>
                      <p className="text-xs text-[#8F98A0]">ID: {game.id}</p>
                      <p className="text-sm text-[#C7D5E0]">
                        <span className="font-semibold text-[#66C0F4]">Category:</span>{" "}
                        {game.category}
                      </p>
                      <p className="text-sm text-[#C7D5E0]">
                        <span className="font-semibold text-[#66C0F4]">Price:</span> ₱{game.price}
                      </p>
                      <p className="text-sm text-[#C7D5E0]">
                        <span className="font-semibold text-[#66C0F4]">Description:</span>{" "}
                        {game.description}
                      </p>
                      {game.image_url && (
                        <img
                          src={game.image_url}
                          alt={game.game_name}
                          className="mt-3 rounded-lg w-full h-40 object-cover"
                        />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
