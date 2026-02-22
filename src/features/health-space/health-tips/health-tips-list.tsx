"use client";

import { Filter, Loader2, Search, SearchX } from "lucide-react";
import { useRouter } from "next/navigation";
import { debounce } from "nuqs";
import { useMemo, useRef, useState, useTransition } from "react";
import type { GetApiV1AuthHealthTipCategories200DataItem } from "@/api-client";
import {
  useGetApiV1AuthHealthTip,
  useGetApiV1AuthHealthTipCategories,
} from "@/api-client";
import { EmptyContent } from "@/components/app/empty-content";
import { ParamsSearchBar } from "@/components/shared/params-search-bar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  extractApiDataArray,
  useAuthHeaders,
} from "@/features/campfires/campfire-api-utils";
import { HealthTipCard } from "@/features/health-space/health-tips/health-tip-card";
import { useHealthTipsFiltersServer } from "@/features/health-space/health-tips/health-tips-filter";
import { HEALTH_TIPS_BASE_URL } from "@/features/health-space/health-tips/index";
import { useAppStore } from "@/providers/app-store-provider";

const PAGE_SIZE = "10";

export const HealthTipsList = () => {
  const [isPending, startTransition] = useTransition();
  const [{ query, category, sensitivity }, setSearchParams] =
    useHealthTipsFiltersServer({
      startTransition,
    });
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(0);

  const router = useRouter();
  const session = useAppStore((s) => s.session);
  const authHeaders = useAuthHeaders(session.access_token);

  // Reset page when filters change
  const filterKey = `${category}|${sensitivity}|${query}`;
  const prevFilterKey = useRef(filterKey);
  if (prevFilterKey.current !== filterKey) {
    prevFilterKey.current = filterKey;
    setPage(0);
  }

  // Fetch categories (parallel with feed)
  const categoriesQuery = useGetApiV1AuthHealthTipCategories({
    fetch: authHeaders,
  });
  const categories =
    extractApiDataArray<GetApiV1AuthHealthTipCategories200DataItem>(
      categoriesQuery.data,
    );

  // Fetch health tips feed (server-side category filtering)
  const feedQuery = useGetApiV1AuthHealthTip(
    {
      ...(category && category !== "all" ? { category } : {}),
      page: String(page),
      page_size: PAGE_SIZE,
    },
    { fetch: authHeaders },
  );

  const feedData =
    feedQuery.data?.status === 200 ? feedQuery.data.data : undefined;
  const allItems = feedData?.data ?? [];
  const meta = feedData?.meta;

  // Client-side filter by sensitivity and query (API doesn't support these)
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

  const isLoading = feedQuery.isLoading || categoriesQuery.isLoading;
  const isRefetching = feedQuery.isRefetching && !feedQuery.isLoading;

  const toggleView = () => {
    setShowFilters(!showFilters);

    startTransition(async () => {
      await setSearchParams({
        category: category,
        sensitivity: sensitivity,
        query: "",
      });
    });
  };

  const handleCategoryChange = (value: string) => {
    startTransition(async () => {
      await setSearchParams({
        category: value,
        query: "",
      });
    });
  };

  const handleSensitivityChange = (value: string) => {
    startTransition(async () => {
      await setSearchParams({
        sensitivity: value,
        query: "",
      });
    });
  };

  const handleClearFilters = () => {
    startTransition(async () => {
      await setSearchParams({
        query: "",
        category: "all",
        sensitivity: "all",
      });
    });
  };

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-5 w-48" />
        <div className="grid grid-cols-1 gap-4 md:gap-8">
          <Skeleton className="h-52 w-full rounded-xl" />
          <Skeleton className="h-52 w-full rounded-xl" />
          <Skeleton className="h-52 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 md:gap-4 sticky z-50 top-0 bg-background">
        <div>
          {!showFilters || !(category || sensitivity) ? (
            <div className="relative flex items-center gap-2">
              <ParamsSearchBar
                value={query}
                onChange={(value) => {
                  startTransition(async () => {
                    await setSearchParams(
                      { query: value },
                      {
                        limitUrlUpdates: value ? debounce(250) : undefined,
                      },
                    );
                  });
                }}
                onClear={() => {
                  startTransition(async () => {
                    await setSearchParams({ query: "" });
                  });
                }}
                isLoading={isPending}
              />
              <Button
                variant="destructive"
                size="icon"
                onClick={toggleView}
                className="shrink-0"
              >
                <Filter className="w-5 h-5" />
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-3">
                  <Select
                    value={category}
                    onValueChange={handleCategoryChange}
                    disabled={isPending}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.key} value={cat.key}>
                          {cat.display_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={sensitivity}
                    onValueChange={handleSensitivityChange}
                    disabled={isPending}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="All Sensitivity Levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        All Sensitivity Levels
                      </SelectItem>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="mild">Mild</SelectItem>
                      <SelectItem value="sensitive">Sensitive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={toggleView}
                  className="shrink-0"
                >
                  <Search className="w-5 h-5" />
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="text-sm text-muted-foreground py-1 flex items-center gap-2">
          <span>
            Showing {filteredArticles.length}
            {meta ? ` of ${meta.totalCount}` : ""} articles
          </span>
          {(isPending || isRefetching) && (
            <Loader2 className="h-3 w-3 animate-spin" />
          )}
        </div>
      </div>

      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:gap-8">
          {filteredArticles.map((article) => (
            <HealthTipCard
              key={article.id}
              tip={article}
              onFullArticle={() =>
                router.push(`/${HEALTH_TIPS_BASE_URL}/${article.slug}`)
              }
            />
          ))}

          {meta?.hasNextPage && (
            <div className="flex justify-center py-4">
              <Button
                variant="outline"
                onClick={handleLoadMore}
                disabled={feedQuery.isFetching}
              >
                {feedQuery.isFetching ? (
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
      ) : (
        <div className="col-span-1 md:col-span-3 lg:col-span-3 xl:col-span-4">
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
        </div>
      )}
    </div>
  );
};
