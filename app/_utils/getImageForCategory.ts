import type { PollCategory } from "@/types/pollTypes";
import Food from "@/app/_images/food.svg";
import Movies from "@/app/_images/movies.svg";
import Competition from "@/app/_images/competition.svg";
import Technology from "@/app/_images/technology.svg";
import Music from "@/app/_images/music.svg";
import History from "@/app/_images/history.svg";

export const getImageForCategory = (category: PollCategory) => {
  switch (category) {
    case "food":
      return Food;
    case "movies":
      return Movies;
    case "competition":
      return Competition;
    case "technology":
      return Technology;
    case "music":
      return Music;
    case "history":
      return History;
    default:
      return null;
  }
};
