"use client";

import { useTransition } from "react";
import { SearchBar } from "@/components/shared/search-bar";
import { useManageCampfiresFilters } from "./manage-campfires-filter";

export function ManageCampfireSearchBar() {
  const [isPending, startTransition] = useTransition();
  const [{ query }, setSearchParams] = useManageCampfiresFilters({
    startTransition,
  });

  return (
    <SearchBar
      className="flex-1"
      placeholder="Search campfires..."
      value={query}
      onChange={(value) => setSearchParams({ query: value })}
      onSearch={(value) => setSearchParams({ query: value })}
      isLoading={isPending}
    />
  );
}
