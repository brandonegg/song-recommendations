import { MusicalNoteIcon, UserIcon } from "@heroicons/react/24/outline";
import { PlusCircleIcon, TrashIcon } from "@heroicons/react/24/solid";
import { PropsWithChildren } from "react";
import { addSongToCuration, removeSongFromCuration } from "../actions/curation";
import { SongDetails } from "@/lib/queries/song-search";

export type ActionType = "add-to-curation" | "remove-from-curation" | "none";

export const ActionWrapper = ({
  type,
  children,
  id,
}: PropsWithChildren & { type: ActionType; id: string }) => {
  if (type === "add-to-curation" || type === "remove-from-curation") {
    return (
      <form
        action={
          type === "add-to-curation"
            ? addSongToCuration
            : removeSongFromCuration
        }
      >
        <input readOnly className="hidden" type="text" name="id" value={id} />

        <div className="overflow-hidden border hover:border-white/50 border-transparent relative group rounded-2xl w-full hover:bg-white/50 transition-all duration-100">
          {type === "add-to-curation" ? (
            <button className="z-10 hidden group-hover:block absolute inset-0">
              <div className="grid place-items-center w-full h-full">
                <div className="w-fit flex flex-row items-center space-x-2">
                  <p className="text-blue-900/75 font-bold">add to curation</p>
                  <PlusCircleIcon className="w-5 h-5 text-blue-900/75" />
                </div>
              </div>
            </button>
          ) : (
            <div className="z-10 hidden absolute inset-0 items-center group-hover:flex flex-row justify-end px-4">
              <button
                type="submit"
                className="rounded-xl transition-all duration-100 hover:text-white text-red-800 bg-red-800/0 hover:bg-red-800/75 px-3 py-1 flex flex-row items-center space-x-2"
              >
                <span className="text-sm font-semibold">remove</span>
                <TrashIcon className="w-4 h-4 " />
              </button>
            </div>
          )}
          <div className="group-hover:blur-[4px]">{children}</div>
        </div>
      </form>
    );
  }

  return <>{children}</>;
};

export const SongLineItem = ({
  action,
  name,
  artists,
  album,
  id,
}: {
  action: ActionType;
} & SongDetails) => {
  return (
    <ActionWrapper type={action} id={id}>
      <div className="w-full bg-gray-100/10 px-4 py-2 rounded-2xl flex flex-row justify-between items-center">
        <div className="flex flex-row items-center space-x-4">
          <MusicalNoteIcon className="h-[25px] text-gray-300" />
          <div className="text-left leading-5">
            <h3 className="text-white/50 font-semibold">{name}</h3>
            <p className="text-sm text-stone-500">{album}</p>
          </div>
        </div>

        <div className="shrink-0 relative w-[150px] overflow-hidden whitespace-nowrap flex-nowrap my-auto rounded-xl bg-black/10 flex flex-row items-center px-3 py-2 space-x-2">
          <UserIcon className="shrink-0 h-[20px] text-gray-100/50" />
          <p className="text-sm text-gray-100/75">{artists[0] ?? "None"}</p>
        </div>
      </div>
    </ActionWrapper>
  );
};
