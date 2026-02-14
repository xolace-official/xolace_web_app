import type { Metadata } from "next/types";
import ResetPasswordPage from "./reset-password";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Set a new password for your account.",
};

export default function Page() {
  return <ResetPasswordPage />;
}
