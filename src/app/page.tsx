import { SearchBar } from "./components/search-bar";
import { SongLineItem } from "./components/song-line-item";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="p-32 flex flex-col">
        <div className="pb-8">
          <SearchBar />
        </div>

        <div className="h-[1px] mx-auto w-full max-w-[300px] bg-gray-100/10" />

        <div className="pt-8 w-full max-w-[400px] mx-auto">
          <SongLineItem onClick={undefined} />
        </div>
      </div>
    </main>
  );
}
