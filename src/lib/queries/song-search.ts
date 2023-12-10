import redis from "@/lib/redis";
import {
  SearchResponse,
  SearchResponseSchema,
} from "../schemas/responses/search";

const MAX_LEV = 3;
const LIMIT = 10;

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

const searchNameArtist = async (
  levDist: number,
  limit: number,
  query: string,
) => {
  console.log(`@name|artists:(${makeConditionalString(query, levDist)}`);
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

export const searchSongs = async (query: string, limit: number) => {
  query = query.trim();
  const results: SearchResponse["results"] = [];

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

  return SearchResponseSchema.parse({
    count: results.length,
    results: results,
  });
};
