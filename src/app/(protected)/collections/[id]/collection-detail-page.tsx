"use client";

import { PageContainer } from "@/components/app/page-container";
import { CollectionDetailContent } from "@/features/collections/components/collection-detail-content";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface CollectionDetailPageProps {
  collectionId: string;
}

export function CollectionDetailPage({
  collectionId,
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
    >
      <CollectionDetailContent collectionId={collectionId} />
    </PageContainer>
  );
}
