import { useContext } from "react";
import { UserContext } from "../_context/UserContext";

export const useUser = () => {
  return useContext(UserContext);
};
