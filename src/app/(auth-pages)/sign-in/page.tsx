import type { Metadata } from "next/types";
import SignInPage from "./sign-in";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to access a supportive community offering mental health resources, expert advice, and a safe space to share your experiences.",
};

export default function Page() {
  return <SignInPage />;
}
