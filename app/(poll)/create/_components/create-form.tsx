"use client";

import { UseFormReturn, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { motion } from "framer-motion";
import { LoadingButton } from "@/components/ui/loading-button";
import { useState } from "react";
import { pollSchema, storypointsSchema } from "../_validation/pollSchema";
import {
  containerVariants,
  itemVariants,
  buttonVariant,
} from "@/app/_animations/variants";
import { MotionCard } from "@/components/ui/card";
import { useWarnIfUnsavedChanges } from "@/app/_hooks/useWarnIfUnsavedChanges";
import { useUser } from "@/app/_hooks/useUser";
import React from "react";
import { OptionsInput } from "./options-input";
import SettingsInput from "./settings-input";
import { createPoll, createStorypointsPoll } from "../_utils/createPoll";

const CreateForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState<"poll" | "storypoints">("poll");
  const router = useRouter();
  const { user } = useUser();

  const form = useForm<
    z.infer<typeof pollSchema> | z.infer<typeof storypointsSchema>
  >({
    resolver: zodResolver(type === "poll" ? pollSchema : storypointsSchema),
    defaultValues: {
      type,
      topic: "",
      options: [{ value: "" }, { value: "" }],
      blindVoting: false,
      allowChoiceCreation: false,
      allowMultiChoice: false,
    },
  });

  // Using dirtyFields to check if there are any unsaved changes rather than isDirty since it's more accurate
  const { dirtyFields } = form.formState;
  const hasAnyDirtyFields = Object.keys(dirtyFields).length > 0;
  useWarnIfUnsavedChanges(hasAnyDirtyFields);

  async function onSubmit(
    values: z.infer<typeof pollSchema> | z.infer<typeof storypointsSchema>,
  ) {
    setIsLoading(true);

    if (type === "storypoints") {
      const key = await createStorypointsPoll(type, user?.identifier, values);
      return router.push(`/vote/${key}`);
    }

    if (type === "poll") {
      const key = await createPoll(
        type,
        user?.identifier,
        form as UseFormReturn<z.infer<typeof pollSchema>>,
        values as z.infer<typeof pollSchema>,
      );
      if (key) {
        router.push(`/vote/${key}`);
      } else {
        setIsLoading(false);
      }
    }
  }

  return (
    <MotionCard
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="mx-auto flex h-full w-full max-w-xl flex-col justify-between rounded-lg px-4 pt-20 md:h-auto md:border md:px-8 md:py-12"
    >
      <Form {...form}>
        <motion.form
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex h-full flex-col justify-between"
        >
          <div className="flex flex-grow flex-col gap-3">
            <motion.div variants={itemVariants}>
              <SettingsInput form={form} type={type} onTypeChange={setType} />
            </motion.div>

            {type === "poll" && (
              <motion.div
                variants={itemVariants}
                className="flex flex-col gap-3"
              >
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field, fieldState: { invalid } }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="What should we vote about?"
                          autoComplete="off"
                          className={`h-14 ${invalid ? "border-red-700 focus-visible:border-input focus-visible:ring-red-700" : ""}`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <OptionsInput
                  form={form as UseFormReturn<z.infer<typeof pollSchema>>}
                />

                <FormField
                  control={form.control}
                  name="optionErrors"
                  render={() => (
                    <FormItem className="flex flex-row items-center justify-between px-1 py-2">
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
            )}
          </div>

          <motion.div
            variants={buttonVariant}
            className="mx-auto my-6 flex w-full max-w-64 flex-col items-center justify-end gap-3"
          >
            {type === "poll" && (
              <motion.p
                variants={itemVariants}
                className="text-center text-sm text-muted-foreground"
              >
                Start typing, and new options will be added automatically
              </motion.p>
            )}
            <div className="mx-auto mt-6 flex w-full max-w-64 flex-col justify-end gap-3">
              <LoadingButton
                loading={isLoading}
                className="w-full"
                type="submit"
              >
                Start voting!
              </LoadingButton>
              <Link
                prefetch
                className={buttonVariants({ variant: "outline" })}
                href="/"
              >
                Cancel
              </Link>
            </div>
          </motion.div>
        </motion.form>
      </Form>
    </MotionCard>
  );
};

export default CreateForm;
