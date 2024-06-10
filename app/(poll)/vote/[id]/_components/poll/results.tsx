"use client";

import React from "react";
import { MotionCard } from "@/components/ui/card";
import type { Poll } from "@/types/pollTypes";
import {
  buttonVariant,
  containerVariants,
  itemVariants,
} from "@/app/_animations/variants";
import { getPollResults, getWinningOptions } from "@/app/_utils/results";
import AvatarCircles from "@/components/ui/avatar-circles";
import { Home, ListPlus, Trash2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/utils/cn";
import { DatabaseReference, remove } from "firebase/database";
import { useRouter } from "next/navigation";

interface ResultsProps {
  poll: Poll;
  pollReference: DatabaseReference;
}

const Results = ({ poll, pollReference }: ResultsProps) => {
  const { votesPerOption } = getPollResults(poll);
  const winningOptions = getWinningOptions(votesPerOption);

  const handleRemovePoll = () => {
    remove(pollReference);
  };

  return (
    <MotionCard
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="mx-auto flex h-full min-h-screen w-full flex-col justify-between gap-6 pt-20 md:h-auto md:min-h-0 md:px-8 md:py-12"
    >
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="pb-3 text-center text-5xl font-bold uppercase">
            {winningOptions.length > 1
              ? "Crowded at the top!"
              : "We have a winner!"}
          </h1>
          <p className="text-center text-muted-foreground">
            {" "}
            {winningOptions.length > 1
              ? "Looks like this contest has ended in a deadlock with multiple champions sharing the top spot"
              : "And the crown goes to our sole champion! Thanks to everyone who participated"}
          </p>
        </div>
        {winningOptions.map((option) => (
          <motion.div
            key={option.name}
            variants={itemVariants}
            className="mx-auto flex flex-col items-center justify-between gap-2 rounded-md border border-border bg-background p-3 text-accent-foreground"
          >
            <div className="line-clamp-2 min-w-32 max-w-96 truncate text-wrap text-center text-xl font-bold">
              {option.name}
            </div>

            <AvatarCircles users={option.users || []} maxCircles={3} />
          </motion.div>
        ))}
        <motion.div
          variants={itemVariants}
          className="flex flex-col gap-2 text-center"
        >
          <h2 className="text-sm font-bold uppercase text-muted-foreground">
            Topic
          </h2>
          <p className="text-center text-accent-foreground">{poll.topic}</p>
        </motion.div>
      </div>

      <motion.div
        variants={buttonVariant}
        className="mx-auto my-6 flex w-full max-w-64 flex-col justify-end gap-3"
      >
        <Link
          prefetch
          className={cn(
            buttonVariants({
              variant: "outline",
            }),
            "flex w-full items-center gap-3",
          )}
          href="/"
        >
          <Home size={16} /> Take me back
        </Link>
        <Button
          onClick={handleRemovePoll}
          className="flex w-full items-center gap-3"
          variant={"destructive"}
        >
          <Trash2 size={16} />
          Remove poll
        </Button>
        <Link
          prefetch
          className={cn(buttonVariants(), "flex w-full items-center gap-3")}
          href="/create"
        >
          <ListPlus size={16} /> Create a poll
        </Link>
      </motion.div>
    </MotionCard>
  );
};

export default Results;
