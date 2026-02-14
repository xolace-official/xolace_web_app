"use server";

import { createClient } from "@/lib/supabase/server";
import { env } from "@/env/client";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  type SignInActionResult,
  signinSchema,
  type SignUpActionResult,
  signupSchema,
} from "@/validation";
import { type ContactFormState, contactSchema } from "@/validation/landing";

export async function signInAction(data: {
  email: string;
  password: string;
}): Promise<SignInActionResult> {
  const parsed = signinSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid credentials. Please check your inputs.",
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { success: false, message: "Invalid email or password." };
  }

  return { success: true, message: "Signed in successfully." };
}

export async function signUpAction(data: {
  username: string;
  email: string;
  password: string;
}): Promise<SignUpActionResult> {
  const parsed = signupSchema.safeParse({ ...data, terms: true });

  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid form data. Please check your inputs.",
    };
  }

  const supabase = await createClient();

  // Pre-check username availability (DB constraint is the real guard)
  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .ilike("username", parsed.data.username)
    .maybeSingle();

  if (existing) {
    return { success: false, message: "Username is already taken." };
  }

  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { username: parsed.data.username },
    },
  });

  if (error) {
    if (error.message.includes("already registered")) {
      return {
        success: false,
        message: "An account with this email already exists.",
      };
    }
    return {
      success: false,
      message: "An error occurred during sign-up. Please try again.",
    };
  }

  return {
    success: true,
    message: "Check your email to verify your account.",
  };
}

export async function signInAnonymouslyAction(): Promise<SignInActionResult> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInAnonymously();

  if (error) {
    return {
      success: false,
      message: "Could not sign in anonymously. Please try again.",
    };
  }

  return { success: true, message: "Signed in anonymously." };
}

export async function verifyOtpAction(data: {
  email: string;
  token: string;
}): Promise<SignInActionResult> {
  if (!data.email || !data.token || data.token.length !== 6) {
    return { success: false, message: "Please enter a valid 6-digit code." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.verifyOtp({
    email: data.email,
    token: data.token,
    type: "signup",
  });

  if (error) {
    return {
      success: false,
      message: "Invalid or expired code. Please try again.",
    };
  }

  return { success: true, message: "Email verified successfully!" };
}

export async function resendOtpAction(data: {
  email: string;
}): Promise<SignInActionResult> {
  if (!data.email) {
    return { success: false, message: "Email is required." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.resend({
    email: data.email,
    type: "signup",
  });

  if (error) {
    return {
      success: false,
      message: "Could not resend code. Please try again later.",
    };
  }

  return { success: true, message: "A new code has been sent to your email." };
}

export async function forgotPasswordAction(data: {
  email: string;
}): Promise<SignInActionResult> {
  const parsed = forgotPasswordSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please enter a valid email address.",
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(
    parsed.data.email,
    {
      redirectTo: `${env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/reset-password`,
    },
  );

  if (error) {
    return {
      success: false,
      message: "Could not send reset link. Please try again later.",
    };
  }

  // Always return success to prevent email enumeration
  return {
    success: true,
    message:
      "If an account exists with that email, you'll receive a password reset link.",
  };
}

export async function resetPasswordAction(data: {
  password: string;
  confirmPassword: string;
}): Promise<SignInActionResult> {
  const parsed = resetPasswordSchema.safeParse(data);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message;
    return {
      success: false,
      message: firstError || "Please check your inputs.",
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return {
      success: false,
      message: "Could not update password. Please try again.",
    };
  }

  return {
    success: true,
    message: "Password updated successfully!",
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
