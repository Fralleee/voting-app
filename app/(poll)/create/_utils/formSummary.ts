import { z } from "zod";
import { pollSchema, storypointsSchema } from "../_validation/pollSchema";
import { PollType } from "@/types/pollTypes";

export const formSummary = (
  type: PollType,
  formValues: z.infer<typeof pollSchema> | z.infer<typeof storypointsSchema>,
) => {
  const isPoll = type === "poll";
  const isPollForm = formValues as z.infer<typeof pollSchema>;
  const formType = `${formValues.allowMultiChoice ? "Multi-choice" : "Single-choice"} ${isPoll ? "poll" : "story points session"}`;
  const formDescription: string[] = [];

  if (isPoll) {
    if (isPollForm.blindVoting) {
      formDescription.push("Votes are hidden until the poll is closed");
    }
    if (isPollForm.allowChoiceCreation) {
      formDescription.push("Users can create options");
    }
  }

  return { formType, formDescription };
};
