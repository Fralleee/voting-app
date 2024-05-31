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

const MainTitle = () => {
  const title = titles[Math.floor(Math.random() * titles.length)];

  return <h1 className="md:text-7xl text-3xl lg:text-9xl font-bold text-center text-stone-700 dark:text-slate-200 relative z-20">{title}</h1>;
};

export default MainTitle;
