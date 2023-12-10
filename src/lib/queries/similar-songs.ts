import { cookies } from "next/headers";
import redis from "../redis";
import neo4j from "neo4j-driver";
import { neo4jDriver } from "../neo4j";

export async function getSimilarSongs() {
  const curationUuid = cookies().get("curation_uuid")?.value;
  const result = await redis.smembers(`curation:${curationUuid}`);

  if (result.length === 0) {
    return [];
  }

  var session = neo4jDriver.session({
    defaultAccessMode: neo4j.session.READ,
  });

  try {
    const records = (
      await session.run(
        "MATCH (s1:Song WHERE s1.id IN $ids)-[r:IS_SIMILAR]->(s2:Song) RETURN s2.name as name, s2.artists, s2.album ORDER BY r.similarity DESC LIMIT $limit",
        {
          ids: result,
          limit: neo4j.int(10),
        },
      )
    ).records;

    console.log(records);
  } catch (e) {
    // do no harm
  }

  await session.close();
}
