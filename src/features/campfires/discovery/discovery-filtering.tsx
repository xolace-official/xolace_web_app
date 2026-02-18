"use client";
import { Search, SearchX } from "lucide-react";
import { debounce } from "nuqs";
import { useCallback, useMemo, useState, useTransition } from "react";
import type {
  GetApiV1AuthCampfireLanes200,
  GetApiV1AuthCampfireRealms200,
} from "@/api-client";
import {
  useGetApiV1AuthCampfireLanes,
  useGetApiV1AuthCampfireRealms,
} from "@/api-client";
import { ParamsSearchBar } from "@/components/shared/params-search-bar";
import { useFiltersServer } from "@/components/shared/search-params";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppStore } from "@/providers/app-store-provider";

export const DiscoveryFiltering = () => {
  const [isPending, startTransition] = useTransition();
  const session = useAppStore((s) => s.session);
  const [{ query, realm, lane }, setSearchParams] = useFiltersServer({
    limitUrlUpdates: debounce(250),
    shallow: false,
  });

  const [showSearchBar, setShowSearchBar] = useState<boolean>(false);

  // Fetch realms from API
  const realmsQuery = useGetApiV1AuthCampfireRealms({
    fetch: {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    },
  });

  const realms =
    realmsQuery.data?.status === 200
      ? (realmsQuery.data.data as GetApiV1AuthCampfireRealms200).data
      : [];

  // Derive the selected realm object from the URL param (key)
  const selectedRealm = useMemo(
    () => realms.find((r) => r.key === realm),
    [realms, realm],
  );

  // Fetch lanes for the selected realm
  const lanesQuery = useGetApiV1AuthCampfireLanes(
    { realmId: selectedRealm?.id ?? "" },
    {
      query: {
        enabled: !!selectedRealm?.id,
      },
      fetch: {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      },
    },
  );

  const lanes =
    lanesQuery.data?.status === 200
      ? (lanesQuery.data.data as GetApiV1AuthCampfireLanes200).data
      : [];

  // Handle realm click - update URL directly
  const handleRealmClick = useCallback(
    (key: string) => {
      if (key === realm) return;

      startTransition(async () => {
        await setSearchParams({
          realm: key,
          lane: "", // Reset lane when realm changes
        });
      });
    },
    [realm, setSearchParams],
  );

  // Handle lane click - update URL directly
  const handleLaneClick = useCallback(
    (laneKey: string) => {
      const newLane = lane === laneKey ? "" : laneKey;

      startTransition(async () => {
        await setSearchParams({
          lane: newLane,
        });
      });
    },
    [lane, setSearchParams],
  );

  // Handle hiding search bar and clearing query
  const handleHideSearch = useCallback(() => {
    setShowSearchBar(false);
    startTransition(async () => {
      await setSearchParams({
        query: "",
      });
    });
  }, [setSearchParams]);

  // Handle query change
  const handleQueryChange = useCallback(
    (value: string) => {
      startTransition(async () => {
        await setSearchParams(
          { query: value },
          {
            limitUrlUpdates: value ? debounce(250) : undefined,
          },
        );
      });
    },
    [setSearchParams],
  );

  // Handle query clear
  const handleQueryClear = useCallback(() => {
    startTransition(async () => {
      await setSearchParams({ query: "" });
    });
  }, [setSearchParams]);

  return (
    <div
      className={
        "w-full flex flex-col items-start gap-2 sticky top-0 z-50 bg-background"
      }
    >
      <div className={"w-full border-b overflow-hidden"}>
        <div
          className={
            "flex flex-row gap-2 md:gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
          }
        >
          <button
            type="button"
            className={`${realm === "all" || !realm ? "border-b border-destructive text-destructive" : "hover:text-primary"} text-sm font-semibold px-1 md:px-2 cursor-pointer whitespace-nowrap shrink-0`}
            onClick={() => handleRealmClick("all")}
          >
            All
          </button>
          {realmsQuery.isLoading ? (
            <>
              <Skeleton className="h-5 w-20 shrink-0" />
              <Skeleton className="h-5 w-16 shrink-0" />
              <Skeleton className="h-5 w-24 shrink-0" />
            </>
          ) : (
            realms.map((r) => {
              const active = r.key === realm;
              return (
                <button
                  key={r.id}
                  type="button"
                  className={`${active ? "border-b border-destructive text-destructive" : "hover:text-primary"} text-xs md:text-sm font-semibold px-1 md:px-2 cursor-pointer whitespace-nowrap shrink-0`}
                  onClick={() => handleRealmClick(r.key)}
                >
                  {r.name}
                </button>
              );
            })
          )}
        </div>
      </div>

      {showSearchBar || query ? (
        <div className={"w-full flex gap-4 items-center"}>
          <ParamsSearchBar
            value={query}
            onChange={handleQueryChange}
            onClear={handleQueryClear}
            isLoading={isPending}
          />
          <Button size="sm" variant="destructive" onClick={handleHideSearch}>
            <SearchX />
          </Button>
        </div>
      ) : (
        <div className={"flex items-center gap-2 w-full overflow-hidden"}>
          <Button
            size="sm"
            onClick={() => setShowSearchBar(true)}
            className={"h-6 shrink-0"}
          >
            <Search />
          </Button>
          {lanesQuery.isLoading && selectedRealm ? (
            <div className="flex items-center gap-4">
              <Skeleton className="h-6 w-16 shrink-0 rounded-sm" />
              <Skeleton className="h-6 w-20 shrink-0 rounded-sm" />
            </div>
          ) : lanes.length > 0 ? (
            <div
              className={
                "flex items-center gap-4 overflow-x-auto scrollbar-hide scroll-smooth min-w-0 flex-1"
              }
            >
              {lanes.map((l) => {
                const active = lane === l.key;
                return (
                  <button
                    key={l.id}
                    type="button"
                    className={`py-1 px-4 text-xs whitespace-nowrap shrink-0 border rounded-sm cursor-pointer ${active ? "border-destructive/20 bg-destructive text-destructive-foreground" : "border-border hover:bg-accent/20 hover:shadow-lg"}`}
                    onClick={() => handleLaneClick(l.key)}
                  >
                    {l.name}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
