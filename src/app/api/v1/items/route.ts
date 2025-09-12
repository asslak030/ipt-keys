import { NextRequest } from "next/server";
import { db } from "~/server/db";
import { items } from "~/server/db/schema";
import { eq, desc, asc, like, and, or, gt, lt, gte, lte } from "drizzle-orm";
import { z } from "zod";
import { sql } from "drizzle-orm";

// Validation schemas
const GetItemsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  category: z.string().optional(),
  ownerId: z.string().optional(),
  sortBy: z.enum(["createdAt", "title", "category"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

const SearchItemsSchema = z.object({
  query: z.string().optional(),
  categories: z.array(z.string()).optional(),
  minDate: z.string().datetime().optional(),
  maxDate: z.string().datetime().optional(),
  sortBy: z.enum(["createdAt", "title", "category"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export async function GET(req: NextRequest) {
  try {
    const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
    const params = GetItemsSchema.parse(searchParams);

    const offset = (params.page - 1) * params.limit;

    // Build where conditions
    const whereConditions = [];
    if (params.category) {
      whereConditions.push(eq(items.category, params.category));
    }
    if (params.ownerId) {
      whereConditions.push(eq(items.ownerId, params.ownerId));
    }

    // Build order by
    const orderBy =
      params.order === "desc"
        ? desc(items[params.sortBy])
        : asc(items[params.sortBy]);

    // Query database
    const [data, total] = await Promise.all([
      db
        .select()
        .from(items)
        .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
        .orderBy(orderBy)
        .limit(params.limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)` })
        .from(items)
        .where(
          whereConditions.length > 0 ? and(...whereConditions) : undefined,
        ),
    ]);

    return Response.json({
      success: true,
      data,
      meta: {
        page: params.page,
        limit: params.limit,
        total: total[0]?.count ?? 0,
        totalPages: Math.ceil((total[0]?.count ?? 0) / params.limit),
      },
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid query parameters",
          details: error,
        },
      },
      { status: 400 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const params = SearchItemsSchema.parse(body);

    const offset = (params.page - 1) * params.limit;

    // Build search conditions
    const searchConditions = [];

    if (params.query) {
      searchConditions.push(
        or(
          like(items.title, `%${params.query}%`),
          like(items.description, `%${params.query}%`),
        ),
      );
    }

    if (params.categories && params.categories.length > 0) {
      searchConditions.push(
        or(...params.categories.map((cat) => eq(items.category, cat))),
      );
    }

    if (params.minDate) {
      searchConditions.push(gte(items.createdAt, new Date(params.minDate)));
    }

    if (params.maxDate) {
      searchConditions.push(lte(items.createdAt, new Date(params.maxDate)));
    }

    // Build order by
    const orderBy =
      params.order === "desc"
        ? desc(items[params.sortBy])
        : asc(items[params.sortBy]);

    // Query database
    const [data, total] = await Promise.all([
      db
        .select()
        .from(items)
        .where(
          searchConditions.length > 0 ? and(...searchConditions) : undefined,
        )
        .orderBy(orderBy)
        .limit(params.limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)` })
        .from(items)
        .where(
          searchConditions.length > 0 ? and(...searchConditions) : undefined,
        ),
    ]);

    return Response.json({
      success: true,
      data,
      meta: {
        page: params.page,
        limit: params.limit,
        total: total[0]?.count ?? 0,
        totalPages: Math.ceil((total[0]?.count ?? 0) / params.limit),
      },
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid search parameters",
          details: error,
        },
      },
      { status: 400 },
    );
  }
}
