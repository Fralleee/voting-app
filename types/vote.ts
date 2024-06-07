import { User } from "./user";

export interface VoteOption {
  value: string;
  votes: User[];
}

export interface Vote {
  type: "poll" | "storypoints";
  name: string;
  admin: string;
  allowMultiChoice: boolean;
  allowChoiceCreation: boolean;
  status: "open" | "closed";
  options: VoteOption[];
}
