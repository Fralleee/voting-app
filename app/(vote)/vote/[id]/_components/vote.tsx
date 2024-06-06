"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import type { Vote } from "@/types/vote";
import { Skeleton } from "@/components/ui/skeleton";
import { useIdentity } from "../_hooks/useIdentity";
import { ref, update } from "firebase/database";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useObject } from "react-firebase-hooks/database";
import { database } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { NewOption } from "./new-option";

const Vote = ({ id }: { id: string }) => {
  const voteRef = ref(database, `votes/${id}`);
  const [snapshot, loading, error] = useObject(voteRef);
  const deviceId = useIdentity();

  if (loading)
    return (
      <div className="flex w-full max-w-[640px] flex-col items-center">
        <Skeleton className="mb-4 h-12 w-full" />
        <Card className="flex w-full flex-col p-12">
          <div className="flex w-full justify-center gap-3">
            <Skeleton className="h-32 w-32 p-3" />
            <Skeleton className="h-32 w-32 p-3" />
          </div>
        </Card>
      </div>
    );

  if (error) return <div>Error: {JSON.stringify(error)}</div>;
  if (!snapshot) return <div>No vote data available.</div>;

  const vote = snapshot.val() as Vote;

  function handleMultipleChoice(value: string[]): void {
    update(voteRef, {
      options: vote.options.map((option) => ({
        ...option,
        votes: value.includes(option.value)
          ? (option.votes || []).includes(deviceId)
            ? option.votes
            : [...(option.votes || []), deviceId]
          : (option.votes || []).filter((vote) => vote !== deviceId),
      })),
    });
  }

  function handleSingleChoice(value: string): void {
    update(voteRef, {
      options: vote.options.map((option) => ({
        ...option,
        votes:
          option.value === value
            ? [...(option.votes || []), deviceId]
            : (option.votes || []).filter((v) => v !== deviceId),
      })),
    });
  }

  function handleNewOption(value: string): void {
    update(voteRef, {
      options: [
        ...vote.options,
        {
          value,
          votes: [],
        },
      ],
    });
  }

  return (
    <>
      <h1 className="mb-4 text-center text-2xl font-bold text-stone-700 dark:text-slate-200 md:text-3xl lg:text-4xl">
        {vote.name}
      </h1>
      <div className="flex w-full max-w-[640px] flex-col items-center">
        <p className="mb-4 font-semibold text-gray-500">
          Voting is {vote.status === "open" ? "Open" : "Closed"}
        </p>
        <Card className="flex w-full flex-col p-12">
          {vote.allowMultiChoice ? (
            <ToggleGroup
              variant="outline"
              defaultValue={vote.options
                .filter((option) => option.votes?.includes(deviceId))
                .map((opt) => opt.value)}
              onValueChange={handleMultipleChoice}
              type="multiple"
              className="flex w-full flex-wrap justify-center gap-3"
            >
              {vote.options.map((option) => (
                <ToggleGroupItem
                  value={option.value}
                  disabled={vote.status === "closed"}
                  className="relative h-32 w-32 p-3 text-lg"
                  key={option.value}
                >
                  <p className="absolute right-3 top-2">
                    {option.votes?.length}
                  </p>
                  <p className="line-clamp-5 truncate text-wrap">
                    {option.value}
                  </p>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          ) : (
            <ToggleGroup
              variant="outline"
              defaultValue={
                vote.options.find((option) => option.votes?.includes(deviceId))
                  ?.value
              }
              onValueChange={handleSingleChoice}
              type="single"
              className="flex w-full flex-wrap justify-center gap-3"
            >
              {vote.options.map((option) => (
                <ToggleGroupItem
                  value={option.value}
                  disabled={vote.status === "closed"}
                  className="relative h-32 w-32 p-3 text-lg"
                  key={option.value}
                >
                  <p className="absolute right-3 top-2">
                    {option.votes?.length}
                  </p>
                  <p className="line-clamp-5 truncate text-wrap">
                    {option.value}
                  </p>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          )}
        </Card>
      </div>

      {vote.allowChoiceCreation && <NewOption onAdd={handleNewOption} />}

      {vote.admin === deviceId && (
        <Button
          onClick={() => {
            update(voteRef, {
              status: vote.status === "open" ? "closed" : "open",
            });
          }}
          className="mt-2"
        >
          {vote.status === "open" ? "Close vote" : "Open vote"}
        </Button>
      )}
    </>
  );
};

export default Vote;
