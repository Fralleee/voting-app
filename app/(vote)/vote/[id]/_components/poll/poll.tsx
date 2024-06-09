"use client";

import React, { useEffect } from "react";
import type { Poll } from "@/types/voteTypes";
import { ref, update } from "firebase/database";
import { database } from "@/lib/firebase";
import { useObjectVal } from "react-firebase-hooks/database";
import { notFound } from "next/navigation";
import useIdentity from "@/app/_hooks/useIdentity";
import Results from "./results";
import Voting from "./voting";

const Poll = ({ id }: { id: string }) => {
  const pollReference = ref(database, `votes/${id}`);
  const [poll, loading] = useObjectVal<Poll>(pollReference);
  const { user, identifier, isLoading } = useIdentity();

  useEffect(() => {
    if (!user || !poll) return;
    const hasVotesWithOtherAlias = poll.options.some((option) =>
      option.votes?.some(
        (u) => u.identifier === identifier && u.alias !== user.alias,
      ),
    );

    if (!hasVotesWithOtherAlias) {
      return;
    }

    update(pollReference, {
      options: poll.options.map((option) => ({
        ...option,
        votes: (option.votes || [])?.map((u) =>
          u.identifier === identifier ? { ...u, alias: user.alias } : u,
        ),
      })),
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  if (loading || isLoading || !user) {
    return null;
  }

  if (!poll) {
    notFound();
  }

  return poll.status === "closed" ? (
    <Results poll={poll} />
  ) : (
    <Voting poll={poll} pollReference={pollReference} user={user} />
  );
};

export default Poll;
