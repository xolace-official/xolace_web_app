"use client";

import { SearchX } from "lucide-react";
import { debounce } from "nuqs";
import { useTransition } from "react";
import { EmptyContent } from "@/components/app/empty-content";
import { useFiltersServer } from "@/components/shared/search-params";
import { Button } from "@/components/ui/button";
import { DiscoveryCard } from "@/features/campfires/discovery/discovery-card";
import { DiscoveryFiltering } from "@/features/campfires/discovery/discovery-filtering";
import { DISCOVERY_DUMMY } from "@/features/campfires/discovery/index";

export const CampfireDiscoveryList = () => {
  const [isPending, startTransition] = useTransition();
  const [{ query, realm, lane }, setSearchParams] = useFiltersServer({
    limitUrlUpdates: debounce(250),
    shallow: false,
  });

  // Filter the data based on the search params
  let filteredData = DISCOVERY_DUMMY;

  filteredData = filteredData.filter((item) => {
    const matchesRealm =
      !realm || realm === "all" || item.interaction_style === realm;
    const matchesQuery =
      !query ||
      item.name?.toLowerCase().includes(query.toLowerCase()) ||
      item.interaction_style?.toLowerCase().includes(query.toLowerCase()) ||
      item.member_count?.toString().includes(query.toLowerCase());

    const matchesLane = lane; //lane implementation will be done later

    return matchesRealm && matchesQuery;
  });

  const handleResetFiltering = () => {
    startTransition(async () => {
      await setSearchParams({
        query: "",
        realm: realm,
        lane: "",
      });
    });
  };

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
