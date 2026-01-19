"use client";
import { Upload } from "lucide-react";
import { debounce } from "nuqs";
import { useTransition } from "react";
import { ParamsSearchBar } from "@/components/shared/params-search-bar";
import { Button } from "@/components/ui/button";
import { useGlimpseFiltersServer } from "@/features/health-space/glimpse/glimpse-filter";

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
        <Button variant={"destructive"} size={"sm"} aria-label="Upload">
          <Upload aria-hidden="true" />{" "}
          <span className={"hidden md:flex"}>Upload</span>
        </Button>
      </div>
    </div>
  );
};
