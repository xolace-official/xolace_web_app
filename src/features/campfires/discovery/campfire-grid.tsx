"use client";

import { Loader2, SearchX } from "lucide-react";
import { debounce } from "nuqs";
import { useCallback, useTransition } from "react";
import type {
  GetApiV1AuthCampfireDiscovery200,
  GetApiV1AuthCampfireLanes200,
  GetApiV1AuthCampfireRealms200,
} from "@/api-client";
import {
  useGetApiV1AuthCampfireDiscovery,
  useGetApiV1AuthCampfireLanes,
  useGetApiV1AuthCampfireRealms,
} from "@/api-client";
import { EmptyContent } from "@/components/app/empty-content";
import { useFiltersServer } from "@/components/shared/search-params";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DiscoveryCard } from "@/features/campfires/discovery/discovery-card";
import { useAppStore } from "@/providers/app-store-provider";

export const CampfireGrid = () => {
  const [isPending, startTransition] = useTransition();
  const session = useAppStore((s) => s.session);
  const [{ query, realm, lane }, setSearchParams] = useFiltersServer({
    limitUrlUpdates: debounce(250),
  });

  const authHeaders = {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  };

  // Fetch realms to resolve realm key → realm_id (deduplicated via React Query)
  const realmsQuery = useGetApiV1AuthCampfireRealms({
    fetch: authHeaders,
  });

  const realms =
    realmsQuery.data?.status === 200
      ? (realmsQuery.data.data as GetApiV1AuthCampfireRealms200).data
      : [];

  const selectedRealm = realms.find((r) => r.key === realm);

  // Fetch lanes to resolve lane key → lane_id (deduplicated via React Query)
  const lanesQuery = useGetApiV1AuthCampfireLanes(
    { realmId: selectedRealm?.id ?? "" },
    {
      query: { enabled: !!selectedRealm?.id },
      fetch: authHeaders,
    },
  );

  const selectedLane = (() => {
    if (!lane || lanesQuery.data?.status !== 200) return undefined;
    const lanesData = (lanesQuery.data.data as GetApiV1AuthCampfireLanes200)
      .data;
    return lanesData.find((l) => l.key === lane);
  })();

  // Don't fetch discovery until realm ID is resolved (when a realm is selected)
  const isRealmPending = !!realm && realm !== "all" && !selectedRealm;

  // Build discovery API params from resolved IDs
  const discoveryParams = {
    ...(selectedRealm?.id ? { realm_id: selectedRealm.id } : {}),
    ...(selectedLane?.id ? { lane_id: selectedLane.id } : {}),
    ...(query ? { search: query } : {}),
  };

  // Fetch campfires from discovery API (server handles filtering)
  const discoveryQuery = useGetApiV1AuthCampfireDiscovery(discoveryParams, {
    query: {
      enabled: !isRealmPending,
    },
    fetch: authHeaders,
  });

  const campfires =
    discoveryQuery.data?.status === 200
      ? (discoveryQuery.data.data as GetApiV1AuthCampfireDiscovery200).data
      : [];

  const isLoading =
    discoveryQuery.isLoading || isRealmPending || realmsQuery.isLoading;

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
    <div
      className={
        "grid grid-cols-1 items-center md:grid md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-8"
      }
    >
      {isLoading ? (
        <DiscoveryListSkeleton />
      ) : campfires.length > 0 ? (
        campfires.map((discovery) => (
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
      {discoveryQuery.isFetching && !discoveryQuery.isLoading && (
        <div className="col-span-1 md:col-span-3 lg:col-span-3 xl:col-span-4 flex justify-center py-2">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
};

const DiscoveryListSkeleton = () => (
  <>
    {Array.from({ length: 8 }).map((_, i) => (
      <Skeleton
        key={`discovery-skeleton-${
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items
          i
        }`}
        className="h-36 w-full rounded-lg"
      />
    ))}
  </>
);
