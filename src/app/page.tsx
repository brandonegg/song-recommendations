import { Suspense } from "react";
import { SearchBar } from "./components/search-bar";
import { LoadingSpinner } from "./components/loading-spinner";
import ResultList from "./components/result-list";
import { CurationSidebar } from "./components/curation-sidebar";

export default function Home({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || "";

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="flex flex-row h-screen w-full overflow-hidden">
        <div className="w-[60%] py-32 flex flex-col h-full overflow-y-auto">
          <div className="pb-8 mx-auto">
            <SearchBar />
          </div>

          <Suspense key={query} fallback={<LoadingSpinner />}>
            <ResultList query={query} />
          </Suspense>
        </div>

        <div className="h-full w-[40%]">
          <CurationSidebar />
        </div>
      </div>
    </main>
  );
}
