import redis from "@/lib/redis";
import { z } from "zod";

const MAX_LEV = 3;
const LIMIT = 10;

export const SongDetailsSchema = z.object({
  id: z.string(),
  name: z.string(),
  artists: z.array(z.string()),
  artist_ids: z.array(z.string()),
  album: z.string(),
  album_id: z.string(),
});

export type SongDetails = z.infer<typeof SongDetailsSchema>;

const makeConditionalString = (input: string, levDist: number) => {
  return input
    .split(" ")
    .filter((substr) => {
      return substr.trim().length !== 0;
    })
    .map((substr) => {
      return `${"%".repeat(levDist)}${substr.trim()}${"%".repeat(levDist)}`;
    })
    .join("|");
};

function parseSongQueryResults(result: unknown) {
  return (result as unknown[])
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
}

const searchNameArtist = async (
  levDist: number,
  limit: number,
  query: string,
) => {
  const result = await redis.call(
    "ft.search",
    "songs_index",
    `@name|artists:(${makeConditionalString(query, levDist)})`,
    "LIMIT",
    0,
    limit,
  );

  try {
    const count = (result as number[])[0]!;
    const results = parseSongQueryResults(result);

    return { count, results };
  } catch {
    return {
      count: 0,
      results: [],
    };
  }
};

export const searchSongs = async (query: string, limit: number) => {
  query = query.trim();
  const results: SongDetails[] = [];

  if (query.length === 0) {
    return {
      count: 0,
      results,
    };
  }

  for (let i = 0; i < MAX_LEV; i++) {
    const redisMatches = await searchNameArtist(i, LIMIT, query ?? "");
    const newLen = results.push(...redisMatches.results);

    if (newLen >= LIMIT) {
      break;
    }
  }

  return z
    .object({
      count: z.number(),
      results: z.array(SongDetailsSchema),
    })
    .parse({
      count: results.length,
      results: results,
    });
};

export async function findByIds(ids: string[]) {
  if (ids.length === 0) {
    return [];
  }

  const result = await redis.call(
    "ft.search",
    "songs_index",
    `@id:${ids.join("|")}`,
  );

  const results = parseSongQueryResults(result);
  return z.array(SongDetailsSchema).parse(results);
}
