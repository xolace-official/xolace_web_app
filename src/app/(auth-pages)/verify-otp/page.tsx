import type { Metadata } from "next/types";
import VerifyOtpPage from "./verify-otp";

export const metadata: Metadata = {
  title: "Verify Email",
  description:
    "Enter the verification code sent to your email to complete your sign-up.",
};

export default function Page() {
  return <VerifyOtpPage />;
}
