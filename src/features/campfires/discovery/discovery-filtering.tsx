"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Search, SearchX } from "lucide-react";
import { SearchBar } from "@/components/shared/search-bar";
import {
  CAMPFIRE_REALMS,
  InteractionStyle,
} from "@/features/campfires/discovery/index";
import { useDiscovery } from "./discovery-context";

type RealmKey = InteractionStyle | "all";

export const DiscoveryFiltering = () => {
  const { selectedRealm, setSelectedRealm, selectedLane, setSelectedLane } =
    useDiscovery();
  const [showSearch, setShowSearch] = useState<boolean>(false);

  //Handle real click
  const handleRealmClick = (key: RealmKey) => {
    if (key) {
      setSelectedRealm(key);
      setSelectedLane(null);
    }
  };

  // Handle lane click for filtering
  const handleLaneClick = (laneKey: string) => {
    setSelectedLane(laneKey);
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

      {showSearch ? (
        <div className={"w-full flex gap-4 items-center"}>
          <SearchBar />
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setShowSearch(false)}
          >
            <SearchX />
          </Button>
        </div>
      ) : (
        <div className={"flex items-center gap-2 w-full overflow-hidden"}>
          <Button
            size="sm"
            onClick={() => setShowSearch(true)}
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
