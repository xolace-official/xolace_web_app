import type { Metadata } from "next";
import { GlimpseVideo } from "@/app/(protected)/(health-space)/glimpse/[videoId]/glimpse-video";
import { HealthTipsDetailsPage } from "@/app/(protected)/(health-space)/health-tips/[slug]/details-page";

export const metadata: Metadata = {
  title: "Glimpse",
  description:
    "Mentor-led video reflections offering perspective, support, and guidance.",
};

interface Props {
  params: Promise<{ videoId: string }>;
}

export default async function VideoDetailsPage({ params }: Props) {
  const { videoId } = await params;

  return <GlimpseVideo videoId={videoId} />;
}
