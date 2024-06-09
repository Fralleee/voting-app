import { VoteOption } from "@/types/voteTypes";

export const validateDuplicateOptions = (options: VoteOption[]) => {
  const duplicates = new Set();
  const duplicateOptions = options.reduce((acc, option) => {
    if (duplicates.has(option.value.toLowerCase())) {
      acc.push(option);
    } else {
      duplicates.add(option.value.toLowerCase());
    }
    return acc;
  }, [] as VoteOption[]);

  const hasDuplicates = duplicateOptions.length > 0;

  console.log(duplicateOptions);

  return {
    hasDuplicates,
    duplicateOptions,
  };
};
