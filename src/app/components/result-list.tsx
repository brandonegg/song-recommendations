import { searchSongs } from "@/lib/queries/song-search";
import { SongLineItem } from "./song-line-item";

export default async function ResultList({ query }: { query: string }) {
  const search = await searchSongs(query, 10);

  return (
    <>
      {search.results.length > 0 ? (
        <div className="h-[1px] mx-auto w-full max-w-[300px] bg-gray-100/10" />
      ) : null}

      <div className="pt-8 w-full max-w-[450px] mx-auto space-y-3">
        {search.results.map((song, i) => {
          return <SongLineItem {...song} key={i} showAddToCuration />;
        })}
      </div>
    </>
  );
}
