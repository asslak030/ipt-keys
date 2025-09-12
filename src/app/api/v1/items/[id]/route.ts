import { NextRequest } from "next/server";
import { db } from "~/server/db";
import { items } from "~/server/db/schema";
import { eq } from "drizzle-orm";

interface Context {
  params: {
    id: string;
  };
}

export async function GET(req: NextRequest, { params }: Context) {
  try {
    const item = await db
      .select()
      .from(items)
      .where(eq(items.id, params.id))
      .limit(1);

    if (!item[0]) {
      return Response.json({
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Item not found"
        }
      }, { status: 404 });
    }

    return Response.json({
      success: true,
      data: item[0]
    });

  } catch (error) {
    return Response.json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Failed to fetch item"
      }
    }, { status: 500 });
  }
}