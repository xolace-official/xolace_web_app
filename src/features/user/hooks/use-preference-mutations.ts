"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getGetApiV1AuthPreferencesQueryKey,
  getPutApiV1AuthPreferencesMutationOptions,
  type PutApiV1AuthPreferencesBody,
} from "@/api-client";
import { useAppStore } from "@/providers/app-store-provider";

export function usePreferenceMutations() {
  const queryClient = useQueryClient();
  const session = useAppStore((s) => s.session);
  const updatePreferences = useAppStore((s) => s.updatePreferences);

  const mutation = useMutation({
    ...getPutApiV1AuthPreferencesMutationOptions({
      fetch: {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      },
    }),
    onMutate: async ({ data }) => {
      // Optimistically update Zustand store
      updatePreferences(data);
    },
    onError: (error) => {
      toast.error("Failed to update preference", {
        description: error.message,
      });
      // Re-sync from server
      queryClient.invalidateQueries({
        queryKey: getGetApiV1AuthPreferencesQueryKey(),
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: getGetApiV1AuthPreferencesQueryKey(),
      });
    },
  });

  return {
    updatePreferenceMutation: mutation,
    mutate: (data: PutApiV1AuthPreferencesBody) => mutation.mutate({ data }),
    isPending: mutation.isPending,
  };
}
