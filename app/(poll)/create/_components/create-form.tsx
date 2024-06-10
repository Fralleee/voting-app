"use client";

import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { useRouter } from "next/navigation";
import { database } from "@/lib/firebase";
import { ref, push } from "firebase/database";
import { buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { PollOption } from "@/types/pollTypes";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { formSummary } from "../_utils/formSummary";
import { motion } from "framer-motion";
import { LoadingButton } from "@/components/ui/loading-button";
import { useEffect, useState } from "react";
import { pollSchema } from "../_validation/pollSchema";
import {
  containerVariants,
  itemVariants,
  buttonVariant,
} from "@/app/_animations/variants";
import { MotionCard } from "@/components/ui/card";
import { validateDuplicateOptions } from "../_validation/validateDuplicateOptions";
import { useWarnIfUnsavedChanges } from "@/app/_hooks/useWarnIfUnsavedChanges";
import { useUser } from "@/app/_hooks/useUser";

const CreateForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user } = useUser();

  const form = useForm<z.infer<typeof pollSchema>>({
    resolver: zodResolver(pollSchema),
    defaultValues: {
      type: "poll",
      allowMultiChoice: false,
      allowChoiceCreation: false,
      topic: "",
      options: [{ value: "" }],
    },
  });
  const { errors, dirtyFields } = form.formState;
  // Using dirtyFields to check if there are any unsaved changes rather than isDirty since it's more accurate
  const hasAnyDirtyFields = Object.keys(dirtyFields).length > 0;
  useWarnIfUnsavedChanges(hasAnyDirtyFields);

  const { fields, append } = useFieldArray({
    control: form.control,
    name: "options",
  });

  const options = useWatch({ control: form.control, name: "options" });
  useEffect(() => {
    if (options.length > 0 && options[options.length - 1]?.value !== "") {
      append({ value: "" }, { shouldFocus: false });
    }
  }, [options, append]);

  async function onSubmit(values: z.infer<typeof pollSchema>) {
    setIsLoading(true);
    const { type, topic, options, allowChoiceCreation, allowMultiChoice } =
      values;

    const filteredOptions = options.filter(
      (option) => option.value !== "",
    ) as PollOption[];

    if (filteredOptions.length < 2) {
      form.setError("optionErrors", {
        type: "manual",
        message: "At least two valid options are required.",
      });

      let firstError = false;
      for (const option of options) {
        if (option.value === "") {
          const index = options.indexOf(option);
          form.setError(`options.${index}.value`, {
            type: "manual",
            message: "Option cannot be empty.",
          });

          if (!firstError) {
            form.setFocus(`options.${index}.value`);
            firstError = true;
          }
        }
      }

      setIsLoading(false);
      return;
    }

    const { hasDuplicates, duplicateOptions } =
      validateDuplicateOptions(filteredOptions);
    if (hasDuplicates) {
      form.clearErrors("options");

      for (const option of duplicateOptions) {
        const index = options.indexOf(option);
        form.setError(`options.${index}.value`, {
          type: "manual",
          message: "Value already exists in previous option.",
        });
        form.setFocus(`options.${index}.value`);
      }
      setIsLoading(false);
      return;
    }

    const newVoteRef = ref(database, "votes");
    const newVote = await push(newVoteRef, {
      type,
      topic,
      options: filteredOptions,
      admin: user?.identifier,
      allowMultiChoice,
      allowChoiceCreation,
      status: "open",
    });
    router.push(`/vote/${newVote.key}`);
  }

  const { formType, formDescription } = formSummary(form.getValues());
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
              <Accordion
                type="single"
                collapsible
                className="bg-card-background flex flex-col gap-3 rounded-md border border-input px-4"
              >
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    <div className="flex flex-col items-start justify-center text-left transition-all">
                      <p>{formType}</p>
                      <p className="h-auto max-h-10 text-sm text-muted-foreground transition-all empty:max-h-0">
                        {formDescription.join(",")}
                      </p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between px-1 py-2">
                          <div>
                            <FormLabel className="text-base">Type</FormLabel>
                            <FormDescription>
                              Type of vote to create.
                            </FormDescription>
                          </div>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="max-w-48">
                                <SelectValue placeholder="Select a type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="poll">Poll</SelectItem>
                                <SelectItem value="storypoints" disabled>
                                  Storypoints
                                </SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="allowMultiChoice"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between px-1 py-2">
                          <div>
                            <FormLabel className="text-base">
                              Allow multi-choice
                            </FormLabel>
                            <FormDescription>
                              Let users select multiple options.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="allowChoiceCreation"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between px-1 py-2">
                          <div>
                            <FormLabel className="text-base">
                              Allow users to create options
                            </FormLabel>
                            <FormDescription>
                              Let users create options if nothing fits.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </motion.div>
            <motion.div variants={itemVariants} className="flex flex-col gap-3">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="What should we vote about?"
                        autoComplete="off"
                        className={`h-14 ${errors.topic ? "border-red-700 focus-visible:border-input focus-visible:ring-red-700" : ""}`}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {fields.map((item, index) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name={`options.${index}.value`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder={
                            index === 0 ? "Yes" : index === 1 ? "No" : ""
                          }
                          autoComplete="off"
                          {...field}
                          className={
                            errors.options && errors.options[index]
                              ? "border-red-700 focus-visible:border-input focus-visible:ring-red-700"
                              : ""
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

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
          </div>

          <motion.div
            variants={buttonVariant}
            className="mx-auto my-6 flex w-full max-w-64 flex-col items-center justify-end gap-3"
          >
            <motion.p
              variants={itemVariants}
              className="text-center text-sm text-muted-foreground"
            >
              Start typing, and new options will be added automatically
            </motion.p>
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