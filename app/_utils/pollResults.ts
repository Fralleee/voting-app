import { Poll, Storypoints, VoteResultsPerOption } from "@/types/pollTypes";

interface PollResults {
  totalVotes: number;
  votesPerOption: VoteResultsPerOption[];
}

export const getPollResults = (poll: Poll | Storypoints): PollResults => {
  const totalVotes = poll.options.reduce(
    (acc, option) => acc + (option.votes?.length || 0),
    0,
  );

  const votesPerOption = poll.options.map((option) => ({
    name: option.value,
    votes: option.votes?.length || 0,
    users: option.votes,
  }));

  return { totalVotes, votesPerOption };
};

export const getWinningOptions = (
  votesPerOption: VoteResultsPerOption[],
): VoteResultsPerOption[] => {
  const maxVotes = Math.max(...votesPerOption.map((option) => option.votes));
  return votesPerOption.filter((option) => option.votes === maxVotes);
};
