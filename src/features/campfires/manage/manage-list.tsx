"use client";

import { Flame } from "lucide-react";
import {
  type GetApiV1AuthCampfireManage200DataItem,
  useGetApiV1AuthCampfireManage,
} from "@/api-client";
import { EmptyContent } from "@/components/app/empty-content";
import ManageCampfireCard, {
  type UserCampfireFavoriteJoin,
} from "@/components/cards/campfires/manage-card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  extractApiDataArray,
  useAuthHeaders,
} from "@/features/campfires/campfire-api-utils";
import { useToggleFavorite } from "@/hooks/campfires/use-toggle-favorite";
import { useAppStore } from "@/providers/app-store-provider";
import { CAMPFIRE_PAGE_SIZE } from "@/features/campfires/campfire.constants";
import { useManageCampfiresFilters } from "./manage-campfires-filter";

export function ManageCampfireList() {
  const session = useAppStore((s) => s.session);
  const authHeaders = useAuthHeaders(session.access_token);
  const [{ tab, query }] = useManageCampfiresFilters();

  const { data, isLoading, isError } = useGetApiV1AuthCampfireManage(
    { page_size: CAMPFIRE_PAGE_SIZE },
    { fetch: authHeaders },
  );

  const toggleFavMutation = useToggleFavorite();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton rows
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="size-8 rounded-full shrink-0" />
            <div className="flex flex-col gap-1 flex-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="h-8 w-20 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyContent
        icon={<Flame className="size-8 text-muted-foreground" />}
        title="Something went wrong"
        description="We couldn't load your campfires. Please try again later."
      />
    );
  }

  const allItems =
    extractApiDataArray<GetApiV1AuthCampfireManage200DataItem>(data);

  const filtered = allItems
    .filter((item) => (tab === "favorites" ? item.is_favorite : true))
    .filter(
      (item) =>
        !query ||
        item.campfire.name.toLowerCase().includes(query.toLowerCase()),
    );

  const campfires: UserCampfireFavoriteJoin[] = filtered.map((item) => ({
    campfireId: item.campfire_id,
    name: item.campfire.name,
    slug: item.campfire.slug,
    description: item.campfire.description ?? undefined,
    iconURL: item.campfire.icon_path ?? undefined,
    isFavorite: item.is_favorite,
    isJoined: true,
  }));

  if (campfires.length === 0) {
    return (
      <EmptyContent
        icon={<Flame className="size-8 text-muted-foreground" />}
        title={tab === "favorites" ? "No favorites yet" : "No campfires found"}
        description={
          tab === "favorites"
            ? "Star a campfire to add it to your favorites."
            : query
              ? "No campfires match your search."
              : "You haven't joined any campfires yet."
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-4 *:content-visibility-auto">
      {campfires.map((campfire) => (
        <ManageCampfireCard
          key={campfire.campfireId}
          {...campfire}
          onToggleFavorite={(id, current) =>
            toggleFavMutation.mutate({ campfireId: id, is_favorite: !current })
          }
          isTogglingFavorite={
            toggleFavMutation.isPending &&
            toggleFavMutation.variables?.campfireId === campfire.campfireId
          }
        />
      ))}
    </div>
  );
}
