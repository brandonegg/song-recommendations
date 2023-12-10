import { Suspense } from "react";
import CurationList from "./curation-list";
import { LoadingSpinner } from "./loading-spinner";
import { PlayCircleIcon } from "@heroicons/react/24/solid";

export function CurationSidebar() {
  return (
    <div className="h-full w-full bg-black/20 border-l border-stone-800/50 backdrop-blur-md drop-shadow-left">
      <div className="space-x-2 p-4 bg-black/30 border-b border-white/10 flex flex-row items-center justify-center">
        <h1 className="bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 text-center text-xl font-bold text-transparent bg-clip-text">
          Your Curation
        </h1>
        <PlayCircleIcon className="w-6 h-6 text-white/50" />
      </div>
      <div className="pt-8 px-4">
        <Suspense fallback={<LoadingSpinner />}>
          <CurationList />
        </Suspense>
      </div>
    </div>
  );
}
