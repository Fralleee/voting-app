import { type Variants, motion, AnimatePresence } from "framer-motion";

const variants: Variants = {
  initial: {
    scaleY: 0.5,
    opacity: 0,
  },
  animate: {
    scaleY: 1,
    opacity: 1,
    transition: {
      repeat: Infinity,
      repeatType: "mirror",
      duration: 0.4,
      ease: "circInOut",
    },
  },
};

export const BarLoader = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          transition={{
            duration: 0.3,
            staggerChildren: 0.15,
          }}
          initial="initial"
          animate="animate"
          exit={{
            opacity: 0,
          }}
          className="fixed inset-0 z-10 mx-auto flex h-full items-center justify-center gap-2 bg-background"
        >
          <motion.div variants={variants} className="h-14 w-5 bg-primary" />
          <motion.div variants={variants} className="h-20 w-5 bg-primary" />
          <motion.div variants={variants} className="h-24 w-5 bg-primary" />
          <motion.div variants={variants} className="h-20 w-5 bg-primary" />
          <motion.div variants={variants} className="h-14 w-5 bg-primary" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
