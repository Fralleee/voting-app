"use client";

import React from "react";
import { MotionCard } from "@/components/ui/card";
import type { Poll, VoteResultsPerOption } from "@/types/pollTypes";
import {
  buttonVariant,
  containerVariants,
  itemVariants,
} from "@/app/_animations/variants";
import { getPollResults, getWinningOptions } from "@/app/_utils/results";
import AvatarCircles from "@/components/ui/avatar-circles";
import { Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface TooltipProps {
  active?: boolean;
  payload: { payload: VoteResultsPerOption }[];
  totalVotes: number;
}

const CustomTooltip = ({ active, payload, totalVotes }: TooltipProps) => {
  if (active && payload && payload.length) {
    const { name, votes, users } = payload[0].payload;
    return (
      <div className="relative w-48 rounded-sm border border-border bg-background p-3 pt-12 text-foreground">
        <h1 className="line-clamp-3 truncate text-wrap text-xl font-bold">
          {name}
        </h1>
        <div>
          <div className="flex justify-between">
            <span className="flex items-center gap-2">
              <Circle className="h-4 w-4 fill-foreground stroke-none" />
              votes
            </span>
            <span>{votes}</span>
          </div>
          <div className="flex justify-between">
            <span className="flex items-center gap-2">
              <Circle className="h-4 w-4 fill-muted-foreground stroke-none" />
              total
            </span>
            <span>{totalVotes}</span>
          </div>
        </div>

        <div className="absolute right-2 top-2">
          <AvatarCircles users={users || []} maxCircles={3} />
        </div>
      </div>
    );
  }

  return null;
};

const Results = ({ poll }: { poll: Poll }) => {
  const { totalVotes, votesPerOption } = getPollResults(poll);
  const winningOptions = getWinningOptions(votesPerOption);
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
        <div className="flex flex-col gap-2 text-center">
          <h2 className="text-sm font-bold uppercase text-muted-foreground">
            Topic
          </h2>
          <p className="text-center text-accent-foreground">{poll.topic}</p>
        </div>
      </div>

      <motion.div
        variants={buttonVariant}
        className="mx-auto my-6 flex w-full max-w-64 flex-col justify-end gap-3"
      >
        <Button variant={"outline"}>Take me back</Button>
        <Button variant={"outline"}>Share results</Button>
        <Button variant={"destructive"}>Remove poll</Button>
        <Button>Create a poll</Button>
      </motion.div>
    </MotionCard>
  );
};

export default Results;
