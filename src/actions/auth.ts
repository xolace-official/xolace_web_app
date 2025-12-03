"use server";

import { type FormState, signinSchema } from "@/validation";

export async function signinFormAction(
  _prevState: FormState,
  formData: FormData,
) {
  const values = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const result = signinSchema.safeParse(values);

  if (!result.success) {
    return {
      values,
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  // Do something with the values.
  // Call your database or API here.

  return {
    values: {
      email: "",
      password: "",
    },
    errors: null,
    success: true,
  };
}
