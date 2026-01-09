"use client";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import { Search, SearchX } from "lucide-react";
import {
  CAMPFIRE_REALMS,
  RealmKey,
} from "@/features/campfires/discovery/index";
import { ParamsSearchBar } from "@/components/shared/params-search-bar";
import { useFiltersServer } from "@/components/shared/search-params";
import { debounce } from "nuqs/server";

export const DiscoveryFiltering = () => {
  const [isPending, startTransition] = useTransition();
  const [{ query, realm, lane }, setSearchParams] = useFiltersServer({
    limitUrlUpdates: debounce(250),
    shallow: false,
  });

  const [selectedRealm, setSelectedRealm] = useState<RealmKey>(
    realm as RealmKey,
  );
  const [selectedLane, setSelectedLane] = useState<string | null>(lane || null);
  const [showSearchBar, setShowSearchBar] = useState<boolean>(false);

  // Handle realm click - update both local state and URL
  const handleRealmClick = (key: RealmKey) => {
    setSelectedRealm(key);
    setSelectedLane(null);

    startTransition(async () => {
      await setSearchParams({
        realm: key,
        lane: "",
      });
    });
  };

  // Handle lane click - update both local state and URL
  const handleLaneClick = (laneKey: string) => {
    const newLane = selectedLane === laneKey ? null : laneKey;
    setSelectedLane(newLane);

    startTransition(async () => {
      await setSearchParams({
        lane: newLane || "",
      });
    });
  };

  // Handle hiding search bar and clearing query
  const handleHideSearch = () => {
    setShowSearchBar(false);

    startTransition(async () => {
      await setSearchParams({
        query: "",
      });
    });
  };

  const selectedRealmData = CAMPFIRE_REALMS.find(
    (realm) => realm.key === selectedRealm,
  );
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
          <p
            className={`${selectedRealm === "all" ? "border-b border-destructive text-destructive" : "hover:text-primary"} text-sm font-semibold px-1 md:px-2 cursor-pointer whitespace-nowrap flex-shrink-0`}
            onClick={() => handleRealmClick("all")}
          >
            All
          </p>
          {CAMPFIRE_REALMS?.map((realm) => {
            const active = realm.key === selectedRealm;
            return (
              <p
                key={realm.key}
                className={`${active ? "border-b border-destructive text-destructive" : "hover:text-primary"} text-xs md:text-sm font-semibold px-1 md:px-2 cursor-pointer whitespace-nowrap flex-shrink-0`}
                onClick={() => handleRealmClick(realm.key)}
              >
                {realm.name}
              </p>
            );
          })}
        </div>
      </div>

      {showSearchBar || query ? (
        <div className={"w-full flex gap-4 items-center"}>
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
            className={"h-6 flex-shrink-0"}
          >
            <Search />
          </Button>
          {lanes.length > 0 && (
            <div
              className={
                "flex items-center gap-4 overflow-x-auto scrollbar-hide scroll-smooth min-w-0 flex-1"
              }
            >
              {lanes.map((lane) => {
                const active = selectedLane === lane[0];
                return (
                  <p
                    key={lane[0]}
                    className={`py-1 px-4 text-xs whitespace-nowrap flex-shrink-0 border rounded-sm cursor-pointer ${active ? "border-destructive/20 bg-destructive text-destructive-foreground" : "border-border hover:bg-accent/20 hover:shadow-lg"}`}
                    onClick={() => handleLaneClick(lane[0])}
                  >
                    {lane[1]}
                  </p>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
