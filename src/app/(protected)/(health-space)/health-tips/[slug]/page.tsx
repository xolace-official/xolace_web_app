import type { Metadata } from "next";
import { HealthTipsDetailsPage } from "@/app/(protected)/(health-space)/health-tips/[slug]/details-page";

export const metadata: Metadata = {
  title: "Health Tip",
  description:
    "Health tips and expert-backed advice to boost your wellness and mental health—trusted by millions worldwide.",
};

interface Props {
  params: Promise<{ slug: string }>;
}

export default function Page({ params }: Props) {
  return <HealthTipsDetailsPage params={params} />;
}
