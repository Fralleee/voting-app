import { z } from "zod";

export const optionSchema = z.object({
  value: z.string().min(1, {
    message: "Please enter a valid option.",
  }),
});

export type OptionFormData = z.infer<typeof optionSchema>;
