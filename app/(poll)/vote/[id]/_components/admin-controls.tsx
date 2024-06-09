"use client";

import type { Poll } from "@/types/pollTypes";
import { DatabaseReference, update } from "firebase/database";
import { ConfettiSideCannons } from "@/app/_components/side-cannons";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { BookCheck, Lock, LockOpen, RotateCcw } from "lucide-react";

interface AdminControlsProps {
  poll: Poll;
  pollReference: DatabaseReference;
}

const AdminControls = ({ poll, pollReference }: AdminControlsProps) => {
  const closed = poll.status === "closed";
  const locked = poll.status === "locked";

  function lockVoting() {
    if (closed) {
      return;
    }

    update(pollReference, {
      status: locked ? "open" : "locked",
    });
  }

  function closeVoting() {
    update(pollReference, {
      status: "closed",
    });
  }

  function resetVoting() {
    update(pollReference, {
      status: "open",
      options: poll.options.map((option) => ({
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
        Close
      </ConfettiSideCannons>
    </div>
  );
};

export default AdminControls;
