import React from "react";
import { InfiniteMovingCards } from "./ui/infinite-moving-cards";
import { shuffle } from "@/utils/array";

const testimonials = [
  {
    quote: "This app blows! Nobody is voting my favor!",
    name: "Doland Tremp",
    title: "Some weirdo on the internet",
  },
  {
    quote: "Perfect for deciding who has to take out the trash. Spoiler: it's never me!",
    name: "Gary Plotter",
    title: "Lazy Roommate",
  },
  {
    quote: "Now I can officially prove that pineapple does belong on pizza. Take that, haters!",
    name: "Sammy Pepperoni",
    title: "Pizza Advocate",
  },
  {
    quote: "Why argue at family dinners when you can silently vote and still be mad about it later?",
    name: "Ellie Argument",
    title: "Family Peacemaker",
  },
  {
    quote: "My friends and I use this to decide where to eat. Now, I don't talk to half of them. Great app!",
    name: "Jenna Compromise",
    title: "Former Friend",
  },
  {
    quote: "I thot this wuz a game. Lol, did I win?",
    name: "Stoney Rockwell",
    title: "Gamer and Accidental Tourist",
  },
];

export function Quotes() {
  return (
    <div className="h-96 rounded-md flex flex-col antialiased bg-stone-50/85 bg-grid-stone-950/[0.025] dark:bg-slate-950/85 dark:bg-grid-slate-50/[0.04] items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards items={shuffle(testimonials)} direction="right" speed="slow" />
    </div>
  );
}
