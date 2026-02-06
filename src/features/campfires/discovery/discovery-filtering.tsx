"use client";
import { Search, SearchX } from "lucide-react";
import { debounce } from "nuqs";
import { useCallback, useState, useTransition } from "react";
import { ParamsSearchBar } from "@/components/shared/params-search-bar";
import { useFiltersServer } from "@/components/shared/search-params";
import { Button } from "@/components/ui/button";
// biome-ignore lint/style/useImportType: it crashes when I add type
import { campfire_realms, RealmKey } from "@/features/campfires";

export const DiscoveryFiltering = () => {
  const [isPending, startTransition] = useTransition();
  const [{ query, realm, lane }, setSearchParams] = useFiltersServer({
    limitUrlUpdates: debounce(250),
    shallow: false,
  });

  const [showSearchBar, setShowSearchBar] = useState<boolean>(false);

  // Derive and validate realm from URL
  const validRealm = (
    campfire_realms.some((r) => r.key === realm) ? realm : "all"
  ) as RealmKey;

  // Handle realm click - update URL directly
  const handleRealmClick = useCallback(
    (key: RealmKey) => {
      // If clicking the same realm, no need to update (optional optimization)
      if (key === validRealm) return;

      startTransition(async () => {
        await setSearchParams({
          realm: key,
          lane: "", // Reset lane when realm changes
        });
      });
    },
    [validRealm, setSearchParams],
  );

  // Handle lane click - update URL directly
  const handleLaneClick = useCallback(
    (laneKey: string) => {
      // Toggle: if clicking currently selected lane, deselect it (set to null/empty)
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

  const selectedRealmData = campfire_realms.find((r) => r.key === validRealm);
  const lanes = selectedRealmData?.lanes || [];

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
            className={`${validRealm === "all" ? "border-b border-destructive text-destructive" : "hover:text-primary"} text-sm font-semibold px-1 md:px-2 cursor-pointer whitespace-nowrap shrink-0`}
            onClick={() => handleRealmClick("all")}
          >
            All
          </button>
          {campfire_realms?.map((r) => {
            const active = r.key === validRealm;
            return (
              <button
                key={r.key}
                type="button"
                className={`${active ? "border-b border-destructive text-destructive" : "hover:text-primary"} text-xs md:text-sm font-semibold px-1 md:px-2 cursor-pointer whitespace-nowrap shrink-0`}
                onClick={() => handleRealmClick(r.key)}
              >
                {r.name}
              </button>
            );
          })}
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
          {lanes.length > 0 ? (
            <div
              className={
                "flex items-center gap-4 overflow-x-auto scrollbar-hide scroll-smooth min-w-0 flex-1"
              }
            >
              {lanes.map((l) => {
                const active = lane === l[0];
                return (
                  <button
                    key={l[0]}
                    type="button"
                    className={`py-1 px-4 text-xs whitespace-nowrap shrink-0 border rounded-sm cursor-pointer ${active ? "border-destructive/20 bg-destructive text-destructive-foreground" : "border-border hover:bg-accent/20 hover:shadow-lg"}`}
                    onClick={() => handleLaneClick(l[0])}
                  >
                    {l[1]}
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
