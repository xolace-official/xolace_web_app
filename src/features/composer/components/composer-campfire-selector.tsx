"use client";

import { Check, ChevronDown, Flame } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";

import { useComposer } from "../composer-context";
import type { CampfireSelection } from "../composer-types";

// Placeholder list — in production this would come from a query/prop
const PLACEHOLDER_CAMPFIRES: CampfireSelection[] = [];

export function ComposerCampfireSelector() {
  const { campfire, setCampfire } = useComposer();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (c: CampfireSelection) => {
    setCampfire(c);
    setIsOpen(false);
  };

  const handleClear = () => {
    setCampfire(null);
    setIsOpen(false);
  };

  return (
    <div className="relative font-sans">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all duration-200",
          "bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800",
          "ring-1 ring-inset ring-zinc-200 dark:ring-zinc-800",
          "hover:ring-zinc-300 dark:hover:ring-zinc-700",
          "focus:outline-none focus:ring-2 focus:ring-orange-500/20",
          isOpen &&
            "ring-zinc-300 dark:ring-zinc-700 bg-zinc-100 dark:bg-zinc-800",
        )}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-800 dark:ring-zinc-700 overflow-hidden">
          {campfire?.iconUrl ? (
            <Image
              width={40}
              height={40}
              src={campfire.iconUrl}
              alt={campfire.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <Flame size={20} className="text-orange-500" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {campfire ? campfire.name : "Select a Campfire"}
            </span>
          </div>
          <div className="mt-0.5 flex items-center gap-1.5">
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                campfire ? "bg-green-500" : "bg-zinc-400",
              )}
            />
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              {campfire ? `/${campfire.slug}` : "Optional"}
            </span>
          </div>
        </div>

        <ChevronDown
          size={18}
          className={cn(
            "text-zinc-400 transition-transform duration-200 group-hover:text-zinc-600 dark:group-hover:text-zinc-300",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setIsOpen(false)}
            onKeyDown={(e) => e.key === "Escape" && setIsOpen(false)}
            aria-label="Close dropdown"
          />

          {/* Dropdown menu */}
          <div
            className={cn(
              "absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl shadow-xl shadow-zinc-900/5 ring-1 ring-zinc-200 dark:ring-zinc-800",
              "animate-in fade-in zoom-in-95 bg-white p-1.5 duration-100 dark:bg-zinc-900",
            )}
          >
            <div className="max-h-[320px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800">
              {/* Clear selection option */}
              {campfire && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-zinc-500 transition-all duration-200 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800/50"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-50 ring-1 ring-inset ring-zinc-100 dark:bg-zinc-800/50 dark:ring-zinc-800">
                    <Flame size={16} className="text-zinc-400" />
                  </div>
                  <span className="text-sm font-medium">No campfire</span>
                </button>
              )}

              {PLACEHOLDER_CAMPFIRES.length === 0 && !campfire ? (
                <div className="flex flex-col items-center gap-2 py-6 text-center">
                  <Flame
                    size={20}
                    className="text-zinc-400 dark:text-zinc-500"
                  />
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    No campfires available
                  </p>
                </div>
              ) : (
                PLACEHOLDER_CAMPFIRES.map((c) => {
                  const isSelected = campfire?.id === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleSelect(c)}
                      className={cn(
                        "flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-all duration-200",
                        "hover:bg-zinc-50 dark:hover:bg-zinc-800/50",
                        isSelected &&
                          "bg-zinc-50 hover:bg-zinc-50 dark:bg-zinc-800/50",
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1 ring-inset overflow-hidden",
                          isSelected
                            ? "bg-white ring-zinc-200 dark:bg-zinc-800 dark:ring-zinc-700"
                            : "bg-zinc-50 ring-zinc-100 dark:bg-zinc-800/50 dark:ring-zinc-800",
                        )}
                      >
                        {c.iconUrl ? (
                          <Image
                            width={36}
                            height={36}
                            src={c.iconUrl}
                            alt={c.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Flame size={16} className="text-orange-500" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1 pt-0.5">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={cn(
                              "truncate text-sm font-semibold",
                              isSelected
                                ? "text-zinc-900 dark:text-zinc-100"
                                : "text-zinc-700 dark:text-zinc-300",
                            )}
                          >
                            {c.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                            /{c.slug}
                          </span>
                          {isSelected && (
                            <Check
                              size={14}
                              className="ml-auto text-orange-500"
                            />
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
