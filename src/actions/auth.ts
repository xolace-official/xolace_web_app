"use server";

import {
  type ForgotPasswordFormState,
  forgotPasswordSchema,
  type SigninFormState,
  type SignupFormState,
  signinSchema,
  signupSchema,
} from "@/validation";
import { type ContactFormState, contactSchema } from "@/validation/landing";

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

export async function forgotPasswordFormAction(
  _prevState: ForgotPasswordFormState,
  formData: FormData,
) {
  const values = {
    email: formData.get("email") as string,
  };

  const result = forgotPasswordSchema.safeParse(values);

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
    },
    errors: null,
    success: true,
  };
}

export async function contactFormAction(
  _prev: ContactFormState,
  formData: FormData,
) {
  const values = {
    fullName: formData.get("fullName") as string,
    email: formData.get("email") as string,
    description: formData.get("description") as string,
  };

  const result = contactSchema.safeParse(values);

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
      fullName: "",
      email: "",
      subject: "",
      description: "",
    },
    errors: null,
    success: true,
  };
}
