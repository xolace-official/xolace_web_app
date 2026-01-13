import type { Metadata } from "next";
import { HealthTipsDetailsPage } from "@/app/(protected)/(health-space)/health-tips/[slug]/details-page";
// import { Frontmatter } from "@/features/health-space/health-tips";
/**
 * Produce metadata for a health-tip detail page using the provided route parameters.
 *
 * @param params - Route parameters (includes `slug`) that can be used to derive page metadata
 * @returns A Metadata object for the page; currently contains an empty `title` and a static `description`
 */

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  //const { slug } = await params;
  // const file = await getHealthTip(slug);
  //
  // if (!file) return {};
  //
  // const { frontmatter } = getFrontmatter<Frontmatter>(file.content);

  return {
    title: "",
    description:
      "Health tips and expert-backed advice to boost your wellness and mental health—trusted by millions worldwide.",
  };
}

interface Props {
  params: Promise<{ slug: string }>;
}

/**
 * Render the health tips detail page for a given slug.
 *
 * @param params - A promise that resolves to an object with a `slug` string used to identify which tip to display.
 * @returns The React element that renders the HealthTipsDetailsPage for the provided `slug`.
 */
export default async function Page({ params }: Props) {
  const { slug } = await params;

  return <HealthTipsDetailsPage slug={slug} />;
}