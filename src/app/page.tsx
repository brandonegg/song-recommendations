import { SearchBar } from "./components/search-bar";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="p-32">
        <SearchBar />
      </div>
    </main>
  );
}
