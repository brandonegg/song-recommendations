import { MusicalNoteIcon, UserIcon } from "@heroicons/react/24/outline";
import { PropsWithChildren } from "react";

export const SongLineItem = ({
  onClick,
}: {
  onClick: (() => {}) | undefined;
}) => {
  const ConditionalButton = ({ children }: PropsWithChildren) => {
    if (onClick) {
      return (
        <button className="w-full" onClick={onClick}>
          {children}
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
          <div className="leading-5">
            <h3 className="text-white/50 font-semibold">Childs Play</h3>
            <p className="text-sm text-stone-500">Views</p>
          </div>
        </div>

        <div className="my-auto rounded-xl bg-black/10 flex flex-row items-center px-4 py-2 space-x-2">
          <UserIcon className="h-[20px] text-gray-100/50" />
          <p className="text-sm text-gray-100/75">Drake</p>
        </div>
      </div>
    </ConditionalButton>
  );
};
