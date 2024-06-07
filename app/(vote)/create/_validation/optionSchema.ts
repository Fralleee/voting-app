import { z } from "zod";

export const optionSchema = z.object({
  value: z.string().optional(),
});

export const newOptionSchema = z.object({
  value: z.string(),
});

export type NewOptionFormData = z.infer<typeof newOptionSchema>;
