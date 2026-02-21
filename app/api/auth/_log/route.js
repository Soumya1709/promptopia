import { NextResponse } from "next/server";

// Stub endpoint to satisfy NextAuth client logging requests at /api/auth/_log
// NextAuth sometimes posts log events here; if the route is missing the client
// shows CLIENT_FETCH_ERROR. This endpoint returns a simple success.

export async function POST(req) {
  try {
    // consume body to avoid unhandled stream
    await req.text();
  } catch (e) {
    // ignore
  }
  return NextResponse.json({ ok: true });
}

export async function GET(req) {
  return NextResponse.json({ ok: true });
}

export const runtime = "nodejs";
