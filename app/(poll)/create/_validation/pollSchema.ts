import { z } from "zod";
import { optionSchema } from "./optionSchema";

export const pollSchema = z.object({
  type: z.enum(["poll", "storypoints"]),
  topic: z.string().min(2, {
    message: "You need to enter a topic.",
  }),
  blindVoting: z.boolean().optional(),
  allowMultiChoice: z.boolean().optional(),
  allowChoiceCreation: z.boolean().optional(),
  options: z.array(optionSchema),
  optionErrors: z.any().optional(),
});
