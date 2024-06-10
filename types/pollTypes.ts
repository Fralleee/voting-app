import { User } from "./userTypes";

export interface PollOption {
  value: string;
  votes?: User[];
}

export type PollType = "poll" | "storypoints";

export interface BasePoll {
  type: PollType;
  admin: string;
  allowMultiChoice: boolean;
  options: PollOption[];
}

export interface Poll extends BasePoll {
  type: "poll";
  status: "open" | "closed";
  topic: string;
  blindVoting: boolean;
  allowChoiceCreation: boolean;
}

export interface Storypoints extends BasePoll {
  type: "storypoints";
  status: "open" | "closed" | "locked";
  showVotes: boolean;
}

export interface VoteResultsPerOption {
  name: string;
  votes: number;
  users: User[] | undefined;
}
