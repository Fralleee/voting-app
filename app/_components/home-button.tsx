"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { motion } from "framer-motion";

export const HomeButton = () => {
  return (
    <motion.div
      className="mx-auto mt-6 px-4 text-center font-normal md:text-left md:text-xl lg:text-2xl"
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
        href="/"
      >
        Take me back
      </Link>
    </motion.div>
  );
};
