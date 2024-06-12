import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";

interface ExpandableProps {
  expanded: boolean;
  children: React.ReactNode;
}

export const Expandable = ({ expanded, children }: ExpandableProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState(expanded ? 500 : 0);

  useEffect(() => {
    if (expanded) {
      setMaxHeight(contentRef.current?.scrollHeight || 0);
    } else {
      setMaxHeight(0);
    }
  }, [expanded, children]);

  return (
    <div
      className="transition-all duration-300 ease-out"
      style={{
        maxHeight: maxHeight,
        opacity: expanded ? 1 : 0,
        pointerEvents: expanded ? "auto" : "none",
      }}
    >
      <motion.div className="flex flex-col gap-3" ref={contentRef}>
        {children}
      </motion.div>
    </div>
  );
};
