"use client";

import { Loader2, SearchX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useTransition } from "react";
import {
  type GetApiV1AuthHealthTip200DataItem,
  type GetApiV1AuthHealthTipSensitivity,
  getApiV1AuthHealthTip,
  getGetApiV1AuthHealthTipInfiniteQueryKey,
  useGetApiV1AuthHealthTipInfinite,
} from "@/api-client";
import { EmptyContent } from "@/components/app/empty-content";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthHeaders } from "@/features/campfires/campfire-api-utils";
import { HealthTipCard } from "@/features/health-space/health-tips/health-tip-card";
import { useHealthTipsFiltersServer } from "@/features/health-space/health-tips/health-tips-filter";
import { HEALTH_TIPS_BASE_URL } from "@/features/health-space/health-tips/index";
import { useAppStore } from "@/providers/app-store-provider";

const PAGE_SIZE = "10";

export const HealthTipsArticles = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [{ query, category, sensitivity }, setSearchParams] =
    useHealthTipsFiltersServer({ startTransition });

  const session = useAppStore((s) => s.session);
  const authHeaders = useAuthHeaders(session.access_token);

  const filterParams = {
    ...(category && category !== "all" ? { category } : {}),
    ...(sensitivity && sensitivity !== "all"
      ? { sensitivity: sensitivity as GetApiV1AuthHealthTipSensitivity }
      : {}),
    ...(query ? { query } : {}),
    page_size: PAGE_SIZE,
  };

  const feedQuery = useGetApiV1AuthHealthTipInfinite(filterParams, {
    query: {
      queryKey: getGetApiV1AuthHealthTipInfiniteQueryKey(filterParams),
      queryFn: ({ signal, pageParam }) =>
        getApiV1AuthHealthTip(
          { ...filterParams, page: String(pageParam) },
          { signal, ...authHeaders },
        ),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        if (lastPage.status !== 200) return undefined;
        const meta = lastPage.data.meta;
        return meta.hasNextPage ? meta.currentPage + 1 : undefined;
      },
    },
    fetch: authHeaders,
  });

  // Flatten all pages into a single array
  const { allItems, totalCount } = useMemo(() => {
    const pages = feedQuery.data?.pages ?? [];
    const items: GetApiV1AuthHealthTip200DataItem[] = [];
    let count = 0;
    for (const page of pages) {
      if (page.status === 200) {
        items.push(...page.data.data);
        count = page.data.meta.totalCount;
      }
    }
    return { allItems: items, totalCount: count };
  }, [feedQuery.data?.pages]);

  const handleClearFilters = () => {
    startTransition(async () => {
      await setSearchParams({
        query: "",
        category: "all",
        sensitivity: "all",
      });
    });
  };

  if (feedQuery.isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-52 w-full rounded-xl" />
        <Skeleton className="h-52 w-full rounded-xl" />
        <Skeleton className="h-52 w-full rounded-xl" />
      </div>
    );
  }

  if (allItems.length === 0) {
    return (
      <EmptyContent
        title={"No article found"}
        description={
          "We couldn't find any articles matching your criteria. Try adjusting your search or filters."
        }
        icon={<SearchX className="w-12 h-12 text-muted-foreground" />}
        actions={
          <div>
            <Button
              onClick={handleClearFilters}
              disabled={isPending}
              variant={"outlineDestructive"}
            >
              {isPending ? "Resetting..." : "Reset Filters"}
            </Button>
          </div>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:gap-8">
      <div className="text-sm text-muted-foreground">
        Showing {allItems.length}
        {totalCount ? ` of ${totalCount}` : ""} articles
      </div>

      {allItems.map((article) => (
        <HealthTipCard
          key={article.id}
          tip={article}
          onFullArticle={() =>
            router.push(`/${HEALTH_TIPS_BASE_URL}/${article.slug}`)
          }
        />
      ))}

      {feedQuery.hasNextPage && (
        <div className="flex justify-center py-4">
          <Button
            variant="outline"
            onClick={() => feedQuery.fetchNextPage()}
            disabled={feedQuery.isFetchingNextPage}
          >
            {feedQuery.isFetchingNextPage ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load more"
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
