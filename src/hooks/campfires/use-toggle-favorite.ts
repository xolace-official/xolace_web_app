"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  type GetApiV1AuthCampfireManage200DataItem,
  type getApiV1AuthCampfireManageResponse,
  getGetApiV1AuthCampfireManageQueryKey,
  patchApiV1AuthCampfireCampfireIdFavorite,
} from "@/api-client";
import { useAuthHeaders } from "@/features/campfires/campfire-api-utils";
import { CAMPFIRE_PAGE_SIZE } from "@/features/campfires/campfire.constants";
import { useAppStore } from "@/providers/app-store-provider";

export function useToggleFavorite() {
  const queryClient = useQueryClient();
  const session = useAppStore((s) => s.session);
  const authHeaders = useAuthHeaders(session.access_token);
  const queryKey = getGetApiV1AuthCampfireManageQueryKey({
    page_size: CAMPFIRE_PAGE_SIZE,
  });

  return useMutation({
    mutationFn: ({
      campfireId,
      is_favorite,
    }: {
      campfireId: string;
      is_favorite: boolean;
    }) =>
      patchApiV1AuthCampfireCampfireIdFavorite(
        campfireId,
        { is_favorite },
        { headers: authHeaders.headers },
      ),

    onMutate: async ({ campfireId, is_favorite }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous =
        queryClient.getQueryData<getApiV1AuthCampfireManageResponse>(queryKey);

      queryClient.setQueryData<getApiV1AuthCampfireManageResponse>(
        queryKey,
        (old) => {
          if (!old || old.status !== 200) return old;
          return {
            ...old,
            data: {
              ...old.data,
              data: old.data.data.map(
                (item: GetApiV1AuthCampfireManage200DataItem) =>
                  item.campfire_id === campfireId
                    ? { ...item, is_favorite }
                    : item,
              ),
            },
          };
        },
      );

      return { previous };
    },

    onError: (err, _vars, context) => {
      console.error("useToggleFavorite error:", err);
      queryClient.setQueryData(queryKey, context?.previous);
      toast.error("Failed to update favorite");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
