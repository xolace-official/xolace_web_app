"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PageContainer } from "@/components/app/page-container";
import { CollectionDetailContent } from "@/features/collections/components/collection-detail-content";

interface CollectionDetailPageProps {
  collectionId?: string;
  params: Promise<{ id: string }>;
}

export function CollectionDetailPage({
  collectionId,
  params,
}: CollectionDetailPageProps) {
  return (
    <PageContainer
      title={
        <Link
          href="/collections"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Collections</span>
        </Link>
      }
      contentClassName="px-2 md:px-0"
    >
      <CollectionDetailContent collectionId={collectionId} params={params} />
    </PageContainer>
  );
}
