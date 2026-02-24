/**
 * Hook for deleting a collection using the generated api-client.
 */

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getGetApiV1AuthCollectionQueryKey,
  getGetApiV1AuthCollectionSimpleQueryKey,
  useDeleteApiV1AuthCollectionCollectionId,
} from "@/api-client";
import { useAuthHeaders } from "@/features/campfires/campfire-api-utils";
import { useAppStore } from "@/providers/app-store-provider";

interface UseDeleteCollectionOptions {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

export function useDeleteCollection(options: UseDeleteCollectionOptions = {}) {
  const queryClient = useQueryClient();
  const session = useAppStore((s) => s.session);
  const authHeaders = useAuthHeaders(session.access_token);

  const mutation = useDeleteApiV1AuthCollectionCollectionId({
    fetch: authHeaders,
    mutation: {
      onSuccess: () => {
        // Remove cached data so the collections list fetches fresh on mount.
        // Unlike invalidateQueries, this works even without active observers
        // (the grid isn't mounted while we're on the detail page).
        queryClient.removeQueries({
          queryKey: getGetApiV1AuthCollectionQueryKey(),
        });
        queryClient.removeQueries({
          queryKey: getGetApiV1AuthCollectionSimpleQueryKey(),
        });
        toast.success("Collection deleted");
        options.onSuccess?.();
      },
      onError: (error) => {
        toast.error("Failed to delete collection", {
          description:
            error && typeof error === "object" && "message" in error
              ? (error as { message: string }).message
              : "Something went wrong",
        });
        options.onError?.(error);
      },
    },
  });

  return {
    ...mutation,
    mutate: (collectionId: string) => mutation.mutate({ collectionId }),
  };
}
