export interface VoteOption {
  value: string;
  votes: string[];
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
