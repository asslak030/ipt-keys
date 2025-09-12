import { NextRequest } from "next/server";
import { db } from "~/server/db";
import { items } from "~/server/db/schema";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    const categories = await db
      .select({
        category: items.category,
        count: sql<number>`count(*)`,
      })
      .from(items)
      .groupBy(items.category)
      .orderBy(items.category);

    return Response.json({
      success: true,
      data: categories.map(c => c.category),
    });

  } catch (error) {
    return Response.json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Failed to fetch categories",
      }
    }, { status: 500 });
  }
}