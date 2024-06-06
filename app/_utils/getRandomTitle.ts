const titles = [
  "Poll Fiction",
  "The Polling Stones",
  "Indiana Votes",
  "Silence of the Votes",
  "Lord of the Polls",
  "Poll-tergeist",
  "Votey McVoteface",
  "Jurassic Poll",
  "Harry Pollter",
  "Mad Poll: Fury Vote",
  "Polls and Recreation",
  "007: License to Vote",
];

export const getRandomTitle = () =>
  titles[Math.floor(Math.random() * titles.length)];
