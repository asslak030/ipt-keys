import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";
import { heroes } from "~/server/db/schema";
import { verifyKey } from "~/server/key";
import { ratelimiter } from "~/server/ratelimit";

export async function GET(req: NextRequest) {
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
            "Retry-After": String(
              Math.max(1, Math.ceil((+reset - Date.now()) / 1000))
            ),
            "X-RateLimit-Limit": String(limit),
            "X-RateLimit-Remaining": String(Math.max(0, remaining)),
          },
        }
      );
    }

    // 🧩 Fetch all games
    const allGames = await db
      .select({
        id: heroes.id,
        game_name: heroes.gameName,
        category: heroes.category,
        price: heroes.price,
        description: heroes.description,
        image_url: heroes.imageUrl, 
      })
      .from(heroes);

    // 🧩 Handle empty result
    if (allGames.length === 0) {
      return NextResponse.json(
        {
          ok: true,
          message: "No games found in the database.",
          data: [],
        },
        {
          status: 200,
          headers: {
            "X-RateLimit-Limit": String(limit),
            "X-RateLimit-Remaining": String(Math.max(0, remaining)),
          },
        }
      );
    }

    // 🧩 Successful response
    return NextResponse.json(
      {
        ok: true,
        message: "Games fetched successfully.",
        keyId: result.keyId,
        data: allGames,
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
    console.error("Error fetching games:", error);

    return NextResponse.json(
      { error: error.message ?? "Failed to fetch games." },
      { status: 500 }
    );
  }
}
