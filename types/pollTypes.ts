import { User } from "./userTypes";

export interface PollOption {
  value: string;
  votes?: User[];
}

export type PollType = "poll" | "storypoints";

export interface Poll {
  type: PollType;
  topic: string;
  admin: string;
  blindVoting: boolean;
  allowMultiChoice: boolean;
  allowChoiceCreation: boolean;
  status: "open" | "closed" | "locked";
  options: PollOption[];
}

export interface VoteResultsPerOption {
  name: string;
  votes: number;
  users: User[] | undefined;
}
