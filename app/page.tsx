import Link from "next/link";
import Prompts from "../components/prompts";
import { Quotes } from "../components/quotes";
import { buttonVariants } from "@/components/ui/button";

export default function Page() {
  return (
    <>
      <div className="flex flex-col items-center justify-center flex-grow gap-8">
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <h1 className="text-4xl sm:text-7xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500">Live Voting App</h1>
        <Prompts />
        <Link className={buttonVariants({ variant: "outline" })} href="/new-vote">
          Get Started
        </Link>
      </div>
      <Quotes />
    </>
  );
}
