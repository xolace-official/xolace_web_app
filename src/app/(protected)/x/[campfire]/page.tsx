import type { Metadata } from "next";
import DetailsPage from "@/app/(protected)/x/[campfire]/details-page";

interface Props {
  params: Promise<{ campfire: string }>;
}

const SEPARATOR_REGEX = /[-_]/g;

function toPascalCase(str: string): string {
  return str
    .replace(SEPARATOR_REGEX, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { campfire } = await params;

  const pascalName = toPascalCase(campfire);

  return {
    title: `x${pascalName}`,
    description: `Join the ${pascalName} campfire — connect, share, and grow with like-minded people in a supportive circle.`,
  };
}

const Page = async ({ params }: Props) => {
  const { campfire } = await params;

  return <DetailsPage campfireId={campfire} />;
};
export default Page;
