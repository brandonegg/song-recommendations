import { getSimilarSongs } from "@/lib/queries/similar-songs";
import { Suspense } from "react";
import RecommendedList from "./components/recommended-list";
import { LoadingSpinner } from "../components/loading-spinner";
import Link from "next/link";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

export default async function RecommendPage() {
  return (
    <div className="relative h-screen w-full">
      <div className="absolute inset-0 overflow-y-auto px-16 pb-16 pt-6">
        <div className="w-[600px] mx-auto">
          <div className="w-fit mx-auto py-8">
            <Link
              href="/"
              className="flex flex-row items-center space-x-2 rounded-xl px-2 py-2 text-blue-500/75 hover:bg-blue-500 bg-blue-500/0 transition-all duration-100 hover:text-white leading-3"
            >
              <ChevronLeftIcon className="w-4 h-4" />
              <span className="leading-3">return to curation</span>
            </Link>
          </div>
          <h1 className="mb-16 text-center mx-auto text-4xl leading-3 text-white font-bold">
            Your Top 10 Recommendations
          </h1>
          <Suspense fallback={<LoadingSpinner />}>
            <RecommendedList />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
