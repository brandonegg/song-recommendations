import redis from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");

  const result = await redis.call(
    "ft.search",
    "songs_index",
    `@artists:%${query}% | @name:%${query}%`,
    "LIMIT",
    0,
    10,
  );

  try {
    const count = (result as number[])[0]!;
    const results = (result as unknown[]).slice(1).filter((_, i) => {
      return i%2 !== 0; // ignore even indices = object key
    }).map((item) => {
      const {artists, artist_ids, ...object} = JSON.parse((item as string[])[1]);

      return {
        ...object,
        artists: artists.split(', '),
        artist_ids: artist_ids.split(', ')
      };
    })

    return NextResponse.json({count, results}, {status: 200});
  } catch (e) {
    return NextResponse.json({
      status: 404,
      message: (e as {message: string | undefined}).message ?? 'Unknown error'
    }, {status: 404});
  }
}
