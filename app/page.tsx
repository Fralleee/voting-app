import Link from "next/link";
import Prompts from "./components/prompts";
import { Quotes } from "./components/quotes";

export default function Page() {
  return (
    <div className="flex flex-col h-full w-full dark:bg-black bg-white dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative">
      <div className="flex flex-col items-center justify-center flex-grow">
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <h1 className="text-4xl sm:text-7xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-8">Live Voting App</h1>
        <Prompts />
        <Link className="font-bold my-8" href="/new-vote">
          Get Started
        </Link>
      </div>
      <Quotes />
    </div>
  );
}
