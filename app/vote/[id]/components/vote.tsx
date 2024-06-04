"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import type { Vote, VoteOption } from "@/types/vote";
import { Skeleton } from "@/components/ui/skeleton";
import { useIdentity } from "../hooks/useIdentity";
import { ref, update } from "firebase/database";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useObject } from "react-firebase-hooks/database";
import { database } from "@/lib/firebase";
import { Button } from "@/components/ui/button";

const Vote = ({ id }: { id: string }) => {
  const voteRef = ref(database, `votes/${id}`);
  const [snapshot, loading, error] = useObject(voteRef);
  const deviceId = useIdentity();

  if (loading)
    return (
      <div className="flex flex-col items-center w-full max-w-[640px]">
        <Skeleton className="h-12 w-full mb-4" />
        <Card className="flex flex-col p-12 w-full">
          <div className="flex gap-3 justify-center w-full">
            <Skeleton className="w-32 h-32 p-3" />
            <Skeleton className="w-32 h-32 p-3" />
          </div>
        </Card>
      </div>
    );

  if (error) return <div>Error: {JSON.stringify(error)}</div>;
  if (!snapshot) return <div>No vote data available.</div>;

  const vote = snapshot.val() as Vote;

  function handleMultipleChoice(value: string[]): void {
    update(voteRef, {
      options: vote.options.map(option => ({
        ...option,
        votes: value.includes(option.value)
          ? (option.votes || []).includes(deviceId)
            ? option.votes
            : [...(option.votes || []), deviceId]
          : (option.votes || []).filter(vote => vote !== deviceId),
      })),
    });
  }

  function handleSingleChoice(value: string): void {
    update(voteRef, {
      options: vote.options.map(option => ({
        ...option,
        votes: option.value === value ? [...(option.votes || []), deviceId] : (option.votes || []).filter(v => v !== deviceId),
      })),
    });
  }

  return (
    <div className="flex flex-col items-center w-full max-w-[640px]">
      <h1 className="text-2xl mb-4">{vote.name}</h1>
      <p className="text-gray-500 mb-4 font-semibold">Voting is {vote.status === "open" ? "Open" : "Closed"}</p>
      <Card className="flex flex-col p-12 w-full">
        {vote.allowMultiChoice ? (
          <ToggleGroup
            variant="outline"
            defaultValue={vote.options.filter(option => option.votes?.includes(deviceId)).map(opt => opt.value)}
            onValueChange={handleMultipleChoice}
            type="multiple"
            className="flex flex-wrap justify-center gap-3 w-full">
            {vote.options.map(option => (
              <ToggleGroupItem value={option.value} disabled={vote.status === "closed"} className="w-32 h-32 p-3 relative" key={option.value}>
                <p className="absolute top-2 right-3">{option.votes?.length}</p>
                <p className="text-wrap line-clamp-5 truncate">{option.value}</p>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        ) : (
          <ToggleGroup
            variant="outline"
            defaultValue={vote.options.find(option => option.votes?.includes(deviceId))?.value}
            onValueChange={handleSingleChoice}
            type="single"
            className="flex flex-wrap justify-center gap-3 w-full">
            {vote.options.map(option => (
              <ToggleGroupItem value={option.value} disabled={vote.status === "closed"} className="w-32 h-32 p-3 relative" key={option.value}>
                <p className="absolute top-2 right-3">{option.votes?.length}</p>
                <p className="text-wrap line-clamp-5 truncate">{option.value}</p>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        )}
      </Card>
      {vote.admin === deviceId && (
        <div className="flex flex-col items-center mt-4">
          <Button
            onClick={() => {
              update(voteRef, { status: vote.status === "open" ? "closed" : "open" });
            }}
            className="mt-2">
            {vote.status === "open" ? "Close vote" : "Open vote"}
          </Button>
        </div>
      )}
      {/* <pre>{JSON.stringify(vote, null, 2)}</pre> */}
    </div>
  );
};

export default Vote;
