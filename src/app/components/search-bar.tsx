"use client";
import { useDebouncedCallback } from 'use-debounce';
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const SearchButton = () => {
  return (
    <button className="h-[35px] w-[35px] my-auto rounded-[0.6rem] bg-blue-400/40 border border-blue-500/40 absolute right-[5px] top-0 bottom-0">
      <MagnifyingGlassIcon className="w-4 h-4 m-auto text-white/50" />
    </button>
  );
};

export const SearchBar = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((input: string) => {
    const params = new URLSearchParams(searchParams);
    if (input) {
      params.set("query", input);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="relative mx-2">
      <input
        defaultValue={searchParams.get("query")?.toString()}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        type="text"
        placeholder="Search for a song or artist"
        className="bg-gray-100/20 text-white placeholder:text-gray-100/40 text-sm w-[500px] rounded-xl px-4 py-3 border border-white/50"
      />
      <SearchButton />
    </div>
  );
};
