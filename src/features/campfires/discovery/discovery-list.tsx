"use client";

import { SearchX } from "lucide-react";
import { debounce } from "nuqs";
import { useCallback, useMemo, useTransition } from "react";
import { EmptyContent } from "@/components/app/empty-content";
import { useFiltersServer } from "@/components/shared/search-params";
import { Button } from "@/components/ui/button";
import { DiscoveryCard } from "@/features/campfires/discovery/discovery-card";
import { DiscoveryFiltering } from "@/features/campfires/discovery/discovery-filtering";
import { dummy_campfires } from "@/features/campfires";

export const CampfireDiscoveryList = () => {
  const [isPending, startTransition] = useTransition();
  const [{ query, realm }, setSearchParams] = useFiltersServer({
    limitUrlUpdates: debounce(250),
    shallow: false,
  });

  // Filter the data based on the search params
  const filteredData = useMemo(() => {
    return dummy_campfires.filter((item) => {
      // Check realm filter first (cheapest check)
      if (realm && realm !== "all" && item.interaction_style !== realm) {
        return false;
      }

      // Check query filter if present
      if (query) {
        const q = query.toLowerCase();
        return (
          item.name?.toLowerCase().includes(q) ||
          item.interaction_style?.toLowerCase().includes(q) ||
          item.member_count?.toString().includes(q)
        );
      }

      return true;
    });
  }, [query, realm]);

  const handleResetFiltering = useCallback(() => {
    startTransition(async () => {
      await setSearchParams({
        query: "",
        realm: realm,
        lane: "",
      });
    });
  }, [realm, setSearchParams]);

  return (
    <div className={"w-full grid grid-cols-1 items-start gap-4"}>
      <DiscoveryFiltering />
      <div
        className={
          "grid grid-cols-1 items-center md:grid md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8"
        }
      >
        {filteredData.length > 0 ? (
          filteredData.map((discovery) => (
            <DiscoveryCard key={discovery.id} discovery={discovery} />
          ))
        ) : (
          <div className="col-span-1 md:col-span-3 lg:col-span-3 xl:col-span-4">
            <EmptyContent
              title={"No Campfires Here Yet"}
              description={
                "We couldn't find any campfires matching what you're looking for. Try adjusting your filters or explore different realms."
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
    </div>
  );
};
