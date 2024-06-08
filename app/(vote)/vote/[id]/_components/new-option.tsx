"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { newOptionSchema } from "@/app/(vote)/create/_validation/optionSchema";
import { useState } from "react";
import { z } from "zod";
import { cn } from "@/utils/cn";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

export const NewOption = ({ onAdd }: { onAdd: (value: string) => void }) => {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof newOptionSchema>>({
    resolver: zodResolver(newOptionSchema),
    defaultValues: {
      value: "",
    },
  });
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = form;

  function handleOpenChange(open: boolean) {
    setOpen(open);
  }

  function onSubmit(values: z.infer<typeof newOptionSchema>) {
    onAdd(values.value);
    setOpen(false);
    reset();
  }

  return (
    <Drawer noBodyStyles open={open} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>
        <Button variant="outline">Add option</Button>
      </DrawerTrigger>
      <DrawerContent>
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mx-auto flex w-full max-w-sm flex-col gap-3 pb-16 pt-8"
          >
            <DrawerHeader className="p-0">
              <DrawerTitle>Add option</DrawerTitle>
              <DrawerDescription>
                Nothing tickling your fancy? Throw in your wild card.
              </DrawerDescription>
            </DrawerHeader>
            <FormField
              control={control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      autoFocus
                      autoComplete="off"
                      className={cn(
                        "w-full",
                        errors.value
                          ? "border-red-700 focus-visible:border-input focus-visible:ring-red-700"
                          : "",
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DrawerFooter className="mt-6 p-0">
              <Button type="submit" disabled={!form.formState.isValid}>
                Submit
              </Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
};
