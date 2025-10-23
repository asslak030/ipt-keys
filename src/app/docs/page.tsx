"use client";

import { UserButton } from "@clerk/nextjs";
import { Gamepad2, BookOpen, Terminal, ArrowLeft, Code, Server, Monitor, Gamepad, Joystick } from "lucide-react";
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
  platform: string;
}

export default function DocsPage() {
  const [key, setKey] = useState("");
  const [out, setOut] = useState("");
  const [gamesData, setGamesData] = useState<Game[]>([]);
  const [postResults, setPostResults] = useState<Game[]>([]);
  const [postBody, setPostBody] = useState("");

  // ✅ SAFE Helper function to get platform icon
  const getPlatformIcon = (platform: string | undefined | null) => {
    if (!platform) {
      return <Monitor size={16} className="text-gray-500" />;
    }
    
    const platformLower = platform.toLowerCase();
    if (platformLower.includes("pc")) {
      return <Monitor size={16} className="text-blue-500" />;
    } else if (platformLower.includes("x-box") || platformLower.includes("xbox")) {
      return <Gamepad size={16} className="text-green-500" />;
    } else if (platformLower.includes("nintendo")) {
      return <Joystick size={16} className="text-red-500" />;
    } else {
      return <Monitor size={16} className="text-gray-500" />;
    }
  };

  // ✅ SAFE platform display function
  const getPlatformDisplay = (platform: string | undefined | null) => {
    return platform || "Unknown Platform";
  };

  // GET all games
  async function runGET() {
    try {
      const res = await fetch(`${baseUrl}/api/ping`, {
        headers: { "x-api-key": key },
      });

      const data = await res.json();
      setOut(JSON.stringify(data, null, 2));

      if (data.data) {
        // ✅ SAFE data mapping with platform validation
        setGamesData(
          data.data.map((g: any) => ({
            id: g.id || 0,
            game_name: g.game_name || "Untitled Game",
            category: g.category || "Uncategorized",
            price: typeof g.price === 'number' ? g.price : 0,
            description: g.description || "",
            image_url: g.image_url,
            platform: g.platform || "Unknown Platform",
          }))
        );
        setPostResults([]);
      } else {
        setGamesData([]);
      }
    } catch (error) {
      console.error("GET request failed:", error);
      setOut(JSON.stringify({ error: "GET request failed" }, null, 2));
      setGamesData([]);
    }
  }

  // POST search game by name
  async function runPOST() {
    try {
      const res = await fetch(`${baseUrl}/api/echo`, {
        method: "POST",
        headers: { "x-api-key": key, "Content-Type": "application/json" },
        body: JSON.stringify({ postBody }),
      });

      const data = await res.json();
      setOut(JSON.stringify(data, null, 2));

      if (data.game) {
        // ✅ SAFE data mapping with platform validation
        const results = Array.isArray(data.game) ? data.game : [data.game];
        setPostResults(
          results.map((g: any) => ({
            id: g.id || 0,
            game_name: g.game_name || "Untitled Game",
            category: g.category || "Uncategorized",
            price: typeof g.price === 'number' ? g.price : 0,
            description: g.description || "",
            image_url: g.image_url,
            platform: g.platform || "Unknown Platform",
          }))
        );
        setGamesData([]);
      } else {
        setPostResults([]);
      }
    } catch (error) {
      console.error("POST request failed:", error);
      setOut(JSON.stringify({ error: "POST request failed" }, null, 2));
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
                    HeavensPlay API Key
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
                    placeholder='{"postBody": "game name"}'
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
                    Game Database ({gamesData.length} games)
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
                      
                      {/* ✅ SAFE PLATFORM DISPLAY */}
                      <div className="flex items-center gap-2">
                        {getPlatformIcon(game.platform)}
                        <span className="text-sm font-medium text-[#C7D5E0]">
                          {getPlatformDisplay(game.platform)}
                        </span>
                      </div>

                      <p className="text-sm text-[#C7D5E0]">
                        <span className="font-semibold text-[#90BA3C]">Category:</span>{" "}
                        {game.category}
                      </p>
                      <p className="text-sm text-[#C7D5E0]">
                        <span className="font-semibold text-[#90BA3C]">Price:</span> ${game.price}
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
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder.png";
                          }}
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
                    Search Results ({postResults.length} games)
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
                      
                      {/* ✅ SAFE PLATFORM DISPLAY */}
                      <div className="flex items-center gap-2">
                        {getPlatformIcon(game.platform)}
                        <span className="text-sm font-medium text-[#C7D5E0]">
                          {getPlatformDisplay(game.platform)}
                        </span>
                      </div>

                      <p className="text-sm text-[#C7D5E0]">
                        <span className="font-semibold text-[#66C0F4]">Category:</span>{" "}
                        {game.category}
                      </p>
                      <p className="text-sm text-[#C7D5E0]">
                        <span className="font-semibold text-[#66C0F4]">Price:</span> ${game.price}
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
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder.png";
                          }}
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