"use client";

import {
  type GetApiV1AuthCampfireManage200DataItem,
  useGetApiV1AuthCampfireManage,
} from "@/api-client";
import { LegalFooter } from "@/components/shared/legal-footer";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  extractApiDataArray,
  useAuthHeaders,
} from "@/features/campfires/campfire-api-utils";
import { useAppStore } from "@/providers/app-store-provider";
import { useManageCampfiresFilters } from "./manage-campfires-filter";

export const tabOptions: { key: string; label: string }[] = [
  { key: "allCampfires", label: "All Campfires" },
  { key: "favorites", label: "Favorites" },
];

const PAGE_SIZE = "50";

export const RightSideSection = () => {
  const session = useAppStore((s) => s.session);
  const authHeaders = useAuthHeaders(session.access_token);
  const [{ tab }, setSearchParams] = useManageCampfiresFilters();

  const { data, isLoading } = useGetApiV1AuthCampfireManage(
    { page_size: PAGE_SIZE },
    { fetch: authHeaders },
  );

  const allItems =
    extractApiDataArray<GetApiV1AuthCampfireManage200DataItem>(data);
  const allCount = allItems.length;
  const favCount = allItems.filter((i) => i.is_favorite).length;

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <h3 className="uppercase font-semibold text-sm text-neutral-400">
          Filter campfires
        </h3>

        <ToggleGroup
          type="single"
          value={tab}
          onValueChange={(value) => {
            if (value) setSearchParams({ tab: value });
          }}
          className="flex flex-col gap-2 w-full"
        >
          {tabOptions.map((option) => {
            const count = option.key === "favorites" ? favCount : allCount;

            return (
              <ToggleGroupItem
                key={option.key}
                value={option.key}
                className="group flex w-full items-center justify-between rounded-lg! p-3 text-sm transition-colors h-auto data-[state=on]:bg-primary data-[state=on]:font-semibold data-[state=on]:text-primary-foreground dark:data-[state=on]:bg-primary dark:data-[state=on]:text-primary-foreground text-neutral-600 hover:bg-slate-50 dark:text-neutral-300 dark:hover:bg-primary/60"
              >
                <span>{option.label}</span>
                {isLoading ? (
                  <Skeleton className="h-5 w-6 rounded-full" />
                ) : (
                  <span className="rounded-full px-2 py-1 text-xs text-foreground bg-slate-100 dark:bg-neutral-800 group-data-[state=on]:bg-background dark:group-data-[state=on]:bg-background">
                    {count}
                  </span>
                )}
              </ToggleGroupItem>
            );
          })}
        </ToggleGroup>
      </div>

      <LegalFooter />
    </div>
  );
};
