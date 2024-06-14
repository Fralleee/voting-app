"use client";

import { motion } from "framer-motion";

export const Gradient = () => {
  return (
    <motion.div
      className="relative h-10 w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ease: "easeOut", duration: 0.4 }}
    >
      <div className="absolute inset-x-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-pink-400 to-transparent blur-sm dark:h-[2px] dark:via-indigo-200" />
      <div className="absolute inset-x-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-pink-400 to-transparent dark:via-indigo-200" />
      <div className="absolute left-1/4 right-1/4 top-0 h-[2px] w-1/2 bg-gradient-to-r from-transparent via-red-400 to-transparent blur-sm dark:h-1 dark:via-sky-400" />
      <div className="absolute left-1/4 right-1/4 top-0 h-px w-1/2 bg-gradient-to-r from-transparent via-red-400 to-transparent dark:via-sky-400" />
    </motion.div>
  );
};
