import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";
import { heroes } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

// ✅ Helper to safely get a non-null userId
async function getUserIdOrThrow() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return userId as string;
}

// ====================
// GET - Fetch single game by ID
// ====================
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserIdOrThrow();

    const gameId = parseInt(params.id);
    if (isNaN(gameId)) {
      return NextResponse.json({ error: "Invalid game ID" }, { status: 400 });
    }

    const [game] = await db.select().from(heroes).where(eq(heroes.id, gameId));

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    if (game.userId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized access to game" },
        { status: 403 }
      );
    }

    const response = {
      id: game.id.toString(),
      name: game.gameName,
      description: game.description,
      category: game.category,
      price: parseFloat(game.price as unknown as string),
      image: game.imageUrl,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching game:", error);
    if ((error as Error).message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to fetch game" }, { status: 500 });
  }
}

// ====================
// PUT - Update a game
// ====================
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserIdOrThrow();

    const gameId = parseInt(params.id);
    if (isNaN(gameId)) {
      return NextResponse.json({ error: "Invalid game ID" }, { status: 400 });
    }

    const body = await request.json();
    const { name, description, category, price, image } = body;

    if (!name || !description || !category || price === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: name, description, category, price" },
        { status: 400 }
      );
    }

    const [existingGame] = await db.select().from(heroes).where(eq(heroes.id, gameId));

    if (!existingGame) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    if (existingGame.userId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized access to game" },
        { status: 403 }
      );
    }

    const [updatedGame] = await db
      .update(heroes)
      .set({
        gameName: name,
        description,
        category,
        price: price.toString(),
        imageUrl: image,
      })
      .where(eq(heroes.id, gameId))
      .returning();

    if (!updatedGame) {
      return NextResponse.json({ error: "Failed to update game" }, { status: 500 });
    }

    const response = {
      id: updatedGame.id.toString(),
      name: updatedGame.gameName,
      description: updatedGame.description,
      category: updatedGame.category,
      price: parseFloat(updatedGame.price as unknown as string),
      image: updatedGame.imageUrl,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error updating game:", error);
    if ((error as Error).message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to update game" }, { status: 500 });
  }
}

// ====================
// DELETE - Delete a game
// ====================
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserIdOrThrow();

    const gameId = parseInt(params.id);
    if (isNaN(gameId)) {
      return NextResponse.json({ error: "Invalid game ID" }, { status: 400 });
    }

    const [existingGame] = await db.select().from(heroes).where(eq(heroes.id, gameId));

    if (!existingGame) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    if (existingGame.userId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized access to game" },
        { status: 403 }
      );
    }

    await db.delete(heroes).where(eq(heroes.id, gameId));

    return NextResponse.json({ message: "Game deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting game:", error);
    if ((error as Error).message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to delete game" }, { status: 500 });
  }
}
