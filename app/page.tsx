import Link from "next/link";
import Prompts from "../components/prompts";
import { Quotes } from "../components/quotes";
import { Button, buttonVariants } from "@/components/ui/button";
import { SparklesCore } from "@/components/ui/sparkles";

export default function Page() {
  return (
    <>
      <div className="flex flex-col items-center justify-center flex-grow gap-8">
        <div className="w-full flex flex-col items-center justify-center overflow-hidden rounded-md">
          <Prompts />
          <h1 className="md:text-7xl text-3xl lg:text-9xl font-bold text-center text-stone-700 dark:text-slate-200 relative z-20">Live Voting App</h1>
          <div className="mt-1 w-[40rem] h-10 relative">
            <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent dark:via-indigo-200 via-purple-400 to-transparent h-[2px] w-3/4 blur-sm" />
            <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent dark:via-indigo-200 via-purple-400 to-transparent h-px w-3/4" />
            <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent dark:via-sky-400 via-pink-400 to-transparent dark:h-[5px] h-1 w-1/4 blur-sm" />
            <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent dark:via-sky-400 via-pink-400 to-transparent h-px w-1/4" />
          </div>
        </div>
        <Link className={buttonVariants({ size: "xl" })} href="/new-vote">
          Get Started
        </Link>
      </div>
      <Quotes />
    </>
  );
}
