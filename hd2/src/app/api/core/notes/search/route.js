import { NextResponse } from "next/server";

export async function GET(req, res) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get("query");

  return new NextResponse(JSON.stringify({ err: `TODO: Search ${query}` }), {
    status: 400,
  });
}
