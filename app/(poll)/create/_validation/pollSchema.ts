import { z } from "zod";
import { optionSchema } from "./optionSchema";

const baseSchema = z.object({
  allowMultiChoice: z.boolean().optional(),
  options: z.array(optionSchema),
  optionErrors: z.any().optional(),
});

export const pollSchema = baseSchema.extend({
  topic: z.string().min(2, { message: "You need to enter a topic." }),
  blindVoting: z.boolean().optional(),
  allowChoiceCreation: z.boolean().optional(),
});

export const storypointsSchema = baseSchema.extend({});
