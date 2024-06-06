"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { motion } from "framer-motion";

export const VoteButton = () => {
  return (
    <motion.div
      className="mx-auto px-4 text-center font-normal text-neutral-800 dark:text-neutral-400 md:text-left md:text-xl lg:text-2xl"
      initial={{ scale: 0.25, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.25, opacity: 0 }}
      transition={{ ease: "backOut", duration: 0.3, delay: 0.15 }}
    >
      <Link
        prefetch
        className={buttonVariants({
          size: "xl",
        })}
        href="/create"
      >
        Ready, Set, Vote!
      </Link>
    </motion.div>
  );
};
