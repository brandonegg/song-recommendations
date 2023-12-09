import redis from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";

const MAX_LEV = 3;
const LIMIT = 10;

export const searchRedis = async (levDist: number, limit: number, query: string) => {
  const result = await redis.call(
    "ft.search",
    "songs_index",
    `@artists:${"%".repeat(levDist)}${query}${"%".repeat(
      levDist,
    )} | @name:${"%".repeat(levDist)}${query}${"%".repeat(levDist)}`,
    "LIMIT",
    0,
    limit,
  );

  try {
    const count = (result as number[])[0]!;
    const results = (result as unknown[])
      .slice(1)
      .filter((_, i) => {
        return i % 2 !== 0; // ignore even indices = object key
      })
      .map((item) => {
        const { artists, artist_ids, ...object } = JSON.parse(
          (item as string[])[1],
        );

        return {
          ...object,
          artists: artists.split(", "),
          artist_ids: artist_ids.split(", "),
        };
      });

    return { count, results };
  } catch {
    return {
      count: 0,
      results: [],
    };
  }
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");
  const results = [];

  for (let i = 0; i < MAX_LEV; i++) {
    const redisMatches = await searchRedis(i, LIMIT, query ?? '');
    const newLen = results.push(...redisMatches.results);

    if (newLen >= LIMIT) {
      break;
    }
  }

  return NextResponse.json({
    count: results.length,
    results: results,
  }, {status: 200})
}
