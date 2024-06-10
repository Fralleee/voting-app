import { User } from "./userTypes";

export interface PollOption {
  value: string;
  votes?: User[];
}

export type PollType = "poll" | "storypoints";

export interface Poll {
  type: PollType;
  topic: string; // Not used by storypoints
  admin: string;
  showVotes: boolean;
  blindVoting: boolean; // Only used by Poll
  allowMultiChoice: boolean;
  allowChoiceCreation: boolean; // Not used by storypoints
  status: "open" | "closed" | "locked"; // Poll cant be locked
  options: PollOption[];
}

export interface VoteResultsPerOption {
  name: string;
  votes: number;
  users: User[] | undefined;
}
