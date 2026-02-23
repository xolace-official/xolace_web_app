import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { HealthTipsDetailsPage } from "@/app/(protected)/(health-space)/health-tips/[slug]/details-page";

interface Props {
  params: Promise<{ slug: string }>;
}

/**
 * Render the health tip details page for the provided route parameters.
 *
 * @param params - Route parameters (includes `slug`) forwarded to HealthTipsDetailsPage
 * @returns The JSX element rendering the HealthTipsDetailsPage with the given params
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("health_tips")
    .select("title, excerpt")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!data) {
    return {
      title: "Health Tip",
      description:
        "Health tips and expert-backed advice to boost your wellness and mental health.",
    };
  }

  return {
    title: data.title,
    description:
      data.excerpt ??
      "Health tips and expert-backed advice to boost your wellness and mental health.",
    openGraph: {
      title: data.title,
      description:
        data.excerpt ??
        "Health tips and expert-backed advice to boost your wellness and mental health.",
    },
  };
}

export default function Page({ params }: Props) {
  return <HealthTipsDetailsPage params={params} />;
}