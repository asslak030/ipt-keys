import { error } from "console";
import type { NextRequest } from "next/server";
import { insertKey, listKeys, revokeKey } from "~/server/key";
import { CreateKeySchema, DeleteKeySchema } from "~/server/validation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name } = CreateKeySchema.parse(body);
    const created = await insertKey(name);
    return Response.json(created, { status: 201 });
  } catch (e: any) {
    return Response.json(
      { error: e.message ?? "Unknown error" },
      { status: 400 },
    );
  }
}

export async function GET() {
  const rows = await listKeys();
  const items = rows.map((k) => ({
    id: k.id,
    name: k.name,
    masked: `sk_live_...${k.last4}`,
    createdAt: k.createdAt,
    revoked: k.revoked,
  }));
  return Response.json({ items });
}

export async function DELETE(req: NextRequest) {
  try {
    const keyId = new URL(req.url).searchParams.get("keyId");
    const { keyId: parsedId } = DeleteKeySchema.parse({ keyId });
    const ok = await revokeKey(parsedId);
    if (!ok) return Response.json({ error: "Key not found" }, { status: 404 });
    return Response.json({ success: true });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 400 });
  }
}
