"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import type { Vote, VoteOption } from "@/types/vote";
import { Skeleton } from "@/components/ui/skeleton";
import { useIdentifyUserDevice } from "../hooks/useIdentifyUserDevice";
import { ref, update } from "firebase/database";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useObject } from "react-firebase-hooks/database";
import { database } from "@/lib/firebase";
import { Button } from "@/components/ui/button";

const Vote = ({ id }: { id: string }) => {
  const voteRef = ref(database, `votes/${id}`);
  const [snapshot, loading, error] = useObject(voteRef);
  const deviceId = useIdentifyUserDevice();

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

  function handleToggle(value: string) {
    let options: VoteOption[] = [];
    if (!value) {
      options = vote.options.map(opt => ({ ...opt, votes: (opt.votes || []).filter(vote => vote !== deviceId) }));
    } else {
      const option = vote.options.find(opt => opt.value === value) as VoteOption;
      options = vote.options.map(opt => {
        const votes = opt.votes || [];
        if (option.value === opt.value) {
          return {
            ...opt,
            votes: votes.includes(deviceId) === false ? [...(opt.votes || []), deviceId] : votes,
          };
        } else {
          return {
            ...opt,
            votes: votes.filter(vote => vote !== deviceId),
          };
        }
      });
    }

    update(voteRef, { options });
  }

  const defaultValue = vote.options.find(option => option.votes?.includes(deviceId))?.value;

  return (
    <div className="flex flex-col items-center w-full max-w-[640px]">
      <h1 className="text-2xl mb-4">{vote.name}</h1>
      <p className="text-gray-500 mb-4 font-semibold">Voting is {vote.status === "open" ? "Open" : "Closed"}</p>
      <Card className="flex flex-col p-12 w-full">
        <ToggleGroup defaultValue={defaultValue} onValueChange={handleToggle} type="single" className="flex flex-wrap justify-center gap-3 w-full">
          {vote.options.map(option => (
            <ToggleGroupItem value={option.value} disabled={vote.status === "closed"} className="w-32 h-32 p-3 relative" key={option.value}>
              <p className="absolute top-2 right-3">{option.votes?.length}</p>
              <p className="text-wrap line-clamp-5 truncate">{option.value}</p>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
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
