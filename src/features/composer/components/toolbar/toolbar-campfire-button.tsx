"use client";

import { useState } from "react";
import { Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useComposer } from "../../composer-context";
import { CampfirePicker } from "../../pickers/campfire-picker";

export function ToolbarCampfireButton() {
  const { campfire } = useComposer();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size={campfire ? "sm" : "iconSm"}
          active={!!campfire}
          tooltip={campfire ? campfire.name : "Select campfire"}
          aria-label="Select campfire"
          className={campfire ? "gap-1.5 text-xs" : undefined}
        >
          <Flame className="size-4" />
          {campfire && (
            <span className="max-w-[80px] truncate">{campfire.name}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[240px] p-2">
        <CampfirePicker onSelect={() => setOpen(false)} />
      </PopoverContent>
    </Popover>
  );
}
