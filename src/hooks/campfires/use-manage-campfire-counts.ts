"use client";

import {
  type GetApiV1AuthCampfireManage200DataItem,
  type GetApiV1AuthCampfireManage200Meta,
  useGetApiV1AuthCampfireManage,
} from "@/api-client";
import { CAMPFIRE_PAGE_SIZE } from "@/features/campfires/campfire.constants";
import { useAuthHeaders } from "@/features/campfires/campfire-api-utils";
import { useAppStore } from "@/providers/app-store-provider";

export function useManageCampfireCounts() {
  const session = useAppStore((s) => s.session);
  const authHeaders = useAuthHeaders(session.access_token);

  const { data, isLoading } = useGetApiV1AuthCampfireManage(
    { page_size: CAMPFIRE_PAGE_SIZE },
    { fetch: authHeaders },
  );

  const meta =
    data?.status === 200
      ? (data.data as { meta: GetApiV1AuthCampfireManage200Meta }).meta
      : null;

  const items =
    data?.status === 200
      ? (data.data as { data: GetApiV1AuthCampfireManage200DataItem[] }).data
      : [];

  const allCount = meta?.totalCount ?? 0;
  const favCount = items.filter((i) => i.is_favorite).length;

  return { allCount, favCount, isLoading };
}
