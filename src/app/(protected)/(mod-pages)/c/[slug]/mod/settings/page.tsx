import type { Metadata } from "next";
import { SettingsPage } from "@/app/(protected)/(mod-pages)/c/[slug]/mod/settings/settings-page";

export const metadata: Metadata = {
  title: "General Settings • Mod Tools",
  description: "Manage campfire general settings",
};

// get slug params
interface Props {
  params: Promise<{ slug: string }>;
}

const GeneralSettingsPage = async ({ params }: Props) => {
  const { slug } = await params;

  return <SettingsPage settings={slug} />;
};

export default GeneralSettingsPage;
