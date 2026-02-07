import type { Metadata } from "next";
import { Suspense } from "react";
import { SettingsPage } from "@/app/(protected)/(mod-pages)/c/[slug]/mod/settings/settings-page";
import SettingsTabSkeleton from "@/features/mods/features/settings/settings-tab-skeleton";

export const metadata: Metadata = {
  title: "General Settings • Mod Tools",
  description: "Manage campfire general settings",
};

interface Props {
  params: Promise<{ slug: string }>;
}

const GeneralSettingsPage = async ({ params }: Props) => {
  const { slug } = await params;

  return (
    <Suspense fallback={<SettingsTabSkeleton />}>
      <SettingsPage settings={slug} />
    </Suspense>
  );
};

export default GeneralSettingsPage;
