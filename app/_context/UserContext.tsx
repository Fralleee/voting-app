"use client";

import { createContext, useMemo } from "react";
import { useEffect, useState } from "react";
import { ref, set, update } from "firebase/database";
import { useObjectVal } from "react-firebase-hooks/database";
import { database } from "@/lib/firebase";
import { generateIdentifier } from "../_utils/generateIdentifier";
import { generateUsername } from "../_utils/generateUsername";
import { storage } from "../_utils/storage";
import type { User } from "@/types/userTypes";

interface UserContextProps {
  user?: User;
  isLoading: boolean;
  error?: Error;
  updateUserAlias: (newAlias: string) => void;
}

const defaultValues = {
  isLoading: false,
  error: undefined,
  updateUserAlias: () => {},
};

export const UserContext = createContext<UserContextProps>(defaultValues);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, error, updateUserAlias } = useIdentity();

  const value = useMemo(
    () => ({
      user,
      isLoading,
      error,
      updateUserAlias,
    }),
    [user, isLoading, error, updateUserAlias],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

const useIdentity = () => {
  const [identifier] = useState(() => {
    return storage?.getItem("identifier") || generateIdentifier();
  });

  const userRef = useMemo(
    () => ref(database, `users/${identifier}`),
    [identifier],
  );
  const [user, loading, firebaseError] = useObjectVal<User>(userRef);
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    const isNewUser = !loading && !user && identifier;
    if (isNewUser) {
      const alias = storage?.getItem("alias") ?? generateUsername();
      const newUser = { identifier, alias };

      set(userRef, newUser)
        .then(() => {
          storage?.setItem("alias", alias);
        })
        .catch((err) => {
          console.error("Firebase write failed: " + err.message);
          setError(new Error("Failed to create user profile."));
        });
    }
  }, [identifier, user, loading, userRef]);

  const updateUserAlias = (newAlias: string) => {
    update(userRef, { alias: newAlias })
      .then(() => {
        storage?.setItem("alias", newAlias);
      })
      .catch((err) => {
        console.error("Failed to update user alias: " + err.message);
        setError(new Error("Failed to update user alias."));
      });
  };

  return {
    user,
    isLoading: loading,
    error: error || firebaseError,
    updateUserAlias,
  };
};
