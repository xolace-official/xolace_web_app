import type { Metadata } from "next";
import { ModeratorsPage } from "@/app/(mod-pages)/c/[slug]/mod/moderators/moderators-page";

export const metadata: Metadata = {
  title: "Moderator",
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
