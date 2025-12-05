import type { Metadata } from "next/types";
import SignUpPage from "./sign-up";

export const metadata: Metadata = {
  title: "Sign-up",
  description:
    "Create an account to access a supportive community offering mental health resources, expert advice, and a safe space to share your experiences.",
};

const Signup = () => {
  return <SignUpPage />;
};

export default Signup;
