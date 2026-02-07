import type { Metadata } from "next";
import { Suspense } from "react";
import { GuidePage } from "@/app/(protected)/(mod-pages)/c/[slug]/mod/guide/guide-page";
import CampfireGuideSkeleton from "@/features/mods/features/guide/guide-skeleton";

export const metadata: Metadata = {
  title: "Guide • Mod Tools",
  description: "Manage your campfire guide",
};

interface Props {
  params: Promise<{ slug: string }>;
}

const Page = async ({ params }: Props) => {
  const { slug } = await params;

  return (
    <Suspense fallback={<CampfireGuideSkeleton />}>
      <GuidePage guide={slug} />
    </Suspense>
  );
};

export default Page;
