"use client";
import { ParamsSearchBar } from "@/components/shared/params-search-bar";
import { useTransition } from "react";
import { debounce } from "nuqs";
import { useGlimpseFiltersServer } from "@/features/health-space/glimpse/glimpse-filter";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export const GlimpseFiltering = () => {
  const [isPending, startTransition] = useTransition();
  const [{ query }, setSearchParams] = useGlimpseFiltersServer();

  return (
    <div className="w-full flex flex-row gap-8 items-center">
      <div className="w-full flex flex-row gap-2 md:gap-6 max-w-3xl mx-auto px-2">
        <ParamsSearchBar
          value={query}
          placeholder={"Search Real stories. Real voices. Here..."}
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
        <Button variant={"destructive"} size={"sm"}>
          <Upload /> <span className={"sr hidden md:flex"}>Upload</span>
        </Button>
      </div>
    </div>
  );
};
