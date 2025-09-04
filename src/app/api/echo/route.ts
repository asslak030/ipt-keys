import type { NextRequest } from "next/server";
import { verifyKey } from "~/server/key";

export async function POST(req: NextRequest) {
  // Get API key from headers
  const apiKey = req.headers.get("x-api-key") ?? "";

  // Verify key
  const result = await verifyKey(apiKey);

  if (!result.valid) {
    return Response.json(
      { error: result.reason },
      { status: 401 }
    );
  }

  // Parse request body
  const body = await req.json();
  // const body = await req.json().catch(() => ({}));

  // Success response
  return Response.json(
    {
      ok: true,
      message: "Hello POST",
      recieved: body,
      keyId: result.keyId,
    },
    { status: 200 }
  );
}
