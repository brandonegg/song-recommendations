import { SongLineItem } from "@/app/components/song-line-item";
import { getSimilarSongs } from "@/lib/queries/similar-songs";

export default async function RecommendedList() {
  const similarSongs = await getSimilarSongs();

  return (
    <div className="space-y-4">
      {similarSongs.map((song, i) => {
        return <SongLineItem {...song} key={i} action="none" />;
      })}
    </div>
  );
}
