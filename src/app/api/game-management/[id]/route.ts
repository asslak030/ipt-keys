import { NextRequest, NextResponse } from 'next/server';
import { db } from '~/server/db';
import { heroes } from '~/server/db/schema';
import { eq } from 'drizzle-orm';

// GET - Fetch single game by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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

    // Map to frontend format
    const response = {
      id: game.id.toString(),
      name: game.gameName || '',
      description: game.description || '',
      category: game.category || '',
      price: parseFloat(game.price || '0'),
      image: game.gameImage || ''
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
    const gameId = parseInt(params.id);
    
    if (isNaN(gameId)) {
      return NextResponse.json(
        { error: 'Invalid game ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, description, category, price, image } = body;

    // Check if game exists
    const [existingGame] = await db.select()
      .from(heroes)
      .where(eq(heroes.id, gameId));

    if (!existingGame) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      );
    }

    // Update game
    const [updatedGame] = await db.update(heroes)
      .set({
        gameName: name,
        description,
        category,
        price: price.toString(),
        gameImage: image || ''
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
      name: updatedGame.gameName || '',
      description: updatedGame.description || '',
      category: updatedGame.category || '',
      price: parseFloat(updatedGame.price || '0'),
      image: updatedGame.gameImage || ''
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
    const gameId = parseInt(params.id);
    
    if (isNaN(gameId)) {
      return NextResponse.json(
        { error: 'Invalid game ID' },
        { status: 400 }
      );
    }

    // Check if game exists
    const [existingGame] = await db.select()
      .from(heroes)
      .where(eq(heroes.id, gameId));

    if (!existingGame) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
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