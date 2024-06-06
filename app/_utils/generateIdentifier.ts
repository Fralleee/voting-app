import { storage } from "./storage";

export const generateIdentifier = () => {
  let identifier = storage?.getItem("identifier");
  if (!identifier) {
    identifier = `${Math.random().toString(36).substring(2, 10)}`;
    storage?.setItem("identifier", identifier);
  }

  return identifier || "";
};
