import { NextRequest } from "next/server";
import { verifyKey } from "~/server/key";
import { ilike } from "drizzle-orm";
import { db } from "~/server/db";
import { heroes } from "~/server/db/schema";

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key") ?? "";
  const result = await verifyKey(apiKey);

  if (!result.valid) {
    return Response.json({ error: result.reason }, { status: 401 });
  }

  const body = await req.json();

  if (!body || !body.postBody) {
    return Response.json(
      { error: "Invalid request body. input is required." },
      { status: 400 },
    );
  }

  try {
    const getHero = await db
      .select({
        id: heroes.id,
        heroName: heroes.heroName,
        role: heroes.role,
        pickRate: heroes.pickRate,
        description: heroes.description,
        heroImage: heroes.heroImage,
      })
      .from(heroes)
      .where(ilike(heroes.heroName, `%${body.postBody}%`));

    if (getHero.length === 0) {
      return Response.json(
        { error: "No hero found with the given name." },
        { status: 404 },
      );
    }

    return Response.json(
      {
        ok: true,
        message: "Hero found successfully.",
        hero: getHero[0],
        keyId: result.keyId,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return Response.json(
      { error: error.message ?? "Failed to fetch hero." },
      { status: 500 },
    );
  }
}
