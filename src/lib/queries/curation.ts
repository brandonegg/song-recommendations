import { getCurationCookie } from "../cookies";
import redis from "../redis";
import { findByIds } from "./song-search";

export async function addToCuration(curationUuid: string, songId: string) {
  await redis.sadd(`curation:${curationUuid}`, songId);
}

export async function getCurationUsingCookie() {
  const curationUuid = getCurationCookie();

  const result = await redis.smembers(`curation:${curationUuid}`);
  return findByIds(result);
}
