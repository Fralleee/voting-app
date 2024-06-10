import { z } from "zod";
import { pollSchema, storypointsSchema } from "../_validation/pollSchema";
import { push, ref } from "firebase/database";
import { database } from "@/lib/firebase";
import { PollOption, PollType } from "@/types/pollTypes";
import { validateDuplicateOptions } from "../_validation/validateDuplicateOptions";
import { UseFormReturn } from "react-hook-form";

export const createPoll = async (
  type: PollType,
  admin: string | undefined,
  form: UseFormReturn<z.infer<typeof pollSchema>>,
  values: z.infer<typeof pollSchema>,
) => {
  const { topic, options, blindVoting, allowChoiceCreation, allowMultiChoice } =
    values;

  const filteredOptions = options.filter((option) => option.value !== "");

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

    return null;
  }

  const { hasDuplicates, duplicateOptions } = validateDuplicateOptions(
    filteredOptions as PollOption[],
  );
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

    return null;
  }

  const newVoteRef = ref(database, "votes");
  const newVote = await push(newVoteRef, {
    type,
    topic,
    options: filteredOptions,
    admin,
    blindVoting,
    allowMultiChoice,
    allowChoiceCreation,
    status: "open",
  });

  return newVote.key;
};

export const createStorypointsPoll = async (
  type: PollType,
  admin: string | undefined,
  values: z.infer<typeof storypointsSchema>,
) => {
  const { allowMultiChoice } = values;

  const newVoteRef = ref(database, "votes");
  const newVote = await push(newVoteRef, {
    type,
    topic: "Story Points",
    options: ["0", "1", "2", "3", "5", "8", "13", "21", "?"].map((val) => ({
      value: val,
    })),
    admin,
    blindVoting: true,
    allowMultiChoice,
    allowChoiceCreation: false,
    status: "open",
  });

  return newVote.key;
};
