"use client";

import { CircleX } from "lucide-react";
import { use } from "react";
import { useGetApiV1AuthHealthTipBySlugSlug } from "@/api-client";
import { PageHeading } from "@/components/shared/layout/page-heading";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthHeaders } from "@/features/campfires/campfire-api-utils";
import { HealthTipFullArticle } from "@/features/health-space/health-tips/health-tip-full-article";
import { useAppStore } from "@/providers/app-store-provider";

const DetailSkeleton = () => (
  <div className="flex flex-col gap-4 px-2 md:px-0">
    <Skeleton className="h-8 w-64" />
    <Skeleton className="h-4 w-48" />
    <Skeleton className="h-64 w-full rounded-xl" />
  </div>
);

export const HealthTipDetailContent = ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = use(params);
  const session = useAppStore((s) => s.session);
  const authHeaders = useAuthHeaders(session.access_token);

  const { data, isLoading, isError, refetch } =
    useGetApiV1AuthHealthTipBySlugSlug(slug, { fetch: authHeaders });

  const article = data?.status === 200 ? data.data : undefined;

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (isError || !article) {
    return (
      <>
        <PageHeading
          title="Article not found"
          className="px-2 md:px-0"
          showBackButton
        />
        <div className="flex flex-col items-center gap-3 py-12 text-muted-foreground">
          <CircleX className="h-6 w-6" />
          <p>Could not load this article.</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeading
        title={article.title}
        className="px-2 md:px-0"
        showBackButton
      />
      <div className="flex flex-col gap-4 px-2 md:px-0">
        <HealthTipFullArticle article={article} />
      </div>
    </>
  );
};
