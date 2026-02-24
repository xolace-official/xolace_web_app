/**
 * Hook for saving an item to a collection using the generated api-client.
 */

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getGetApiV1AuthCollectionQueryKey,
  getGetApiV1AuthCollectionSimpleQueryKey,
  type PostApiV1AuthCollectionItemsBody,
  usePostApiV1AuthCollectionItems,
} from "@/api-client";
import { useAuthHeaders } from "@/features/campfires/campfire-api-utils";
import { useAppStore } from "@/providers/app-store-provider";

interface UseSaveItemOptions {
  onSuccess?: (data: {
    collection_item_id: string;
    collection_id: string;
    collection_name: string;
    is_new_collection: boolean;
    already_saved: boolean;
  }) => void;
  onError?: (error: unknown) => void;
}

export function useSaveItem(options: UseSaveItemOptions = {}) {
  const queryClient = useQueryClient();
  const session = useAppStore((s) => s.session);
  const authHeaders = useAuthHeaders(session.access_token);

  const mutation = usePostApiV1AuthCollectionItems({
    fetch: authHeaders,
    mutation: {
      onSuccess: (response) => {
        if (response.status === 200) {
          const { data } = response;
          if (data.already_saved) {
            toast.info(`Already in ${data.collection_name}`);
          } else {
            toast.success(`Saved to ${data.collection_name}`);
          }
          options.onSuccess?.(data);
        }
      },
      onError: (error) => {
        toast.error("Failed to save item", {
          description:
            error && typeof error === "object" && "message" in error
              ? (error as { message: string }).message
              : "Something went wrong",
        });
        options.onError?.(error);
      },
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: getGetApiV1AuthCollectionQueryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: getGetApiV1AuthCollectionSimpleQueryKey(),
        });
      },
    },
  });

  return {
    ...mutation,
    mutate: (body: PostApiV1AuthCollectionItemsBody) =>
      mutation.mutate({ data: body }),
  };
}
