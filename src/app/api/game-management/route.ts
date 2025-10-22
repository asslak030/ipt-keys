import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";
import { heroes } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

// ===============================
// GET - Fetch all games for the user
// ===============================
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Correct Drizzle filter syntax
    const allGames = await db.select().from(heroes).where(eq(heroes.userId, userId));

    const games = allGames.map((game) => ({
      id: game.id.toString(),
      name: game.gameName,
      description: game.description,
      category: game.category,
      price: parseFloat(game.price as unknown as string),
      image: game.imageUrl,
    }));

    return NextResponse.json(games, { status: 200 });
  } catch (error) {
    console.error("Error fetching games:", error);
    return NextResponse.json({ error: "Failed to fetch games" }, { status: 500 });
  }
}

// ===============================
// POST - Add new game
// ===============================
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, category, price, image } = body;

    // ✅ Validate input
    if (!name || !description || !category || price === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: name, description, category, price" },
        { status: 400 }
      );
    }

    // ✅ Insert new record
    const [newGame] = await db
      .insert(heroes)
      .values({
        gameName: name,
        description,
        category,
        price: price.toString(),
        imageUrl: image,
        userId,
      })
      .returning();

    if (!newGame) {
      return NextResponse.json(
        { error: "Failed to create game - no data returned" },
        { status: 500 }
      );
    }

    const response = {
      id: newGame.id.toString(),
      name: newGame.gameName,
      description: newGame.description,
      category: newGame.category,
      price: parseFloat(newGame.price as unknown as string),
      image: newGame.imageUrl,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Error creating game:", error);
    return NextResponse.json({ error: "Failed to create game" }, { status: 500 });
  }
}
