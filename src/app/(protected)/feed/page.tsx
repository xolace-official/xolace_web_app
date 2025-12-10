import type { Metadata } from "next/types";
import { FeedPage } from "./feed-page";

export const metadata: Metadata = {
  title: "Feed",
  description:
    "Discover different stories, experiences from real and unique individuals as well as the community",
};

export default function Page() {
  return <FeedPage />;
}
