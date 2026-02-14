import { z } from "zod";

export type SigninFormState = {
  values?: z.infer<typeof signinSchema>;
  errors: null | Partial<Record<keyof z.infer<typeof signinSchema>, string[]>>;
  success: boolean;
};

export type ForgotPasswordFormState = {
  values?: z.infer<typeof forgotPasswordSchema>;
  errors: null | Partial<
    Record<keyof z.infer<typeof forgotPasswordSchema>, string[]>
  >;
  success: boolean;
};

export type SignupFormState = {
  values?: Omit<z.infer<typeof signupSchema>, "terms">;
  errors: null | Partial<Record<keyof z.infer<typeof signupSchema>, string[]>>;
  success: boolean;
  message?: string;
};

export type SignUpActionResult = {
  success: boolean;
  message: string;
};

export type SignInActionResult = {
  success: boolean;
  message: string;
};

export const signinSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(8, { error: "Password must be at least 8 characters long." })
    .regex(/[A-Z]/, { error: "Must contain at least one uppercase letter." })
    .regex(/[0-9]/, { error: "Must contain at least one number." }),
});

export const signupSchema = z.object({
  username: z
    .string()
    .min(3, { error: "Username must be at least 3 characters." })
    .max(30, { error: "Username must be at most 30 characters." })
    .regex(/^[a-zA-Z0-9_-]+$/, {
      error: "Only letters, numbers, underscores, and hyphens allowed.",
    }),
  email: z.email(),
  password: z
    .string()
    .min(8, { error: "Must be at least 8 characters." })
    .regex(/[A-Z]/, { error: "Must contain at least one uppercase letter." })
    .regex(/[0-9]/, { error: "Must contain at least one number." }),
  terms: z.literal(true, {
    error: "You must agree to the terms to continue.",
  }),
});

export const forgotPasswordSchema = z.object({
  email: z.email(),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { error: "Must be at least 8 characters." })
      .regex(/[A-Z]/, { error: "Must contain at least one uppercase letter." })
      .regex(/[0-9]/, { error: "Must contain at least one number." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });
