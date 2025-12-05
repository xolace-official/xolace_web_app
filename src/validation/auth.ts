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
  values?: z.infer<typeof signupSchema>;
  errors: null | Partial<Record<keyof z.infer<typeof signupSchema>, string[]>>;
  success: boolean;
};

export const signinSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(8, { error: "Password must be at least 8 characters long." })
    .refine(
      (value) => {
        const hasUppercase = /[A-Z]/.test(value);
        const hasNumber = /[0-9]/.test(value);
        if (!hasUppercase || !hasNumber) {
          return false;
        }
        return true;
      },
      {
        error:
          "Password must contain at least one uppercase letter and one number.",
      },
    ),
});

export const signupSchema = z.object({
  username: z.string().min(2, {
    error: "Username must be at least 2 characters.",
  }),
  email: z.email(),
  password: z
    .string()
    .min(8, { error: "Password must be at least 8 characters long." })
    .refine(
      (value) => {
        const hasUppercase = /[A-Z]/.test(value);
        const hasNumber = /[0-9]/.test(value);
        if (!hasUppercase || !hasNumber) {
          return false;
        }
        return true;
      },
      {
        error:
          "Password must contain at least one uppercase letter and one number.",
      },
    ),
});

export const forgotPasswordSchema = z.object({
  email: z.email(),
});
