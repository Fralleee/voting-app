"use client";

import type { User } from "@/types/userTypes";
import { cn } from "@/utils/cn";
import { Avatar, AvatarFallback } from "./avatar";
import { aliasToAvatar } from "@/app/_utils/aliasToAvatar";
import { randomColorToAvatar } from "@/app/_utils/randomColorToAvatar";

interface AvatarCirclesProps {
  className?: string;
  users: User[];
  maxCircles: number;
}

export default function AvatarCircles({
  users,
  maxCircles,
  className,
}: AvatarCirclesProps) {
  return (
    <div className={cn("z-10 flex -space-x-6 rtl:space-x-reverse", className)}>
      {users.slice(0, maxCircles)?.map((user) => (
        <Avatar key={user.identifier}>
          <AvatarFallback
            className={cn(
              randomColorToAvatar(user.alias),
              "h-8 w-8 rounded-full text-sm",
            )}
          >
            {aliasToAvatar(user.alias)}
          </AvatarFallback>
        </Avatar>
      ))}
      {users.length > maxCircles && (
        <div className="z-20 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-center text-sm font-medium text-primary-foreground">
          +{users.length - maxCircles}
        </div>
      )}
    </div>
  );
}
