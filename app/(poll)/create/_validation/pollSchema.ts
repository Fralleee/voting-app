import { z } from "zod";
import { optionSchema } from "./optionSchema";

export const pollSchema = z
  .object({
    type: z.enum(["poll", "storypoints"]),
    topic: z.string().optional(),
    blindVoting: z.boolean().optional(),
    allowMultiChoice: z.boolean().optional(),
    allowChoiceCreation: z.boolean().optional(),
    options: z.array(optionSchema),
    optionErrors: z.any().optional(),
  })
  .refine(
    (data) => {
      const hasTopicValue = data.topic && data.topic.trim() !== "";
      return data.type === "storypoints" || hasTopicValue;
    },
    {
      message: "You need to enter a topic.",
      path: ["topic"],
    },
  );
