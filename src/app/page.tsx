"use client";
import { useEffect, useState } from "react";
import { SearchBar } from "./components/search-bar";
import { SongLineItem } from "./components/song-line-item";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const searchQuery = searchParams.get("query");

  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/search?query=${searchQuery}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      <div className="p-32 flex flex-col">
        <div className="pb-8">
          <SearchBar value={searchQuery ?? ""} onChange={onChange} />
        </div>

        <div className="h-[1px] mx-auto w-full max-w-[300px] bg-gray-100/10" />

        <div className="pt-8 w-full max-w-[400px] mx-auto">
          <SongLineItem onClick={undefined} />
        </div>
      </div>
    </main>
  );
}
