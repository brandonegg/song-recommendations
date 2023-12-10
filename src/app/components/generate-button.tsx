import Link from "next/link";

export const GenerateButton = () => {
  return (
    <Link
      href="recommend"
      className="rounded-xl px-4 py-2 border border-green-600 transition-all hover:bg-green-600 bg-green-600/50 text-white/50 hover:text-white"
    >
      Generate Recommendations
    </Link>
  );
};
