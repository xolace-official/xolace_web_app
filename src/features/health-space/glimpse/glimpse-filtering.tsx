"use client";
import { ParamsSearchBar } from "@/components/shared/params-search-bar";
import { useTransition } from "react";
import { debounce } from "nuqs";
import { useGlimpseFiltersServer } from "@/features/health-space/glimpse/glimpse-filter";

export const GlimpseFiltering = () => {
  const [isPending, startTransition] = useTransition();
  const [{ query, tab }, setSearchParams] = useGlimpseFiltersServer();

  const active = false;

  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="w-[80%] mx-auto">
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
          onClear={() => {
            startTransition(async () => {
              await setSearchParams({ query: "" });
            });
          }}
          isLoading={isPending}
        />
      </div>
      <div
        className={
          "flex items-center gap-2 overflow-x-auto scrollbar-hide scroll-smooth min-w-0 flex-1"
        }
      >
        {Array.from({ length: 10 }, (_, i) => {
          return (
            <button
              key={i}
              type="button"
              className={`py-1 px-4 text-xs whitespace-nowrap shrink-0 border rounded-sm cursor-pointer ${active ? "border-destructive/20 bg-destructive text-destructive-foreground" : "border-border hover:bg-accent/20 hover:shadow-lg"}`}
              onClick={() => ""}
            >
              Hey there
            </button>
          );
        })}
      </div>
    </div>
  );
};
