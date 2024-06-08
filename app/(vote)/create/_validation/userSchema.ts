import { z } from "zod";

export const userSchema = z.object({
  alias: z
    .string()
    .min(1, "Alias cannot be empty")
    .transform((val) => val.trim())
    .refine((val) => val.length > 0, "Alias cannot be empty"),
});
