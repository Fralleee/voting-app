"use client";

import React from "react";
import { FlipWords } from "../../components/ui/flip-words";
import { motion } from "framer-motion";

const regularVotes = [
  "single-choice polls",
  "multi-choice polls",
  "storypoints voting",
];
const Prompts = () => (
  <motion.div
    className="mx-auto mt-12 px-4 text-center font-normal text-muted-foreground md:text-left md:text-xl lg:text-2xl"
    initial={{ scale: 0.95, y: 20, opacity: 0 }}
    animate={{ scale: 1, y: 0, opacity: 1 }}
    transition={{ ease: "easeOut", duration: 0.3 }}
  >
    Create <FlipWords words={regularVotes} /> easier than deciding on what pizza
    to get
  </motion.div>
);

export default Prompts;
