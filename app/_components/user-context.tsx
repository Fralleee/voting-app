"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { ref, set, update } from "firebase/database";
import { useObjectVal } from "react-firebase-hooks/database";
import { database } from "@/lib/firebase";
import { generateIdentifier } from "../_utils/generateIdentifier";
import { generateUsername } from "../_utils/generateUsername";
import { storage } from "../_utils/storage";
import type { User } from "@/types/user";

interface UserContextType {
  user: User | null;
  identifier: string;
  isLoading: boolean;
  error: Error | undefined;
  alias: string | null | undefined;
  updateUserAlias: (newAlias: string) => void;
}

const defaultContextValue: UserContextType = {
  user: null,
  identifier: storage?.getItem("identifier") || generateIdentifier(),
  isLoading: true,
  error: undefined,
  alias: storage?.getItem("alias") || undefined,
  updateUserAlias: (newAlias: string) => {},
};

const UserContext = createContext<UserContextType>(defaultContextValue);

export const useIdentity = () => {
  const [identifier] = useState(
    storage?.getItem("identifier") || generateIdentifier(),
  );
  const [alias, setAlias] = useState(storage?.getItem("alias"));
  const [isLoading, setIsLoading] = useState(true);
  const userRef = ref(database, `users/${identifier}`);
  const [user, loading, error] = useObjectVal<User>(userRef);

  useEffect(() => {
    if (!loading && !user && identifier) {
      const alias = storage?.getItem("alias") ?? generateUsername();
      const newUser = { identifier, alias };
      set(userRef, newUser)
        .then(() => {
          storage?.setItem("alias", alias);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Firebase write failed: " + error.message);
        });
    } else if (!loading && user) {
      setAlias(user.alias);
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- userRef is stable
  }, [user, loading]);

  const updateUserAlias = (newAlias: string) => {
    update(ref(database, `users/${identifier}`), { alias: newAlias })
      .then(() => {
        setAlias(newAlias);
        storage?.setItem("alias", newAlias);
      })
      .catch(console.error);
  };

  const userVal = user as User;
  return {
    user: userVal,
    identifier,
    isLoading,
    error,
    alias,
    updateUserAlias,
  };
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const identity = useIdentity();

  return (
    <UserContext.Provider value={identity}>{children}</UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

export default UserProvider;
