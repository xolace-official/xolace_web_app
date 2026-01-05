import { z } from "zod";

export const contactSchema = z.object({
  fullName: z.string().min(2, { error: "Full name is required" }),
  email: z.email(),
  description: z
    .string()
    .min(10, { error: "Description must be at least 10 characters long." }),
});

export type ContactFormState = {
  values?: z.infer<typeof contactSchema>;
  errors: null | Partial<Record<keyof z.infer<typeof contactSchema>, string[]>>;
  success: boolean;
};
