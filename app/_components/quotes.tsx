"use client";

import React from "react";
import { InfiniteMovingCards } from "../../components/ui/infinite-moving-cards";
import { shuffle } from "@/utils/array";
import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "This app blows! Nobody is voting my favor!",
    name: "Doland Tremp",
    title: "Some weirdo on the internet",
  },
  {
    quote:
      "Perfect for deciding who has to take out the trash. Spoiler: it's never me!",
    name: "Gary Plotter",
    title: "Lazy Roommate",
  },
  {
    quote:
      "Now I can officially prove that pineapple does belong on pizza. Take that, haters!",
    name: "Sammy Pepperoni",
    title: "Pizza Advocate",
  },
  {
    quote:
      "Why argue at family dinners when you can silently vote and still be mad about it later?",
    name: "Ellie Argument",
    title: "Family Peacemaker",
  },
  {
    quote:
      "My friends and I use this to decide where to eat. Now, I don't talk to half of them. Great app!",
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
    <motion.div
      className="b relative flex h-96 flex-col items-center justify-center overflow-hidden rounded-md antialiased"
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ ease: "backOut", duration: 0.4 }}
    >
      <InfiniteMovingCards
        items={shuffle(testimonials)}
        direction="right"
        speed="slow"
      />
    </motion.div>
  );
}
