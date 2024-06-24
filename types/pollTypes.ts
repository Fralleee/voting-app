import { User } from "./userTypes";

export interface PollOption {
  value: string;
  votes?: User[];
}

export type PollType = "poll" | "storypoints";

export interface BasePoll {
  topic: string;
  type: PollType;
  admin: string;
  allowMultiChoice: boolean;
  options: PollOption[];
}

export type PollCategory =
  | "food"
  | "movies"
  | "competition"
  | "technology"
  | "music"
  | "history";

export interface Poll extends BasePoll {
  type: "poll";
  status: "open" | "closed";
  category: PollCategory | undefined;
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
