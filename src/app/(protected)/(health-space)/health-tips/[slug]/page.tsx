import { Frontmatter } from "@/features/health-space/health-tips";
import { Metadata } from "next";
import { getHealthTip } from "@/actions/health-space";
import { HealthTipsDetailsPage } from "@/app/(protected)/(health-space)/health-tips/[slug]/details-page";
import { getFrontmatter } from "next-mdx-remote-client/utils";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
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

export default async function Page({ params }: Props) {
  const { slug } = await params;

  return <HealthTipsDetailsPage slug={slug} />;
}
