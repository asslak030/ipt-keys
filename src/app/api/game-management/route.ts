import { NextRequest, NextResponse } from 'next/server';
import { db } from '~/server/db';
import { heroes } from '~/server/db/schema';

// GET - Fetch all games
export async function GET() {
  try {
    const allGames = await db.select().from(heroes);
    
    // Map database fields to frontend expected format
    const games = allGames.map(game => ({
      id: game.id.toString(),
      name: game.gameName || '',
      description: game.description || '',
      category: game.category || '',
      price: parseFloat(game.price || '0'),
      image: game.gameImage || ''
    }));

    return NextResponse.json(games);
  } catch (error) {
    console.error('Error fetching games:', error);
    return NextResponse.json(
      { error: 'Failed to fetch games' },
      { status: 500 }
    );
  }
}

// POST - Create a new game
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { name, description, category, price, image } = body;

    // Validate required fields
    if (!name || !description || !category || price === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: name, description, category, price' },
        { status: 400 }
      );
    }

    // Insert into database
    const [newGame] = await db.insert(heroes).values({
      gameName: name,
      description,
      category,
      price: price.toString(),
      gameImage: image || ''
    }).returning();

    // Check if newGame was returned
    if (!newGame) {
      return NextResponse.json(
        { error: 'Failed to create game - no data returned' },
        { status: 500 }
      );
    }

    // Return in frontend expected format
    const response = {
      id: newGame.id.toString(),
      name: newGame.gameName || '',
      description: newGame.description || '',
      category: newGame.category || '',
      price: parseFloat(newGame.price || '0'),
      image: newGame.gameImage || ''
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating game:', error);
    return NextResponse.json(
      { error: 'Failed to create game' },
      { status: 500 }
    );
  }
}