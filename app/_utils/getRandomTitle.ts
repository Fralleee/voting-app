const titles = [
  "Poll Fiction",
  "The Polling Stones",
  "Indiana Polls",
  "Silence of the Votes",
  "Lord of the Polls",
  "Poll-tergeist",
  "Pollyy McPollface",
  "Jurassic Poll",
  "Harry Pollter",
  "Mad Poll: Fury Vote",
  "Polls and Recreation",
  "007: License to Vote",
];

export const getRandomTitle = () =>
  titles[Math.floor(Math.random() * titles.length)];
