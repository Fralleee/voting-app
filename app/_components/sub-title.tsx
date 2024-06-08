"use client";

import { motion } from "framer-motion";

export const SubTitle = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.h1
      className="relative text-center text-xl font-bold text-muted md:text-3xl lg:text-4xl"
      initial={{ scale: 0.95, y: -20, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      transition={{ ease: "easeOut", duration: 0.3 }}
    >
      {children}
    </motion.h1>
  );
};
