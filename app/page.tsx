import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col p-12 gap-2">
      <h1 className="text-xl">Live Voting App</h1>
      <Link className="font-bold" href="/new-vote">
        Create new vote
      </Link>
    </div>
  );
}
