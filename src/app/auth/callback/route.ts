import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const DEFAULT_REDIRECT = "/feed";

function sanitizeRedirectPath(value: string): string {
  if (
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("://") ||
    value.includes("@") ||
    value.includes(":")
  ) {
    return DEFAULT_REDIRECT;
  }

  return value;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = sanitizeRedirectPath(
    searchParams.get("next") ?? DEFAULT_REDIRECT,
  );

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(new URL(next, origin));
    }
  }

  const errorMessage = encodeURIComponent(
    "Could not verify your identity. Please try again.",
  );

  return NextResponse.redirect(
    new URL(`/sign-in?error=${errorMessage}`, origin),
  );
}
