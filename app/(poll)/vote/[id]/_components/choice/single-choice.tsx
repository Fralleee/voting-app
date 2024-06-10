import {
  ToggleGroup,
  MotionToggleGroupItem,
} from "@/components/ui/toggle-group";
import { DatabaseReference, update } from "firebase/database";
import { useUser } from "@/app/_hooks/useUser";
import type { Poll, Storypoints } from "@/types/pollTypes";
import { ShowVoters } from "../show-voters";
import { useCallback, useState } from "react";

interface SingleChoiceProps {
  poll: Poll | Storypoints;
  pollReference: DatabaseReference;
}

export const SingleChoice = ({ poll, pollReference }: SingleChoiceProps) => {
  const { user } = useUser();
  const [enableControls, setEnableControls] = useState(false);

  const handleSingleChoice = useCallback(
    (value: string) => {
      update(pollReference, {
        options: poll.options.map((option) => {
          if (value === option.value) {
            return {
              ...option,
              votes: [...(option.votes || []), user],
            };
          }

          return {
            ...option,
            votes: (option.votes || []).filter(
              (u) => u.identifier !== user?.identifier,
            ),
          };
        }),
      });
    },
    [poll.options, pollReference, user],
  );

  return (
    <ToggleGroup
      variant="outline"
      defaultValue={
        poll.options.find((option) =>
          option.votes?.some((u) => u.identifier === user?.identifier),
        )?.value
      }
      onValueChange={handleSingleChoice}
      type="single"
      className="flex w-full flex-wrap justify-center gap-3"
    >
      {poll.options.map((option, index) => {
        const delay = index < 3 ? index * 0.25 : 0.75;
        return (
          <MotionToggleGroupItem
            onAnimationComplete={() =>
              index === poll.options.length - 1 && setEnableControls(true)
            }
            variants={{
              hidden: { scale: 0, opacity: 0 },
              visible: {
                scale: 1,
                opacity: 1,
                transition: {
                  duration: 0.4,
                  ease: "backOut",
                  delay,
                },
              },
            }}
            value={option.value}
            disabled={poll.status !== "open" || !enableControls}
            key={option.value}
            className="relative h-32 w-32 select-none p-3 text-lg data-[disabled]:text-muted-foreground"
          >
            <ShowVoters option={option} poll={poll} />
            <p className="line-clamp-5 truncate text-wrap">{option.value}</p>
          </MotionToggleGroupItem>
        );
      })}
    </ToggleGroup>
  );
};
