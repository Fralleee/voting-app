"use client";

import React, { useEffect } from "react";
import { MotionCard } from "@/components/ui/card";
import type { Poll } from "@/types/voteTypes";
import { DatabaseReference, ref, update } from "firebase/database";
import {
  MotionToggleGroupItem,
  ToggleGroup,
} from "@/components/ui/toggle-group";
import { NewOption } from "../new-option";
import AvatarCircles from "@/components/ui/avatar-circles";
import AdminControls from "../admin-controls";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/app/_animations/variants";
import { User } from "@/types/userTypes";

interface VotingProps {
  poll: Poll;
  pollReference: DatabaseReference;
  user: User;
}

const Voting = ({ poll, pollReference, user }: VotingProps) => {
  const { identifier } = user;

  function handleMultipleChoice(value: string[]): void {
    update(pollReference, {
      options: poll.options.map((option) => {
        if (value.includes(option.value)) {
          const alreadyVoted = option.votes?.some(
            (user) => user.identifier === identifier,
          );

          if (alreadyVoted) {
            return option;
          }

          return {
            ...option,
            votes: [...(option.votes || []), user],
          };
        }

        return {
          ...option,
          votes: (option.votes || []).filter(
            (user) => user.identifier !== identifier,
          ),
        };
      }),
    });
  }

  function handleSingleChoice(value: string): void {
    update(pollReference, {
      options: poll.options.map((option) => {
        if (value.includes(option.value)) {
          return {
            ...option,
            votes: [...(option.votes || []), user],
          };
        }

        return {
          ...option,
          votes: (option.votes || []).filter(
            (user) => user.identifier !== identifier,
          ),
        };
      }),
    });
  }

  function handleNewOption(value: string): void {
    update(pollReference, {
      options: [
        ...poll.options,
        {
          value,
          votes: [],
        },
      ],
    });
  }

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
          <ToggleGroup
            variant="outline"
            value={poll.options
              .filter((option) =>
                option.votes?.some((user) => user.identifier === identifier),
              )
              .map((opt) => opt.value)}
            onValueChange={handleMultipleChoice}
            type="multiple"
            className="flex w-full flex-wrap justify-center gap-3"
          >
            {poll.options.map((option, index) => (
              <MotionToggleGroupItem
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: {
                    y: 0,
                    opacity: 1,
                    transition: {
                      duration: 0.2,
                      ease: "easeOut",
                      delay: index < 5 ? index * 0.15 : 0.45,
                    },
                  },
                }}
                value={option.value}
                disabled={poll.status !== "open"}
                className="relative h-32 w-32 select-none p-3 text-lg data-[disabled]:text-muted-foreground"
                key={option.value}
              >
                <div className="absolute right-2 top-2">
                  <AvatarCircles users={option.votes || []} maxCircles={3} />
                </div>
                <p className="line-clamp-5 truncate text-wrap">
                  {option.value}
                </p>
              </MotionToggleGroupItem>
            ))}
          </ToggleGroup>
        ) : (
          <ToggleGroup
            variant="outline"
            defaultValue={
              poll.options.find((option) =>
                option.votes?.some((user) => user.identifier === identifier),
              )?.value
            }
            onValueChange={handleSingleChoice}
            type="single"
            className="flex w-full flex-wrap justify-center gap-3"
          >
            {poll.options.map((option, index) => (
              <MotionToggleGroupItem
                variants={{
                  hidden: { scale: 0, opacity: 0 },
                  visible: {
                    scale: 1,
                    opacity: 1,
                    transition: {
                      duration: 0.2,
                      ease: "backOut",
                      delay: index < 5 ? index * 0.15 : 0.75,
                    },
                  },
                }}
                value={option.value}
                disabled={poll.status !== "open"}
                key={option.value}
                className="relative h-32 w-32 select-none p-3 text-lg data-[disabled]:text-muted-foreground"
              >
                <div className="absolute right-2 top-2">
                  <AvatarCircles users={option.votes || []} maxCircles={3} />
                </div>
                <p className="line-clamp-5 truncate text-wrap">
                  {option.value}
                </p>
              </MotionToggleGroupItem>
            ))}
          </ToggleGroup>
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
          Voting is{" "}
          {poll.status === "open"
            ? "open"
            : poll.status === "closed"
              ? "closed"
              : "locked"}
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
              <NewOption vote={poll} onAdd={handleNewOption} />
            </motion.div>
          )}
          {poll.admin === identifier && (
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
              <AdminControls vote={poll} voteRef={pollReference} />
            </motion.div>
          )}
        </div>
      </div>
    </MotionCard>
  );
};

export default Voting;
