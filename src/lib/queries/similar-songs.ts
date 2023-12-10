import { cookies } from "next/headers";
import redis from "../redis";
import neo4j from "neo4j-driver";
import { neo4jDriver } from "../neo4j";
import { z } from "zod";
import { SongDetailsSchema } from "./song-search";

export async function getSimilarSongs() {
  const curationUuid = cookies().get("curation_uuid")?.value;
  const result = await redis.smembers(`curation:${curationUuid}`);

  if (result.length === 0) {
    return [];
  }

  const results: unknown[] = [];

  var session = neo4jDriver.session({
    defaultAccessMode: neo4j.session.READ,
  });

  try {
    const records = (
      await session.run(
        "MATCH (s1:Song WHERE s1.id IN $ids)-[r:IS_SIMILAR]->(s2:Song WHERE NOT s2.id IN $ids) RETURN s2.id as id, s2.name as name, s2.artists as artists, s2.artist_ids as artist_ids, s2.album as album, s2.album_id as album_id ORDER BY r.similarity DESC LIMIT $limit",
        {
          ids: result,
          limit: neo4j.int(10),
        },
      )
    ).records;

    records.forEach((record) => {
      results.push({
        id: record.get("id"),
        name: record.get("name"),
        artists: record
          .get("artists")
          .slice(1, -1)
          .split(", ")
          .map((input: string) => input.slice(1, -1)),
        artist_ids: record
          .get("artist_ids")
          .slice(1, -1)
          .split(", ")
          .map((input: string) => input.slice(1, -1)),
        album: record.get("album"),
        album_id: record.get("album_id"),
      });
    });
  } catch (e) {
    // do no harm
  }

  await session.close();
  return z.array(SongDetailsSchema).parse(results);
}
