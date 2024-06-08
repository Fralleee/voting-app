"use client";

import React, { useEffect, useMemo } from "react";
import { MotionCard } from "@/components/ui/card";
import type { Vote } from "@/types/voteTypes";
import { ref, update } from "firebase/database";
import {
  MotionToggleGroupItem,
  ToggleGroup,
} from "@/components/ui/toggle-group";
import { useObjectVal } from "react-firebase-hooks/database";
import { database } from "@/lib/firebase";
import { NewOption } from "./new-option";
import AvatarCircles from "@/components/ui/avatar-circles";
import useIdentity from "@/app/_hooks/useIdentity";
import AdminControls from "./admin-controls";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/app/_animations/variants";
import { notFound } from "next/navigation";

const Vote = ({ id }: { id: string }) => {
  const voteRef = ref(database, `votes/${id}`);
  const [vote, loading] = useObjectVal<Vote>(voteRef);
  const { user, identifier, isLoading } = useIdentity();

  useEffect(() => {
    if (!user || !vote) return;
    const hasVotesWithOtherAlias = vote.options.some((option) =>
      option.votes?.some(
        (u) => u.identifier === identifier && u.alias !== user.alias,
      ),
    );

    if (!hasVotesWithOtherAlias) {
      return;
    }

    update(voteRef, {
      options: vote.options.map((option) => ({
        ...option,
        votes: (option.votes || [])?.map((u) =>
          u.identifier === identifier ? { ...u, alias: user.alias } : u,
        ),
      })),
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  function handleMultipleChoice(value: string[]): void {
    update(voteRef, {
      options: vote?.options.map((option) => {
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
    update(voteRef, {
      options: vote?.options.map((option) => {
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
    update(voteRef, {
      options: [
        ...(vote?.options || []),
        {
          value,
          votes: [],
        },
      ],
    });
  }

  if (loading || isLoading) {
    return null;
  }

  if (!vote) {
    notFound();
  }

  return (
    <MotionCard
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="mx-auto flex h-full w-full max-w-[640px] flex-col justify-between px-4 pt-20 md:h-auto md:px-8 md:py-12"
    >
      <div className="flex flex-col items-center gap-3">
        <motion.h1
          variants={itemVariants}
          className="text-center text-2xl font-bold text-stone-700 dark:text-slate-200 md:text-3xl lg:text-4xl"
        >
          {vote.topic}
        </motion.h1>
        <MotionCard className="flex max-h-96 w-full flex-col overflow-y-scroll border-none p-3 md:p-12">
          {vote.allowMultiChoice ? (
            <ToggleGroup
              variant="outline"
              value={vote.options
                .filter((option) =>
                  option.votes?.some((user) => user.identifier === identifier),
                )
                .map((opt) => opt.value)}
              onValueChange={handleMultipleChoice}
              type="multiple"
              className="flex w-full flex-wrap justify-center gap-3"
            >
              {vote.options.map((option, index) => (
                <MotionToggleGroupItem
                  variants={{
                    hidden: { y: 20, opacity: 0 },
                    visible: {
                      y: 0,
                      opacity: 1,
                      transition: {
                        duration: 0.2,
                        ease: "easeOut",
                        delay: index < 4 ? index * 0.15 : 0.45,
                      },
                    },
                  }}
                  value={option.value}
                  disabled={vote.status !== "open"}
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
                vote.options.find((option) =>
                  option.votes?.some((user) => user.identifier === identifier),
                )?.value
              }
              onValueChange={handleSingleChoice}
              type="single"
              className="flex w-full flex-wrap justify-center gap-3"
            >
              {vote.options.map((option, index) => (
                <MotionToggleGroupItem
                  variants={{
                    hidden: { y: 20, opacity: 0 },
                    visible: {
                      y: 0,
                      opacity: 1,
                      transition: {
                        duration: 0.2,
                        ease: "easeOut",
                        delay: index < 4 ? index * 0.15 : 0.45,
                      },
                    },
                  }}
                  value={option.value}
                  disabled={vote.status !== "open"}
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
        </MotionCard>
      </div>

      <div className="mx-auto mt-6 flex w-full max-w-64 flex-col items-center justify-end gap-3">
        <motion.p
          variants={{
            hidden: { y: 20, opacity: 0 },
            visible: {
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.2,
                ease: "easeOut",
                delay: 0.5,
              },
            },
          }}
          className="font-semibold text-muted-foreground"
        >
          Voting is{" "}
          {vote.status === "open"
            ? "open"
            : vote.status === "closed"
              ? "closed"
              : "locked"}
        </motion.p>

        <div className="mx-auto mt-6 flex w-full max-w-64 flex-col items-center justify-end gap-3">
          {vote.allowChoiceCreation && (
            <motion.div
              variants={{
                hidden: { scale: 0.25, opacity: 0 },
                visible: {
                  scale: 1,
                  opacity: 1,
                  transition: { ease: "backOut", duration: 0.3, delay: 0.65 },
                },
              }}
              className="w-full"
            >
              <NewOption status={vote.status} onAdd={handleNewOption} />
            </motion.div>
          )}
          {vote.admin === identifier && (
            <motion.div
              variants={{
                hidden: { scale: 0.25, opacity: 0 },
                visible: {
                  scale: 1,
                  opacity: 1,
                  transition: { ease: "backOut", duration: 0.3, delay: 0.8 },
                },
              }}
              className="w-full"
            >
              <AdminControls vote={vote} voteRef={voteRef} />
            </motion.div>
          )}
        </div>
      </div>
    </MotionCard>
  );
};

export default Vote;
