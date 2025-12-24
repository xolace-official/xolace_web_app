"use client";

import { SquareDashedMousePointer, X } from "lucide-react";
import { useState } from "react";
import { AnimatedDrawer } from "@/components/builders/animated-drawer";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { tabOptions } from "./right-side-section";

export const FilterDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("allCampfires");

  // Mock data lengths
  const allFavoriteCampfires = [];
  const allJoinedCampfires = [];

  return (
    <>
      <Button
        size="icon"
        className="rounded-full  lg:hidden"
        onClick={() => setIsOpen(true)}
      >
        <SquareDashedMousePointer size={20} />
      </Button>

      <AnimatedDrawer open={isOpen} onOpenChange={setIsOpen}>
        <AnimatedDrawer.Content showHandle={false}>
          <AnimatedDrawer.Body>
            <div className="flex items-center justify-between w-full mb-4">
              <h2 className="text-lg font-semibold text-foreground">Filter</h2>
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full hover:bg-muted"
                onClick={() => setIsOpen(false)}
              >
                <X className="text-muted-foreground" size={18} />
              </Button>
            </div>
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
                    className="group flex w-full items-center justify-between rounded-lg! p-3 text-sm transition-colors h-auto data-[state=on]:bg-primary data-[state=on]:font-semibold data-[state=on]:text-primary-foreground dark:data-[state=on]:bg-primary dark:data-[state=on]:text-primary-foreground  dark:text-neutral-300 dark:hover:bg-primary/60 bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                  >
                    <span>{option.label}</span>
                    <span className="rounded-full px-2 py-1 text-xs text-foreground bg-slate-100 dark:bg-neutral-800 group-data-[state=on]:bg-background dark:group-data-[state=on]:bg-background">
                      {count}
                    </span>
                  </ToggleGroupItem>
                );
              })}
            </ToggleGroup>
          </AnimatedDrawer.Body>
          {/* <AnimatedDrawer.Footer>
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button className="flex-1" onClick={() => setIsOpen(false)}>
              Confirm
            </Button>
          </AnimatedDrawer.Footer> */}
        </AnimatedDrawer.Content>
      </AnimatedDrawer>
    </>
  );
};
