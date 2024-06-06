const funnyAdjectives = [
  "Silly",
  "Dancing",
  "Flying",
  "Jumping",
  "Singing",
  "Laughing",
  "Running",
  "Skipping",
  "Hopping",
  "Swimming",
  "Climbing",
  "Falling",
  "Rolling",
  "Sliding",
];

const funnyAnimals = [
  "Elephant",
  "Monkey",
  "Giraffe",
  "Kangaroo",
  "Koala",
  "Panda",
  "Penguin",
  "Polar bear",
  "Tiger",
  "Lion",
  "Zebra",
  "Hippo",
  "Rhino",
  "Gorilla",
  "Parrot",
];

export const generateUsername = () => {
  return `${funnyAdjectives[Math.floor(Math.random() * funnyAdjectives.length)]} ${funnyAnimals[Math.floor(Math.random() * funnyAnimals.length)]}`;
};
