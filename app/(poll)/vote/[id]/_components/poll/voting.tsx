"use client";

import React, { useMemo } from "react";
import { MotionCard } from "@/components/ui/card";
import type { Poll } from "@/types/pollTypes";
import { DatabaseReference } from "firebase/database";
import { NewOption } from "../new-option";
import AdminControls from "../admin-controls";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/app/_animations/variants";
import { useUser } from "@/app/_hooks/useUser";
import { MultiChoice } from "../choice/multi-choice";
import { SingleChoice } from "../choice/single-choice";

interface VotingProps {
  poll: Poll;
  pollReference: DatabaseReference;
}

const Voting = ({ poll, pollReference }: VotingProps) => {
  const { user } = useUser();

  const pollStatus = useMemo(() => {
    if (poll.status === "open") {
      return "open";
    } else if (poll.status === "closed") {
      return "closed";
    } else {
      return "locked";
    }
  }, [poll.status]);

  return (
    <MotionCard
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="mx-auto flex h-full min-h-screen w-full flex-col justify-between gap-3 px-4 pt-20 md:h-auto md:min-h-0 md:px-8 md:py-12"
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
        <motion.p
          variants={{
            hidden: { scale: 0, opacity: 0 },
            visible: {
              scale: 1,
              opacity: 1,
              transition: {
                duration: 0.2,
                ease: "backOut",
                delay:
                  poll.options.length > 4 ? 0.6 : poll.options.length * 0.15,
              },
            },
          }}
          className="text-muted-foreground"
        >
          Voting is {pollStatus}
        </motion.p>

        <div className="mx-auto mt-6 flex w-full max-w-64 flex-col justify-end gap-3">
          {poll.allowChoiceCreation && (
            <motion.div
              variants={{
                hidden: { scale: 0.25, opacity: 0 },
                visible: {
                  scale: 1,
                  opacity: 1,
                  transition: {
                    ease: "backOut",
                    duration: 0.3,
                    delay:
                      poll.options.length > 5
                        ? 0.75
                        : poll.options.length * 0.15 + 0.15,
                  },
                },
              }}
              className="w-full"
            >
              <NewOption poll={poll} pollReference={pollReference} />
            </motion.div>
          )}
          {poll.admin === user?.identifier && (
            <motion.div
              variants={{
                hidden: { scale: 0.25, opacity: 0 },
                visible: {
                  scale: 1,
                  opacity: 1,
                  transition: {
                    ease: "backOut",
                    duration: 0.3,
                    delay:
                      poll.options.length > 5
                        ? 0.9
                        : poll.options.length * 0.15 + 0.3,
                  },
                },
              }}
              className="w-full"
            >
              <AdminControls poll={poll} pollReference={pollReference} />
            </motion.div>
          )}
        </div>
      </div>
    </MotionCard>
  );
};

export default Voting;
