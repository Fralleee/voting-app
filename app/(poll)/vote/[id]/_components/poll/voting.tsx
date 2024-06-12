"use client";

import React from "react";
import { MotionCard } from "@/components/ui/card";
import type { Poll, Storypoints } from "@/types/pollTypes";
import { DatabaseReference } from "firebase/database";
import { NewOption } from "../new-option";
import AdminControls from "../admin-controls";
import { motion } from "framer-motion";
import {
  buttonVariant,
  containerVariants,
  itemVariants,
} from "@/app/_animations/variants";
import { useUser } from "@/app/_hooks/useUser";
import { MultiChoice } from "../choice/multi-choice";
import { SingleChoice } from "../choice/single-choice";

interface VotingProps {
  poll: Poll | Storypoints;
  pollReference: DatabaseReference;
}

const Voting = ({ poll, pollReference }: VotingProps) => {
  const { user } = useUser();

  return (
    <MotionCard
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="mx-auto flex h-full w-full max-w-xl flex-col justify-between rounded-lg px-4 pt-20 md:h-auto md:border md:px-8 md:py-12"
    >
      <motion.h1
        variants={itemVariants}
        className="text-center text-2xl font-bold md:text-3xl lg:text-4xl"
      >
        {poll.topic}
      </motion.h1>
      <motion.div
        variants={itemVariants}
        className="flex w-full flex-grow flex-col p-3 md:p-12"
      >
        {poll.allowMultiChoice ? (
          <MultiChoice poll={poll} pollReference={pollReference} />
        ) : (
          <SingleChoice poll={poll} pollReference={pollReference} />
        )}
      </motion.div>

      <div className="mx-auto my-6 flex w-full max-w-64 flex-col items-center justify-end gap-3">
        <div className="mx-auto flex w-full max-w-64 flex-col justify-end gap-3">
          {poll.type === "poll" && poll.allowChoiceCreation && (
            <motion.div variants={buttonVariant} className="w-full">
              <NewOption poll={poll} pollReference={pollReference} />
            </motion.div>
          )}
          {poll.admin === user?.identifier && (
            <motion.div variants={buttonVariant} className="w-full">
              <AdminControls poll={poll} pollReference={pollReference} />
            </motion.div>
          )}
        </div>
      </div>
    </MotionCard>
  );
};

export default Voting;
