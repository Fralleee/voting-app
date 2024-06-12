import {
  ToggleGroup,
  MotionToggleGroupItem,
} from "@/components/ui/toggle-group";
import { DatabaseReference, update } from "firebase/database";
import { useUser } from "@/app/_hooks/useUser";
import { useCallback, useState } from "react";
import { Poll, Storypoints } from "@/types/pollTypes";
import { ShowVoters } from "../show-voters";
import { buttonVariant } from "@/app/_animations/variants";

interface MultiChoiceProps {
  poll: Poll | Storypoints;
  pollReference: DatabaseReference;
}

export const MultiChoice = ({ poll, pollReference }: MultiChoiceProps) => {
  const { user } = useUser();
  const [enableControls, setEnableControls] = useState(false);

  const handleMultipleChoice = useCallback(
    (value: string[]): void => {
      update(pollReference, {
        options: poll.options.map((option) => {
          if (value.includes(option.value)) {
            const alreadyVoted = option.votes?.some(
              (u) => u.identifier === user?.identifier,
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
      value={poll.options
        .filter((option) =>
          option.votes?.some((u) => u.identifier === user?.identifier),
        )
        .map((opt) => opt.value)}
      onValueChange={handleMultipleChoice}
      type="multiple"
      className="flex w-full flex-wrap justify-center gap-3"
    >
      {poll.options.map((option, index) => {
        return (
          <MotionToggleGroupItem
            key={index}
            onAnimationComplete={() =>
              index === poll.options.length - 1 && setEnableControls(true)
            }
            variants={buttonVariant}
            value={option.value}
            disabled={poll.status !== "open" || !enableControls}
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
