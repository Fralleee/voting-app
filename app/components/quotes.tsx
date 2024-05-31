import React from "react";
import { InfiniteMovingCards } from "./ui/infinite-moving-cards";

const testimonials = [
  {
    quote: "This app is the ultimate exception handler in the symphony of programming; it's like discovering recursion for the first time—simply mind-blowing!",
    name: "Guido van Rossum",
    title: "Python Lord",
  },
  {
    quote: "Using this app feels like I've overclocked my brain! It's the kind of tool that could write 'Hello World' in binary using smoke signals.",
    name: "Linus Torvalds",
    title: "Doctor Linux aka The Big Cheese",
  },
  {
    quote:
      "If software development were a sport, this app would be what they use in the world championships. It’s like the digital equivalent of a caffeine boost, minus the jitters.",
    name: "James Gosling",
    title: "Father of Java",
  },
  {
    quote:
      "In a world full of semicolons and syntax errors, this app is the true unconditional breakpoint. It’s like a 'for' loop without an increment condition—just keeps giving more!",
    name: "Bjarne Stroustrup",
    title: "The ++ in C++",
  },
  {
    quote:
      "Forget about quantum computing; using this app is like having a multidimensional array of possibilities at your fingertips. It's the definitive solution to the 'travelling salesman problem' in productivity!",
    name: "Donald Knuth",
    title: "Author of The Art of Computer Programming",
  },
];

export function Quotes() {
  return (
    <div className="h-96 rounded-md flex flex-col antialiased bg-white dark:bg-black/85 dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards items={testimonials} direction="right" speed="slow" />
    </div>
  );
}
