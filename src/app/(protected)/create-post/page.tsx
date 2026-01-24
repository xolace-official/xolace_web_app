import type { Metadata } from "next";
import { CreatePostPage } from "./create-post-page";

export const metadata: Metadata = {
  title: "Create Post",
  description:
    "Create and share your story with a caring community offering support, advice, and encouragement for mental wellness and personal growth.",
};

export default function CreatePost() {
  return <CreatePostPage />;
}
