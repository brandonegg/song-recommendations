"use client";
import { useEffect, useState } from "react";
import { SearchBar } from "./components/search-bar";
import { SongLineItem } from "./components/song-line-item";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  SearchResponse,
  SearchResponseSchema,
} from "@/lib/schemas/responses/search";
import { LoadingSpinner } from "./components/loading-spinner";
import { CurationSidebar } from "./components/curation-sidebar";

export const ResultList = ({
  loading,
  results,
}: {
  loading: boolean;
  results: SearchResponse["results"];
}) => {
  if (results.length === 0) {
    return (
      <div className="w-fit mx-auto">
        <p className="text-lg font-semibold text-stone-500">
          <i>No results found</i>
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-[70px] h-[80px] mx-auto">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      {results.map((song, i) => {
        return (
          <SongLineItem
            {...song}
            key={i}
            onClick={() => {
              console.log("clicked");
            }}
          />
        );
      })}
    </>
  );
};

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const searchQuery = searchParams.get("query");
  const [searchValue, setSearchValue] = useState<string | null>(searchQuery);

  const [searchData, setSearchData] = useState<SearchResponse | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (!searchValue || searchValue.length === 0) {
      return;
    }

    fetch(`/api/search?query=${searchValue}`)
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }

        return null;
      })
      .then((data: any | null) => {
        if (!data) {
          return;
        }
        setSearchData(SearchResponseSchema.parse(data));
        setLoading(false);
      });
  }, [searchValue]);

  useEffect(() => {
    if (!searchValue || searchValue.length === 0) {
      setSearchData(null);
    }
  }, [searchValue]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    const value = e.target.value.trim();

    if (!value || value.length == 0) {
      current.delete("query");
    } else {
      current.set("query", e.target.value);
    }

    const search = current.toString();
    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="flex flex-row h-full w-full overflow-hidden">
        <div className="p-32 flex flex-col h-full overflow-y-auto">
          <div className="pb-8">
            <SearchBar value={searchValue ?? ""} onChange={onChange} />
          </div>

          {searchData !== null && !isLoading ? (
            <>
              <div className="h-[1px] mx-auto w-full max-w-[300px] bg-gray-100/10" />

              <div className="pt-8 w-full max-w-[450px] mx-auto space-y-3">
                <ResultList loading={isLoading} results={searchData.results} />
              </div>
            </>
          ) : null}
        </div>

        <div className="h-full">
            <CurationSidebar />
        </div>
      </div>
    </main>
  );
}
