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
import { VoteOption } from "@/types/vote";
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
import { voteSchema } from "../_validation/voteSchema";
import useIdentity from "@/app/_hooks/useIdentity";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
      delayChildren: 0.2,
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
};

const CreateVoteForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { identifier } = useIdentity();

  const form = useForm<z.infer<typeof voteSchema>>({
    resolver: zodResolver(voteSchema),
    defaultValues: {
      type: "poll",
      allowMultiChoice: false,
      allowChoiceCreation: false,
      description: "",
      options: [{ value: "" }],
    },
  });
  const { errors } = form.formState;

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

  async function onSubmit(values: z.infer<typeof voteSchema>) {
    setIsLoading(true);
    const {
      type,
      description,
      options,
      allowChoiceCreation,
      allowMultiChoice,
    } = values;

    const filteredOptions = options.filter(
      (option) => option.value?.trim() !== "",
    ) as VoteOption[];

    if (filteredOptions.length < 2) {
      form.setError("optionErrors", {
        type: "manual",
        message: "At least two valid options are required.",
      });
      setIsLoading(false);
      return;
    }

    const duplicates = new Set();
    const duplicateOptions = filteredOptions.reduce((acc, option) => {
      if (duplicates.has(option.value)) {
        acc.push(option);
      } else {
        duplicates.add(option.value);
      }
      return acc;
    }, [] as VoteOption[]);

    const hasDuplicates = duplicateOptions.length > 0;
    if (hasDuplicates) {
      form.clearErrors("options");
      for (const option of duplicateOptions) {
        form.setError(`options.${options.indexOf(option)}.value`, {
          type: "manual",
          message: "Value already exists in previous option.",
        });
      }
      setIsLoading(false);
      return;
    }

    const newVoteRef = ref(database, "votes");
    const newVote = await push(newVoteRef, {
      type,
      name: description,
      options: filteredOptions,
      admin: identifier,
      allowMultiChoice,
      allowChoiceCreation,
      status: "open",
    });
    router.push(`/vote/${newVote.key}`);
  }

  const { formType, formDescription } = formSummary(form.getValues());
  console.log(errors);
  return (
    <Form {...form}>
      <motion.form
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="mx-auto flex h-full w-full max-w-[640px] flex-col justify-between rounded-lg border-stone-200 px-4 pt-20 dark:border-slate-800 md:h-auto md:border md:px-8 md:py-12"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-3">
          <motion.div variants={itemVariants}>
            <Accordion
              type="single"
              collapsible
              className="flex flex-col gap-3 rounded-lg border border-input px-4"
            >
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <div className="text-left text-stone-700 dark:text-slate-300">
                    <p>{formType}</p>
                    <p className="text-sm text-stone-600 dark:text-slate-400">
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="What do you want to vote about?"
                      autoComplete="off"
                      className={`h-14 ${errors.description ? "border-red-700 focus-visible:border-input focus-visible:ring-red-700" : ""}`}
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
                        placeholder="Start typing, and new options will be added automatically"
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
          variants={itemVariants}
          className="mx-auto mt-6 flex w-full max-w-64 flex-col justify-end gap-3"
        >
          <LoadingButton loading={isLoading} className="w-full" type="submit">
            Start voting!
          </LoadingButton>
          <Link
            prefetch
            className={buttonVariants({ variant: "outline" })}
            href="/"
          >
            Cancel
          </Link>
        </motion.div>
      </motion.form>
    </Form>
  );
};

export default CreateVoteForm;
