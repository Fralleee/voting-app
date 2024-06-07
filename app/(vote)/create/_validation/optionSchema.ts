import { z } from "zod";

export const optionSchema = z.object({
  value: z.string().optional(),
});

export type OptionFormData = z.infer<typeof optionSchema>;
