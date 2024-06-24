"use client";

import React, { PropsWithChildren } from "react";
import { motion } from "framer-motion";

export const Title = ({ children }: PropsWithChildren<unknown>) => {
  return (
    <motion.h1
      className="relative z-20 mt-6 text-center text-5xl font-bold md:text-6xl lg:text-8xl"
      initial={{ scale: 0.95, y: -20, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      transition={{ ease: "easeOut", duration: 0.3 }}
    >
      {children}
    </motion.h1>
  );
};
