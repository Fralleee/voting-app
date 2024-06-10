import React from "react";
import { Button } from "@/components/ui/button";
import { Confetti } from "@/components/ui/confetti";

export interface ConfettiSideCannonsProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  duration?: number;
  colors?: string[];
}

export function ConfettiSideCannons({
  children,
  duration = 3,
  onClick,
  colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"],
  ...rest
}: ConfettiSideCannonsProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(e);
    }

    const end = Date.now() + duration * 1000;
    const frame = () => {
      if (Date.now() > end) return;

      Confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      Confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });

      requestAnimationFrame(frame);
    };

    frame();
  };

  return (
    <Button onClick={handleClick} {...rest}>
      {children}
    </Button>
  );
}
