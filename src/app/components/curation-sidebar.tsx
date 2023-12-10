import { Suspense } from "react";
import CurationList from "./curation-list";
import { LoadingSpinner } from "./loading-spinner";

export function CurationSidebar() {
  return (
    <div className="py-14 px-4 h-full w-full bg-black/20 border-l border-stone-800/50 backdrop-blur-md drop-shadow-left">
      <h1 className="text-xl font-bold text-white/75">Your Curation:</h1>
      <Suspense fallback={<LoadingSpinner />}>
        <CurationList />
      </Suspense>
    </div>
  );
}
