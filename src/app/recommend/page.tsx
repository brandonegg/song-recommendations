"use server";

import { getSimilarSongs } from "@/lib/queries/similar-songs";

export default async function RecommendPage() {
  const similarSongs = getSimilarSongs();

  return <div></div>;
}
