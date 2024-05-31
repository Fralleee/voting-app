import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col p-12">
      <h1 className="text-xl font-bold pb-4">Select type of vote to create</h1>
      <Link prefetch href="/new-vote/single-choice">
        Single-choice
      </Link>
      <Link className="cursor-not-allowed text-gray-500 pointer-events-none" prefetch href="/new-vote/multi-choice">
        Multi-choice
      </Link>
      <Link className="cursor-not-allowed text-gray-500 pointer-events-none" prefetch href="/new-vote/storypoints">
        Storypoints
      </Link>
    </div>
  );
}
