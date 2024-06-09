"use client";

import React from "react";
import { MotionCard } from "@/components/ui/card";
import type { Poll } from "@/types/voteTypes";
import { containerVariants, itemVariants } from "@/app/_animations/variants";

const Results = ({ poll }: { poll: Poll }) => {
  return (
    <MotionCard
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="mx-auto flex h-full min-h-screen w-full flex-col justify-between gap-3 px-4 pt-20 md:h-auto md:min-h-0 md:px-8 md:py-12"
    >
      <h1>Results</h1>
    </MotionCard>
  );
};

export default Results;
