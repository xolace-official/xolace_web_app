"use server";

import { type SigninFormState, type SignupFormState, signinSchema, signupSchema } from "@/validation";

export async function signinFormAction(
  _prevState: SigninFormState,
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

export async function signupFormAction(
  _prevState: SignupFormState,
  formData: FormData,
) {
  const values = {
    username: formData.get("username") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const result = signupSchema.safeParse(values);

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
      username: "",
      email: "",
      password: "",
    },
    errors: null,
    success: true,
  };
}
