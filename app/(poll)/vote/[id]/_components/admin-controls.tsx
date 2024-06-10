"use client";

import type { Poll } from "@/types/pollTypes";
import { DatabaseReference, update } from "firebase/database";
import { ConfettiSideCannons } from "@/app/_components/side-cannons";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { BookCheck, Eye, Lock, LockOpen, RotateCcw } from "lucide-react";

interface AdminControlsProps {
  poll: Poll;
  pollReference: DatabaseReference;
}

const AdminControls = ({ poll, pollReference }: AdminControlsProps) => {
  const closed = poll.status === "closed";
  const locked = poll.status === "locked";

  function showVotes() {
    update(pollReference, {
      status: "locked",
      showVotes: true,
    });
  }

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
      showVotes: false,
      status: "open",
      options: poll.options.map((option) => ({
        ...option,
        votes: [],
      })),
    });
  }

  return (
    <div className="flex w-full flex-col gap-3">
      {poll.type === "storypoints" &&
        (poll.showVotes ? (
          <Button
            variant="outline"
            onClick={resetVoting}
            className="flex w-full items-center gap-3"
          >
            <RotateCcw size={16} />
            Reset
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={showVotes}
            className="flex w-full items-center gap-3"
          >
            <Eye size={16} />
            Reveal votes
          </Button>
        ))}
      <Button
        disabled={closed}
        onClick={closeVoting}
        className="flex w-full items-center gap-3"
      >
        <BookCheck size={16} />
        Close
      </Button>
    </div>
  );
};

export default AdminControls;
