import { PollOption } from "@/types/pollTypes";

export const validateDuplicateOptions = (options: PollOption[]) => {
  const duplicates = new Set();
  const duplicateOptions = options.reduce((acc, option) => {
    if (duplicates.has(option.value.toLowerCase())) {
      acc.push(option);
    } else {
      duplicates.add(option.value.toLowerCase());
    }
    return acc;
  }, [] as PollOption[]);

  const hasDuplicates = duplicateOptions.length > 0;

  return {
    hasDuplicates,
    duplicateOptions,
  };
};
