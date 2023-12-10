import { getSimilarSongs } from "@/lib/queries/similar-songs";
import { Suspense } from "react";
import RecommendedList from "./components/recommended-list";
import { LoadingSpinner } from "../components/loading-spinner";

export default async function RecommendPage() {
  return <div className="relative h-screen w-full">
    <div className="absolute inset-0 overflow-y-auto p-16">
        <div className="w-[600px] mx-auto">
        <h1 className="mb-16 text-center mx-auto text-4xl text-white font-bold">Your Top 10 Recommendations</h1>
        <Suspense fallback={<LoadingSpinner/>}>
            <RecommendedList/>
        </Suspense>
        </div>
    </div>
  </div>;
}
