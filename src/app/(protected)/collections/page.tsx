import type { Metadata } from "next";
import { CollectionsPage } from "./collections-page";

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Access your saved stories and curated collections from the community to revisit meaningful experiences and mental health insights anytime.",
};

const Collections = () => {
  return <CollectionsPage />;
};

export default Collections;
