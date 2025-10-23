import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";
import { heroes } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

// ===============================
// GET - Fetch all games for the user
// ===============================
export async function GET() {
  console.log("🚀 GET /api/game-management called");
  try {
    const { userId } = await auth();
    console.log("🔐 User ID:", userId);
    
    if (!userId) {
      console.log("❌ No user ID - unauthorized");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("🗄️ Fetching games from database...");
    const allGames = await db.select().from(heroes).where(eq(heroes.userId, userId));
    console.log("✅ Found games:", allGames.length);

    const games = allGames.map((game) => ({
      id: game.id.toString(),
      name: game.gameName,
      description: game.description,
      category: game.category,
      price: parseFloat(game.price as unknown as string),
      image: game.imageUrl,
      platform: game.platform,
    }));

    return NextResponse.json(games, { status: 200 });
  } catch (error) {
    console.error("💥 Error fetching games:", error);
    return NextResponse.json({ error: "Failed to fetch games" }, { status: 500 });
  }
}

// ===============================
// POST - Add new game
// ===============================
export async function POST(request: NextRequest) {
  console.log("🚀 POST /api/game-management called");
  
  try {
    console.log("🔐 Getting user auth...");
    const { userId } = await auth();
    console.log("🔐 User ID:", userId);
    
    if (!userId) {
      console.log("❌ No user ID - unauthorized");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("📥 Parsing request body...");
    const body = await request.json();
    console.log("📥 Request body received:", JSON.stringify(body, null, 2));
    
    const { name, description, category, price, image, platform } = body;

    // ✅ Validate input
    console.log("🔍 Validating fields:", { 
      name: !!name, 
      description: !!description, 
      category: !!category, 
      price: price !== undefined,
      platform: !!platform 
    });
    
    if (!name || !description || !category || price === undefined || !platform) {
      console.log("❌ Missing required fields:", {
        name: !name ? "MISSING" : "OK",
        description: !description ? "MISSING" : "OK", 
        category: !category ? "MISSING" : "OK",
        price: price === undefined ? "MISSING" : "OK",
        platform: !platform ? "MISSING" : "OK"
      });
      return NextResponse.json(
        { error: "Missing required fields: name, description, category, price, platform" },
        { status: 400 }
      );
    }

    console.log("✅ All fields validated successfully");
    console.log("🗄️ Attempting database insert...");

    // ✅ Insert new record
    const insertData = {
      gameName: name,
      description,
      category,
      price: price.toString(),
      imageUrl: image,
      platform: platform,
      userId,
    };
    
    console.log("📝 Insert data prepared:", JSON.stringify(insertData, null, 2));

    try {
      console.log("🗄️ Executing database insert...");
      const [newGame] = await db
        .insert(heroes)
        .values(insertData)
        .returning();

      console.log("✅ Database insert result:", newGame);

      if (!newGame) {
        console.log("❌ No data returned from insert");
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
        platform: newGame.platform,
      };

      console.log("🎉 Success! Returning response:", response);
      return NextResponse.json(response, { status: 201 });
    } catch (dbError) {
      console.error("💥 Database error:", dbError);
      console.error("💥 Database error details:", {
        message: dbError instanceof Error ? dbError.message : 'Unknown DB error',
        stack: dbError instanceof Error ? dbError.stack : 'No stack trace'
      });
      throw dbError; // Re-throw to be caught by outer catch
    }
  } catch (error) {
    console.error("💥 Top-level error creating game:", error);
    console.error("💥 Error name:", error instanceof Error ? error.name : 'N/A');
    console.error("💥 Error message:", error instanceof Error ? error.message : 'Unknown error');
    console.error("💥 Error stack:", error instanceof Error ? error.stack : 'No stack trace');
    
    return NextResponse.json({ 
      error: `Failed to create game: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }, { status: 500 });
  }
}

// ===============================
// PUT - Update existing game
// ===============================
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  console.log("🚀 PUT /api/game-management called with ID:", params.id);
  
  try {
    const { userId } = await auth();
    console.log("🔐 User ID:", userId);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log("📥 Request body:", body);
    
    const { name, description, category, price, image, platform } = body;

    if (!name || !description || !category || price === undefined || !platform) {
      return NextResponse.json(
        { error: "Missing required fields: name, description, category, price, platform" },
        { status: 400 }
      );
    }

    const gameId = parseInt(params.id);
    if (isNaN(gameId)) {
      return NextResponse.json({ error: "Invalid game ID" }, { status: 400 });
    }

    const [updatedGame] = await db
      .update(heroes)
      .set({
        gameName: name,
        description,
        category,
        price: price.toString(),
        imageUrl: image,
        platform: platform,
      })
      .where(eq(heroes.id, gameId))
      .returning();

    if (!updatedGame) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    const response = {
      id: updatedGame.id.toString(),
      name: updatedGame.gameName,
      description: updatedGame.description,
      category: updatedGame.category,
      price: parseFloat(updatedGame.price as unknown as string),
      image: updatedGame.imageUrl,
      platform: updatedGame.platform,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error updating game:", error);
    return NextResponse.json({ error: "Failed to update game" }, { status: 500 });
  }
}

// ===============================
// DELETE - Remove game
// ===============================
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const gameId = parseInt(params.id);
    if (isNaN(gameId)) {
      return NextResponse.json({ error: "Invalid game ID" }, { status: 400 });
    }

    const [existingGame] = await db
      .select()
      .from(heroes)
      .where(eq(heroes.id, gameId));

    if (!existingGame) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    if (existingGame.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await db.delete(heroes).where(eq(heroes.id, gameId));

    return NextResponse.json({ message: "Game deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting game:", error);
    return NextResponse.json({ error: "Failed to delete game" }, { status: 500 });
  }
}