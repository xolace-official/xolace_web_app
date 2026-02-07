import type { Metadata } from "next";
import { Suspense } from "react";
import { ModeratorsPage } from "./moderators-page";
import ModMemberTabSkeleton from "@/features/mods/features/moderators/ModMemberTabSkeleton";

export const metadata: Metadata = {
  title: "Moderator • Mod Tools",
  description: "Discover moderator tool for managing their campfire",
};

interface Props {
  params: Promise<{ slug: string }>;
}

const ModsPage = async ({ params }: Props) => {
  const { slug } = await params;

  return (
    <Suspense fallback={<ModMemberTabSkeleton />}>
      <ModeratorsPage moderators={slug} />
    </Suspense>
  );
};

export default ModsPage;
