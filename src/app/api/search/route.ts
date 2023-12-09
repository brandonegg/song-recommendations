import redis from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");

  const result = await redis.call(
    "ft.search",
    "songs_index",
    `@name: %%%${query}%%%`,
    "LIMIT",
    10,
  );

  return NextResponse.json(result, { status: 200 });
}
