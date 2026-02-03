import React from "react";
import type { Metadata } from "next";
import { GuidePage } from "@/app/(mod-pages)/c/[slug]/mod/guide/guide-page";

export const metadata: Metadata = {
  title: "Guide",
  description: "Manage your campfire guide",
};

interface Props {
  params: Promise<{ slug: string }>;
}

const Page = async ({ params }: Props) => {
  const { slug } = await params;

  return <GuidePage guide={slug} />;
};

export default Page;
