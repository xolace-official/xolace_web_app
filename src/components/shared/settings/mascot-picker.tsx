"use client";

import { memo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// TODO: Replace with actual mascot images from your assets
const MASCOT_OPTIONS = [
  { id: "mascot-1", src: "/mascots/mascot-1.png", alt: "Mascot 1" },
  { id: "mascot-2", src: "/mascots/mascot-2.png", alt: "Mascot 2" },
  { id: "mascot-3", src: "/mascots/mascot-3.png", alt: "Mascot 3" },
  { id: "mascot-4", src: "/mascots/mascot-4.png", alt: "Mascot 4" },
  { id: "mascot-5", src: "/mascots/mascot-5.png", alt: "Mascot 5" },
  { id: "mascot-6", src: "/mascots/mascot-6.png", alt: "Mascot 6" },
  { id: "mascot-7", src: "/mascots/mascot-7.png", alt: "Mascot 7" },
  { id: "mascot-8", src: "/mascots/mascot-8.png", alt: "Mascot 8" },
] as const;

interface MascotPickerProps {
  value: string | null;
  onValueChange: (value: string | null) => void;
  children?: React.ReactNode;
}

export function MascotPicker({
  value,
  onValueChange,
  children,
}: MascotPickerProps) {
  const [open, setOpen] = useState(false);

  //const selectedMascot = MASCOT_OPTIONS.find((m) => m.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children ? (
          children
        ) : (
          <Button variant="outline" size="sm">
            Change avatar
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="end">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Choose your avatar</p>
            {value && (
              <Button
                variant="ghost"
                size="action"
                onClick={() => {
                  onValueChange(null);
                  setOpen(false);
                }}
              >
                Remove
              </Button>
            )}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {MASCOT_OPTIONS.map((mascot) => (
              <MascotItem
                key={mascot.id}
                mascot={mascot}
                isSelected={value === mascot.id}
                onSelect={() => {
                  onValueChange(mascot.id);
                  setOpen(false);
                }}
              />
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface MascotItemProps {
  mascot: (typeof MASCOT_OPTIONS)[number];
  isSelected: boolean;
  onSelect: () => void;
}

const MascotItem = memo(function MascotItem({
  mascot,
  isSelected,
  onSelect,
}: MascotItemProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "rounded-lg p-1 transition-all hover:bg-accent",
        isSelected &&
          "ring-2 ring-primary ring-offset-2 ring-offset-background",
      )}
    >
      <Avatar className="size-10">
        <AvatarImage src={mascot.src} alt={mascot.alt} />
        <AvatarFallback className="text-xs">
          {mascot.alt.charAt(0)}
        </AvatarFallback>
      </Avatar>
    </button>
  );
});

export { MASCOT_OPTIONS };
