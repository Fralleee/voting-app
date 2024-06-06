import { z } from "zod";
import { optionSchema } from "./optionSchema";

export const voteSchema = z.object({
  type: z.enum(["poll", "storypoints"]),
  description: z.string().min(2, {
    message: "You need to enter a vote description.",
  }),
  allowMultiChoice: z.boolean().optional(),
  allowChoiceCreation: z.boolean().optional(),
  options: z.array(optionSchema),
});
