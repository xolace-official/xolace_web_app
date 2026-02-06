import type { Metadata } from "next";
import { ModeratorsPage } from "./moderators-page";

export const metadata: Metadata = {
  title: "Moderator • Mod Tools",
  description: "Discover moderator tool for managing their campfire",
};

interface Props {
  params: Promise<{ slug: string }>;
}

const ModsPage = async ({ params }: Props) => {
  const { slug } = await params;

  return <ModeratorsPage moderators={slug} />;
};

export default ModsPage;
