import { User } from "./userTypes";

export interface PollOption {
  value: string;
  votes?: User[];
}

export interface Poll {
  type: "poll" | "storypoints";
  topic: string;
  admin: string;
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
