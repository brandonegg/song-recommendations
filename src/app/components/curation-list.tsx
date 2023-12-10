import { getCurationUsingCookie } from "@/lib/queries/curation";
import { SongLineItem } from "./song-line-item";

export default async function CurationList({}: {}) {
  const curationList = await getCurationUsingCookie();

  return (
    <>
      <div className="pt-8 w-full max-w-[450px] mx-auto space-y-3">
        {curationList.map((song, i) => {
          return <SongLineItem {...song} key={i} showAddToCuration={false} />;
        })}
      </div>
    </>
  );
}
