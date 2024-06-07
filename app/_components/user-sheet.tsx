"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { aliasToAvatar } from "../_utils/aliasToAvatar";
import { randomColorToAvatar } from "../_utils/randomColorToAvatar";
import { UserIcon } from "lucide-react";
import useIdentity from "../_hooks/useIdentity";

export function UserSheet() {
  const { alias, isLoading, updateUserAlias } = useIdentity();
  const [newAlias, setNewAlias] = useState(alias || "");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // As soon as the component mounts, we know we're on the client
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (alias) {
      setNewAlias(alias);
    }
  }, [alias]);

  const handleAliasChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewAlias(event.target.value);
  };

  const saveAlias = () => {
    const trimmedAlias = newAlias.trim();
    if (!trimmedAlias) {
      return;
    }

    updateUserAlias(trimmedAlias);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline">
          <span className="sr-only">User settings</span>
          <Avatar>
            {isClient && !isLoading && alias ? (
              <AvatarFallback className={randomColorToAvatar(alias)}>
                {aliasToAvatar(alias)}
              </AvatarFallback>
            ) : (
              <AvatarFallback>
                <UserIcon className="h-6 w-6" />
              </AvatarFallback>
            )}
          </Avatar>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>Update your name.</SheetDescription>
        </SheetHeader>
        <div className="my-4">
          <Input id="name" value={newAlias} onChange={handleAliasChange} />
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="button" onClick={saveAlias}>
              Save changes
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
