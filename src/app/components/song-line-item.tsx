import { SearchResponse } from "@/lib/schemas/responses/search";
import { PlusCircleIcon } from "@heroicons/react/20/solid";
import { MusicalNoteIcon, UserIcon } from "@heroicons/react/24/outline";
import { PropsWithChildren } from "react";

export const SongLineItem = ({
  onClick,
  name,
  artists,
  album
}: {
  onClick: (() => void) | undefined;
} & SearchResponse['results'][0]) => {
  const ConditionalButton = ({ children }: PropsWithChildren) => {
    if (onClick) {
      return (
        <button className="overflow-hidden border hover:border-white/50 border-transparent relative group rounded-2xl w-full hover:bg-white/50 transition-all duration-100" onClick={onClick}>
          <div className="z-10 hidden group-hover:block absolute inset-0">
            <div className="grid place-items-center w-full h-full">
              <div className="w-fit flex flex-row items-center space-x-2">
              <p className="text-blue-900/75 font-bold">add to curation</p>
              <PlusCircleIcon className="w-5 h-5 text-blue-900/75"/>
              </div>
            </div>
          </div>
          <div className="group-hover:blur-[4px]">
            {children}
          </div>
        </button>
      );
    }

    return <>{children}</>;
  };

  return (
    <ConditionalButton>
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
          <p className="text-sm text-gray-100/75">{artists[0] ?? 'None'}</p>
        </div>
      </div>
    </ConditionalButton>
  );
};
