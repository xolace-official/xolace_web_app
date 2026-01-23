"use client";

import { useState } from "react";
import { SmilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useComposer } from "../../composer-context";
import { MoodPicker } from "../../pickers/mood-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function ToolbarMoodButton() {
  const { mood } = useComposer();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="iconSm"
          active={mood !== "neutral"}
          tooltip="Set mood"
          aria-label="Set mood"
        >
          <SmilePlus className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[320px] p-3">
        <MoodPicker onSelect={() => setOpen(false)} />
      </PopoverContent>
    </Popover>
  );
}
