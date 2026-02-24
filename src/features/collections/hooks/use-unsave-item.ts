/**
 * Hook for removing an item from a collection using the generated api-client.
 */

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  type DeleteApiV1AuthCollectionItemsBody,
  getGetApiV1AuthCollectionCollectionIdItemsQueryKey,
  getGetApiV1AuthCollectionQueryKey,
  getGetApiV1AuthCollectionSimpleQueryKey,
  useDeleteApiV1AuthCollectionItems,
} from "@/api-client";
import { useAuthHeaders } from "@/features/campfires/campfire-api-utils";
import { useAppStore } from "@/providers/app-store-provider";

interface UseUnsaveItemOptions {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

export function useUnsaveItem(options: UseUnsaveItemOptions = {}) {
  const queryClient = useQueryClient();
  const session = useAppStore((s) => s.session);
  const authHeaders = useAuthHeaders(session.access_token);

  const mutation = useDeleteApiV1AuthCollectionItems({
    fetch: authHeaders,
    mutation: {
      onSuccess: () => {
        toast.success("Item removed");
        options.onSuccess?.();
      },
      onError: (error) => {
        toast.error("Failed to remove item", {
          description:
            error && typeof error === "object" && "message" in error
              ? (error as { message: string }).message
              : "Something went wrong",
        });
        options.onError?.(error);
      },
      onSettled: (_data, _error, variables) => {
        // Invalidate both the collection list and the specific collection's items
        queryClient.invalidateQueries({
          queryKey: getGetApiV1AuthCollectionQueryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: getGetApiV1AuthCollectionSimpleQueryKey(),
        });
        if (variables?.data?.collection_id) {
          queryClient.invalidateQueries({
            queryKey: getGetApiV1AuthCollectionCollectionIdItemsQueryKey(
              variables.data.collection_id,
            ),
          });
        }
      },
    },
  });

  return {
    ...mutation,
    mutate: (body: DeleteApiV1AuthCollectionItemsBody) =>
      mutation.mutate({ data: body }),
    variables: mutation.variables?.data,
  };
}
