import AvatarCircles from "@/components/ui/avatar-circles";
import type { Poll, PollOption, Storypoints } from "@/types/pollTypes";

interface ShowVotersProps {
  poll: Poll | Storypoints;
  option: PollOption;
}

export const ShowVoters = ({ poll, option }: ShowVotersProps) => {
  const show =
    (poll.type === "storypoints" && poll.showVotes) ||
    (poll.type === "poll" && !poll.blindVoting);
  return show ? (
    <div className="absolute right-2 top-2">
      <AvatarCircles users={option.votes || []} maxCircles={3} />
    </div>
  ) : null;
};
