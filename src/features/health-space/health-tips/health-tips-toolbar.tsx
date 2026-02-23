"use client";

import { Filter, Search } from "lucide-react";
import { debounce } from "nuqs";
import { useState, useTransition } from "react";
import type { GetApiV1AuthHealthTipCategories200DataItem } from "@/api-client";
import { useGetApiV1AuthHealthTipCategories } from "@/api-client";
import { ParamsSearchBar } from "@/components/shared/params-search-bar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  extractApiDataArray,
  useAuthHeaders,
} from "@/features/campfires/campfire-api-utils";
import { useHealthTipsFiltersServer } from "@/features/health-space/health-tips/health-tips-filter";
import { useAppStore } from "@/providers/app-store-provider";

export const HealthTipsToolbar = () => {
  const [isPending, startTransition] = useTransition();
  const [{ query, category, sensitivity }, setSearchParams] =
    useHealthTipsFiltersServer({ startTransition });
  const [showFilters, setShowFilters] = useState(false);

  const session = useAppStore((s) => s.session);
  const authHeaders = useAuthHeaders(session.access_token);

  const categoriesQuery = useGetApiV1AuthHealthTipCategories({
    fetch: authHeaders,
  });
  const categories =
    extractApiDataArray<GetApiV1AuthHealthTipCategories200DataItem>(
      categoriesQuery.data,
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
      await setSearchParams({ category: value, query: "" });
    });
  };

  const handleSensitivityChange = (value: string) => {
    startTransition(async () => {
      await setSearchParams({ sensitivity: value, query: "" });
    });
  };

  return (
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
                    { limitUrlUpdates: value ? debounce(250) : undefined },
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
                    <SelectItem value="all">All Sensitivity Levels</SelectItem>
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
    </div>
  );
};
