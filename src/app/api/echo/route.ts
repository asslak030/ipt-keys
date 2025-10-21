import { NextRequest, NextResponse } from "next/server";
import { verifyKey } from "~/server/key";
import { ilike } from "drizzle-orm";
import { db } from "~/server/db";
import { heroes } from "~/server/db/schema";
import { ratelimiter } from "~/server/ratelimit"; // ✅ Make sure this path is correct

export async function POST(req: NextRequest) {
  try {
    const apiKey = req.headers.get("x-api-key") ?? "";
    const result = await verifyKey(apiKey);

    // 🧩 Invalid API key handling
    if (!result.valid) {
      return NextResponse.json({ error: result.reason }, { status: 401 });
    }

    // 🧩 Apply rate limiting
    const { success, remaining, limit, reset } = await ratelimiter.limit(apiKey);

    if (!success) {
      return new NextResponse(
        JSON.stringify({ error: "Rate limit exceeded" }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(Math.max(1, Math.ceil((+reset - Date.now()) / 1000))),
            "X-RateLimit-Limit": String(limit),
            "X-RateLimit-Remaining": String(Math.max(0, remaining)),
          },
        }
      );
    }

    // 🧩 Parse JSON safely
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body." },
        { status: 400 }
      );
    }

    const searchQuery = body?.postBody?.trim();
    if (!searchQuery) {
      return NextResponse.json(
        { error: "Invalid request body. 'postBody' is required." },
        { status: 400 }
      );
    }

    // 🧩 Query games from DB
    const games = await db
      .select({
        id: heroes.id,
        game_name: heroes.gameName, // consistent naming for frontend
        category: heroes.category,
        price: heroes.price,
        description: heroes.description,
        game_image: heroes.gameImage, // consistent naming for frontend
      })
      .from(heroes)
      .where(ilike(heroes.gameName, `%${searchQuery}%`));

    // 🧩 Handle no matches
    if (games.length === 0) {
      return NextResponse.json(
        { error: "No games found with the given name." },
        {
          status: 404,
          headers: {
            "X-RateLimit-Limit": String(limit),
            "X-RateLimit-Remaining": String(Math.max(0, remaining)),
          },
        }
      );
    }

    // 🧩 Return successful response
    return NextResponse.json(
      {
        ok: true,
        message: "Games found successfully.",
        game: games, // return all matches
        keyId: result.keyId,
      },
      {
        status: 200,
        headers: {
          "X-RateLimit-Limit": String(limit),
          "X-RateLimit-Remaining": String(Math.max(0, remaining)),
        },
      }
    );
  } catch (error: any) {
    console.error("Error fetching game:", error);
    return NextResponse.json(
      { error: error.message ?? "Failed to fetch game." },
      { status: 500 }
    );
  }
}
