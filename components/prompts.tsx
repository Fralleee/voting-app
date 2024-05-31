import React from "react";
import { FlipWords } from "./ui/flip-words";
import { shuffle } from "@/utils/array";

const regularVotes = ["single-choice polls", "multi-choice polls", "storypoints voting"];
const Prompts = () => (
  <div className="text-2xl mx-auto font-normal text-neutral-800 dark:text-neutral-400">
    Create <FlipWords words={shuffle(regularVotes)} /> easier than deciding on what pizza to get
  </div>
);

export default Prompts;
