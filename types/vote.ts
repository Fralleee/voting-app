export interface VoteOption {
  value: string;
  votes: string[];
}

export interface Vote {
  name: string;
  admin: string;
  status: "open" | "closed";
  options: VoteOption[];
}
