import { cookies } from "next/headers";
import redis from "../redis";
import { findByIds } from "./song-search";

export async function addToCuration(curationUuid: string, songId: string) {
  await redis.sadd(`curation:${curationUuid}`, songId);
}

export async function getCurationUsingCookie() {
  const curationUuid = cookies().get("curation_uuid")?.value;

  if (!curationUuid) {
    return [];
  }

  const result = await redis.smembers(`curation:${curationUuid}`);
  return findByIds(result);
}

export async function removeFromCuration(curationUuid: string, songId: string) {
  await redis.srem(`curation:${curationUuid}`, songId);
}
