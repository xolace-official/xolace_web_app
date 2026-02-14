"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getGetApiV1AuthProfileMeQueryKey,
  type PutApiV1AuthProfileBody,
  putApiV1AuthProfile,
} from "@/api-client";
import { useAppStore } from "@/providers/app-store-provider";

export function useProfileMutations() {
  const queryClient = useQueryClient();
  const session = useAppStore((s) => s.session);
  const updateProfile = useAppStore((s) => s.updateProfile);

  const mutation = useMutation({
    mutationKey: ["putApiV1AuthProfile"],
    mutationFn: async ({ data }: { data: PutApiV1AuthProfileBody }) => {
      return putApiV1AuthProfile(data, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
    },
    onMutate: async ({ data }) => {
      // Optimistically update Zustand store
      updateProfile(data);
    },
    onSuccess: () => {
      toast.success("Profile updated");
    },
    onError: (error) => {
      toast.error("Failed to update profile", {
        description: error.message,
      });
      // Re-sync from server
      queryClient.invalidateQueries({
        queryKey: getGetApiV1AuthProfileMeQueryKey(),
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: getGetApiV1AuthProfileMeQueryKey(),
      });
    },
  });

  return {
    updateProfileMutation: mutation,
    mutate: (data: PutApiV1AuthProfileBody) => mutation.mutate({ data }),
    isPending: mutation.isPending,
  };
}
