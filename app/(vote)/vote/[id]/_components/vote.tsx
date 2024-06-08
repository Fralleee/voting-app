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
import {
  buttonVariant,
  containerVariants,
  itemVariants,
} from "@/app/_animations/variants";
import { notFound } from "next/navigation";

const Vote = ({ id }: { id: string }) => {
  const voteRef = ref(database, `votes/${id}`);
  const [vote, loading] = useObjectVal<Vote>(voteRef);
  const { user, identifier } = useIdentity();
  console.log("TEST");

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

  const voteOptions = useMemo(() => vote?.options || [], [vote]);
  const selectedOptions = useMemo(() => {
    return voteOptions
      .filter((option) =>
        option.votes?.some((vote) => vote.identifier === identifier),
      )
      .map((option) => option.value);
  }, [voteOptions, identifier]);

  const groupKey = useMemo(() => selectedOptions.join(","), [selectedOptions]);

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

  if (!loading && !vote) {
    notFound();
  }

  return (
    !loading &&
    vote && (
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
          <MotionCard className="flex w-full flex-col p-3 md:p-12">
            {vote.allowMultiChoice ? (
              <ToggleGroup
                key={groupKey}
                variant="outline"
                value={vote.options
                  .filter((option) =>
                    option.votes?.some(
                      (user) => user.identifier === identifier,
                    ),
                  )
                  .map((opt) => opt.value)}
                onValueChange={handleMultipleChoice}
                type="multiple"
                className="flex w-full flex-wrap justify-center gap-3"
              >
                {vote.options.map((option) => (
                  <MotionToggleGroupItem
                    variants={itemVariants}
                    value={option.value}
                    disabled={vote.status !== "open"}
                    className="relative h-32 w-32 p-3 text-lg data-[disabled]:text-muted"
                    key={option.value}
                  >
                    <div className="absolute right-2 top-2">
                      <AvatarCircles
                        users={option.votes || []}
                        maxCircles={3}
                      />
                    </div>
                    <p className="line-clamp-5 truncate text-wrap">
                      {option.value}
                    </p>
                  </MotionToggleGroupItem>
                ))}
              </ToggleGroup>
            ) : (
              <ToggleGroup
                key={groupKey}
                variant="outline"
                defaultValue={
                  vote.options.find((option) =>
                    option.votes?.some(
                      (user) => user.identifier === identifier,
                    ),
                  )?.value
                }
                onValueChange={handleSingleChoice}
                type="single"
                className="flex w-full flex-wrap justify-center gap-3"
              >
                {vote.options.map((option) => (
                  <MotionToggleGroupItem
                    variants={itemVariants}
                    value={option.value}
                    disabled={vote.status !== "open"}
                    key={option.value}
                    className="relative h-32 w-32 p-3 text-lg data-[disabled]:text-muted"
                  >
                    <div className="absolute right-2 top-2">
                      <AvatarCircles
                        users={option.votes || []}
                        maxCircles={3}
                      />
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
            variants={itemVariants}
            className="font-semibold text-gray-500"
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
              <motion.div variants={buttonVariant} className="w-full">
                <NewOption status={vote.status} onAdd={handleNewOption} />
              </motion.div>
            )}
            {vote.admin === identifier && (
              <motion.div variants={buttonVariant} className="w-full">
                <AdminControls vote={vote} voteRef={voteRef} />
              </motion.div>
            )}
          </div>
        </div>
      </MotionCard>
    )
  );
};

export default Vote;
