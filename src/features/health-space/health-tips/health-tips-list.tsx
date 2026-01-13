"use client";

import { Filter, Search, SearchX } from "lucide-react";
import { useRouter } from "next/navigation";
import { debounce } from "nuqs";
import { useState, useTransition } from "react";
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
import { HealthTipCard } from "@/features/health-space/health-tips/health-tip-card";
import { useHealthTipsFiltersServer } from "@/features/health-space/health-tips/health-tips-filter";
import {
  HEALTH_TIPS_BASE_URL,
  healthArticles,
} from "@/features/health-space/health-tips/index";

export const HealthTipsList = () => {
  const [isPending, startTransition] = useTransition();
  const [{ query, category, sensitivity }, setSearchParams] =
    useHealthTipsFiltersServer({
      startTransition,
    });
  const [showFilters, setShowFilters] = useState(false);

  const router = useRouter();

  // Get unique categories
  const categories = Array.from(
    new Set(healthArticles.map((article) => article.category.key)),
  );

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

  // Filter articles using URL parameters
  const filteredArticles = healthArticles.filter((article) => {
    const matchesSearch =
      query === "" ||
      article.title.toLowerCase().includes(query.toLowerCase()) ||
      article.excerpt?.toLowerCase().includes(query.toLowerCase());

    const matchesCategory =
      category === "all" || article.category.key === category;

    const matchesSensitivity =
      sensitivity === "all" || article.sensitive_level === sensitivity;

    return matchesSearch && matchesCategory && matchesSensitivity;
  });

  const handleClearFilters = () => {
    startTransition(async () => {
      await setSearchParams({
        query: "",
        category: "all",
        sensitivity: "all",
      });
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 md:gap-4 sticky z-50 top-0 bg-background">
        <div>
          {!showFilters || !(category || sensitivity) ? (
            // Search View
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
            // Filters View
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
                        <SelectItem key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
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

        {/* Results Count */}
        <div className="text-sm text-muted-foreground py-1">
          Showing {filteredArticles.length} of {healthArticles.length} articles
          {isPending && <span className="ml-2">(updating...)</span>}
        </div>
      </div>

      {/* Articles Grid */}
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
