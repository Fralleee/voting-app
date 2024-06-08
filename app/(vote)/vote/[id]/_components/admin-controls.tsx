"use client";

import type { Vote } from "@/types/vote";
import { DatabaseReference, update } from "firebase/database";
import { ConfettiSideCannons } from "@/app/_components/side-cannons";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { BookCheck, ListChecks, Lock, LockOpen, RotateCcw } from "lucide-react";

interface AdminControlsProps {
  vote: Vote;
  voteRef: DatabaseReference;
}

const AdminControls = ({ vote, voteRef }: AdminControlsProps) => {
  const closed = vote.status === "closed";
  const locked = vote.status === "locked";

  function lockVoting() {
    if (closed) {
      return;
    }

    update(voteRef, {
      status: locked ? "open" : "locked",
    });
  }

  function closeVoting() {
    update(voteRef, {
      status: "closed",
    });
  }

  function resetVoting() {
    update(voteRef, {
      status: "open",
      options: vote.options.map((option) => ({
        ...option,
        votes: [],
      })),
    });
  }

  return (
    <div className="flex w-full flex-col gap-3">
      <Button
        disabled={closed}
        variant="outline"
        onClick={resetVoting}
        className="flex w-full items-center gap-3"
      >
        <RotateCcw size={16} />
        Reset
      </Button>
      <Toggle
        data-state={locked ? "on" : "off"}
        disabled={closed}
        variant="outline"
        onClick={lockVoting}
        className="flex w-full items-center gap-3"
      >
        {locked ? <Lock size={16} /> : <LockOpen size={16} />}
        {locked ? "Unlock" : "Lock"}
      </Toggle>
      <ConfettiSideCannons
        disabled={closed}
        onClick={closeVoting}
        className="flex w-full items-center gap-3"
      >
        <BookCheck size={16} />
        {vote.type === "poll" ? "Close" : "Close"}
      </ConfettiSideCannons>
    </div>
  );
};

export default AdminControls;
