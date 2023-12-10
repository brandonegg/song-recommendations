import { getCurationUsingCookie } from "@/lib/queries/curation";
import { SongLineItem } from "./song-line-item";

export default async function CurationList({}: {}) {
  const curationList = await getCurationUsingCookie();

  if (curationList.length === 0) {
    return (
      <div className="my-4 mx-auto max-w-[300px] px-4">
        <div className="mb-4 w-fit mx-auto">
          <p className="text-white/50 font-semibold text-sm">
            No songs added yet!
          </p>
        </div>
        <div>
          <p className="text-white/25 text-center text-sm">
            <i>
              Search for a song and select it to start building your curation!
            </i>
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full max-w-[450px] mx-auto space-y-3">
        {curationList.map((song, i) => {
          return (
            <SongLineItem {...song} key={i} action="remove-from-curation" />
          );
        })}
      </div>
    </>
  );
}
