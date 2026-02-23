"use client";

import { Loader2, SearchX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useTransition } from "react";
import {
  type GetApiV1AuthHealthTip200DataItem,
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

  // Reset infinite query when filters change
  const filterKey = `${category}|${sensitivity}|${query}`;
  const prevFilterKey = useRef(filterKey);
  if (prevFilterKey.current !== filterKey) {
    prevFilterKey.current = filterKey;
  }

  const filteredArticles = useMemo(() => {
    return allItems.filter((article) => {
      const matchesSearch =
        query === "" ||
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.excerpt?.toLowerCase().includes(query.toLowerCase());

      const matchesSensitivity =
        sensitivity === "all" || article.sensitive_level === sensitivity;

      return matchesSearch && matchesSensitivity;
    });
  }, [allItems, query, sensitivity]);

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

  if (filteredArticles.length === 0) {
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
        Showing {filteredArticles.length}
        {totalCount ? ` of ${totalCount}` : ""} articles
      </div>

      {filteredArticles.map((article) => (
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
