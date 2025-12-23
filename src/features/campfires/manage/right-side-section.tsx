"use client";

import { useState } from "react";
import { LegalFooter } from "@/components/shared/legal-footer";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const tabOptions: { key: string; label: string }[] = [
  { key: "allCampfires", label: "All Campfires" },
  { key: "favorites", label: "Favorites" },
];

export const RightSideSection = () => {
  const [selectedTab, setSelectedTab] = useState("allCampfires");

  // Mock data lengths
  const allFavoriteCampfires = [];
  const allJoinedCampfires = [];

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <h3 className="uppercase font-semibold text-sm text-neutral-400">
          Filter campfires
        </h3>

        <ToggleGroup
          type="single"
          value={selectedTab}
          onValueChange={(value) => {
            if (value) setSelectedTab(value);
          }}
          className="flex flex-col gap-2 w-full"
        >
          {tabOptions.map((option) => {
            const count =
              option.key === "favorites"
                ? allFavoriteCampfires.length
                : allJoinedCampfires.length;

            return (
              <ToggleGroupItem
                key={option.key}
                value={option.key}
                className="group flex w-full items-center justify-between rounded-lg! p-3 text-sm transition-colors h-auto data-[state=on]:bg-primary data-[state=on]:font-semibold data-[state=on]:text-primary-foreground dark:data-[state=on]:bg-primary dark:data-[state=on]:text-primary-foreground text-neutral-600 hover:bg-slate-50 dark:text-neutral-300 dark:hover:bg-primary/60"
              >
                <span>{option.label}</span>
                <span className="rounded-full px-2 py-1 text-xs text-foreground bg-slate-100 dark:bg-neutral-800 group-data-[state=on]:bg-background dark:group-data-[state=on]:bg-background">
                  {count}
                </span>
              </ToggleGroupItem>
            );
          })}
        </ToggleGroup>
      </div>

      <LegalFooter />
    </div>
  );
};
