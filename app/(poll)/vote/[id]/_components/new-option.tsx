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
import { newOptionSchema } from "@/app/(poll)/create/_validation/optionSchema";
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
import { validateDuplicateOptions } from "@/app/(poll)/create/_validation/validateDuplicateOptions";
import { Poll } from "@/types/pollTypes";
import { DatabaseReference, update } from "firebase/database";

interface NewOptionProps {
  poll: Poll;
  pollReference: DatabaseReference;
}

export const NewOption = ({ poll, pollReference }: NewOptionProps) => {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof newOptionSchema>>({
    resolver: zodResolver(newOptionSchema),
    defaultValues: {
      value: "",
    },
  });
  const { control, reset, handleSubmit } = form;
  const { options, status } = poll;

  function handleOpenChange(open: boolean) {
    setOpen(open);
  }

  function onSubmit(values: z.infer<typeof newOptionSchema>) {
    const newOptions = [...options, { value: values.value }];
    const { hasDuplicates } = validateDuplicateOptions(newOptions);
    if (hasDuplicates) {
      form.setError("value", {
        type: "manual",
        message: "Value already exists in previous option.",
      });
      form.setFocus("value");

      return;
    }

    handleNewOption(values.value);
    setOpen(false);
    reset();
  }

  function handleNewOption(value: string): void {
    update(pollReference, {
      options: [
        ...poll.options,
        {
          value,
          votes: [],
        },
      ],
    });
  }

  const isClosed = status === "closed";
  return (
    <Drawer noBodyStyles open={open} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>
        <Button className="w-full" variant="outline" disabled={isClosed}>
          Add option
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mx-auto flex w-full max-w-sm flex-col gap-3 px-3 pb-16 pt-8"
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
              render={({ field, fieldState: { invalid } }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      autoFocus
                      autoComplete="off"
                      className={cn(
                        "w-full",
                        invalid
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
              <Button
                type="submit"
                disabled={!form.formState.isValid || isClosed}
              >
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
