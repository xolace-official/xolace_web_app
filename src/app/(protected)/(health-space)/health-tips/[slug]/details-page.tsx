"use client";

import { Loader2 } from "lucide-react";
import { useGetApiV1AuthHealthTipBySlugSlug } from "@/api-client";
import { PageContainer } from "@/components/app/page-container";
import { PageHeading } from "@/components/shared/layout/page-heading";
import { ThemeSwitcher } from "@/components/shared/theme-switcher";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthHeaders } from "@/features/campfires/campfire-api-utils";
import { HealthTipFullArticle } from "@/features/health-space/health-tips/health-tip-full-article";
import { useAppStore } from "@/providers/app-store-provider";

export const HealthTipsDetailsPage = ({ slug }: { slug: string }) => {
  const session = useAppStore((s) => s.session);
  const authHeaders = useAuthHeaders(session.access_token);

  const { data, isLoading, isError } = useGetApiV1AuthHealthTipBySlugSlug(
    slug,
    { fetch: authHeaders },
  );

  const article = data?.status === 200 ? data.data : undefined;

  if (isLoading) {
    return (
      <PageContainer
        title="Loading..."
        actions={<ThemeSwitcher key={"theme-switcher"} />}
      >
        <div className="flex flex-col gap-4 px-2 md:px-0">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </PageContainer>
    );
  }

  if (isError || !article) {
    return (
      <PageContainer
        title="Error"
        actions={<ThemeSwitcher key={"theme-switcher"} />}
      >
        <PageHeading
          title="Article not found"
          className="px-2 md:px-0"
          showBackButton
        />
        <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
          <Loader2 className="h-6 w-6" />
          <p>Could not load this article. Please try again later.</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={article.title}
      actions={<ThemeSwitcher key={"theme-switcher"} />}
    >
      <PageHeading
        title={article.title}
        className="px-2 md:px-0"
        showBackButton
      />
      <div className="flex flex-col gap-4 px-2 md:px-0">
        <HealthTipFullArticle article={article} />
      </div>
    </PageContainer>
  );
};
