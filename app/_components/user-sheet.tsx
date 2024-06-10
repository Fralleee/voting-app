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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema } from "../(poll)/create/_validation/userSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUser } from "../_hooks/useUser";

export function UserSheet() {
  const [open, setOpen] = useState(false);
  const { user, isLoading, updateUserAlias } = useUser();
  const [isClient, setIsClient] = useState(false);
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      alias: user?.alias || "",
    },
  });
  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = form;

  useEffect(() => {
    // As soon as the component mounts, we know we're on the client
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (user && !isLoading) {
      setValue("alias", user.alias);
    }
    setIsClient(true);
  }, [isLoading, setValue, user]);

  function onSubmit(values: z.infer<typeof userSchema>) {
    if (!form.formState.isValid) {
      return;
    }

    const { alias } = values;
    setOpen(false);
    updateUserAlias(alias);
  }

  function handleOpenChange(open: boolean) {
    setOpen(open);
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <SheetTrigger asChild>
            <div>
              <Button size="icon" variant="outline">
                <span className="sr-only">User settings</span>
                <Avatar>
                  {isClient && !isLoading && user?.alias ? (
                    <AvatarFallback className={randomColorToAvatar(user.alias)}>
                      {aliasToAvatar(user.alias)}
                    </AvatarFallback>
                  ) : (
                    <AvatarFallback>
                      <UserIcon className="h-6 w-6" />
                    </AvatarFallback>
                  )}
                </Avatar>
              </Button>
              <TooltipContent side="bottom">
                <p>Edit profile</p>
              </TooltipContent>
            </div>
          </SheetTrigger>
        </TooltipTrigger>
      </Tooltip>
      <SheetContent>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <SheetHeader>
              <SheetTitle>Edit profile</SheetTitle>
              <SheetDescription>Update your name.</SheetDescription>
            </SheetHeader>
            <div className="my-4">
              <FormField
                control={control}
                name="alias"
                render={({ field, fieldState: { invalid } }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        className={
                          invalid
                            ? "border-red-700 focus-visible:border-input focus-visible:ring-red-700"
                            : ""
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <SheetFooter>
              <div className="flex w-full flex-col gap-3">
                <Button type="submit" disabled={!form.formState.isValid}>
                  Save changes
                </Button>
                <SheetClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </SheetClose>
              </div>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
