export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
      delayChildren: 0.2,
      staggerChildren: 0.15,
    },
  },
};

export const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
};

export const buttonVariant = {
  hidden: { scale: 0.25, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { ease: "backOut", duration: 0.3 },
  },
};
