"use client";
import { GlimpseFiltering } from "@/features/health-space/glimpse/glimpse-filtering";

import { GlimpseCard } from "@/features/health-space/glimpse/glimpse-card";
import { dummyGlimpses } from ".";
import { useGlimpseFiltersServer } from "@/features/health-space/glimpse/glimpse-filter";
import { useTransition } from "react";
import { debounce } from "nuqs";
import { EmptyContent } from "@/components/app/empty-content";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export const GlimpseListings = () => {
  const [{ query, tab }, setSearchParams] = useGlimpseFiltersServer({
    limitUrlUpdates: debounce(250),
    shallow: false,
  });
  const [isPending, startTransition] = useTransition();

  // Filter the data based on the search params
  let filteredData = dummyGlimpses.data;

  filteredData = filteredData.filter((item) => {
    const matchesQuery =
      !query ||
      item.title?.toLowerCase().includes(query.toLowerCase()) ||
      item.description?.toLowerCase().includes(query.toLowerCase()) ||
      item.author_display_name?.toString().includes(query.toLowerCase()) ||
      item.tags?.toString().includes(query.toLowerCase());

    return matchesQuery;
  });

  const handleResetFiltering = () => {
    startTransition(async () => {
      await setSearchParams({
        query: "",
        tab: "",
      });
    });
  };

  return (
    <div className="w-full flex flex-col gap-4 md:gap-8">
      <GlimpseFiltering />

      {/* Stories Display */}
      {filteredData.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredData.map((glimpse) => (
              <GlimpseCard key={glimpse.id} glimpse={glimpse} />
            ))}
          </div>
          {/* Pagination Info (Optional) */}
          {dummyGlimpses.meta.hasNextPage && (
            <div className="text-center text-sm text-muted-foreground">
              Showing {dummyGlimpses.data.length} of{" "}
              {dummyGlimpses.meta.totalCount} stories
            </div>
          )}
        </>
      ) : (
        <div className="col-span-1 md:col-span-3 lg:col-span-3 xl:col-span-4">
          <EmptyContent
            title={"No Glimpse Here Yet"}
            description={
              "We couldn't find any glimpse matching what you're looking for. Try adjusting your filters or explore different realms."
            }
            icon={<SearchX className="w-12 h-12 text-muted-foreground" />}
            actions={
              <div>
                <Button
                  onClick={handleResetFiltering}
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
