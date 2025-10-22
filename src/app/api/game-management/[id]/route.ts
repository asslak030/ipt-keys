import { NextRequest, NextResponse } from 'next/server';
import { db } from '~/server/db';
import { heroes } from '~/server/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';

// GET - Fetch single game by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const gameId = parseInt(params.id);
    
    if (isNaN(gameId)) {
      return NextResponse.json(
        { error: 'Invalid game ID' },
        { status: 400 }
      );
    }

    const [game] = await db.select()
      .from(heroes)
      .where(eq(heroes.id, gameId));

    if (!game) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      );
    }

    // Check if the game belongs to the current user
    if (game.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized access to game' },
        { status: 403 }
      );
    }

    // Map to frontend format
    const response = {
      id: game.id.toString(),
      name: game.gameName,
      description: game.description,
      category: game.category,
      price: parseFloat(game.price),
      image: game.imageUrl
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching game:', error);
    return NextResponse.json(
      { error: 'Failed to fetch game' },
      { status: 500 }
    );
  }
}

// PUT - Update a game
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const gameId = parseInt(params.id);
    
    if (isNaN(gameId)) {
      return NextResponse.json(
        { error: 'Invalid game ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, description, category, price, image } = body;

    // Validate required fields
    if (!name || !description || !category || price === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: name, description, category, price' },
        { status: 400 }
      );
    }

    // Check if game exists and belongs to user
    const [existingGame] = await db.select()
      .from(heroes)
      .where(eq(heroes.id, gameId));

    if (!existingGame) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      );
    }

    if (existingGame.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized access to game' },
        { status: 403 }
      );
    }

    // Update game
    const [updatedGame] = await db.update(heroes)
      .set({
        gameName: name,
        description,
        category,
        price: price.toString(),
        imageUrl: image
      })
      .where(eq(heroes.id, gameId))
      .returning();

    if (!updatedGame) {
      return NextResponse.json(
        { error: 'Failed to update game' },
        { status: 500 }
      );
    }

    // Return in frontend format
    const response = {
      id: updatedGame.id.toString(),
      name: updatedGame.gameName,
      description: updatedGame.description,
      category: updatedGame.category,
      price: parseFloat(updatedGame.price),
      image: updatedGame.imageUrl
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating game:', error);
    return NextResponse.json(
      { error: 'Failed to update game' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a game
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const gameId = parseInt(params.id);
    
    if (isNaN(gameId)) {
      return NextResponse.json(
        { error: 'Invalid game ID' },
        { status: 400 }
      );
    }

    // Check if game exists and belongs to user
    const [existingGame] = await db.select()
      .from(heroes)
      .where(eq(heroes.id, gameId));

    if (!existingGame) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      );
    }

    if (existingGame.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized access to game' },
        { status: 403 }
      );
    }

    // Delete game
    await db.delete(heroes)
      .where(eq(heroes.id, gameId));

    return NextResponse.json(
      { message: 'Game deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting game:', error);
    return NextResponse.json(
      { error: 'Failed to delete game' },
      { status: 500 }
    );
  }
}
