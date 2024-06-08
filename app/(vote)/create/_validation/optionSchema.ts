import { z } from "zod";

export const optionSchema = z.object({
  value: z
    .string()
    .optional()
    .transform((val) => val?.trim()),
});

export const newOptionSchema = z.object({
  value: z
    .string()
    .min(1, "Option cannot be empty")
    .transform((val) => val.trim())
    .refine((val) => val.length > 0, "Option cannot be empty"),
});
