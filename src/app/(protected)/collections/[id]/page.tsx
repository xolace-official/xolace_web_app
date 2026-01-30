import type { Metadata } from "next";
import { CollectionDetailPage } from "./collection-detail-page";

export const metadata: Metadata = {
  title: "Collection",
  description: "View items in your collection",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  // const { id } = await params;
  return <CollectionDetailPage params={params} />;
}
