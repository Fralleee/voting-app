import React from "react";
import { FlipWords } from "./ui/flip-words";

const regularVotes = ["single-choice polls", "multi-choice polls", "storypoints voting"];
const Prompts = () => (
  <div className="text-2xl mx-auto font-normal text-neutral-600 dark:text-neutral-400">
    Create <FlipWords words={regularVotes} /> easier than deciding on what pizza to get
  </div>
);

export default Prompts;
