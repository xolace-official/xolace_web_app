/**
 * Hook for saving an item to a collection with optimistic updates
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { COLLECTION_KEYS } from "../collections.constants";
import { saveItem } from "../lib/collections-api";
import type {
  CollectionsSimpleResponse,
  SaveItemBody,
  SaveItemResponse,
} from "../collections.types";

interface UseSaveItemOptions {
  onSuccess?: (data: SaveItemResponse) => void;
  onError?: (error: Error) => void;
}

export function useSaveItem(options: UseSaveItemOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: SaveItemBody) => saveItem(body),

    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: COLLECTION_KEYS.all });

      // Snapshot the previous value
      const previousCollections =
        queryClient.getQueryData<CollectionsSimpleResponse>(
          COLLECTION_KEYS.simple(),
        );

      // Optimistically update collection item count if we know the collection_id
      if (variables.collection_id && previousCollections) {
        queryClient.setQueryData<CollectionsSimpleResponse>(
          COLLECTION_KEYS.simple(),
          {
            ...previousCollections,
            data: previousCollections.data.map((collection) =>
              collection.id === variables.collection_id
                ? { ...collection, item_count: collection.item_count + 1 }
                : collection,
            ),
          },
        );
      }

      return { previousCollections };
    },

    onError: (error, _variables, context) => {
      // Rollback to the previous value
      if (context?.previousCollections) {
        queryClient.setQueryData(
          COLLECTION_KEYS.simple(),
          context.previousCollections,
        );
      }

      toast.error("Failed to save item", {
        description: error.message,
      });

      options.onError?.(error);
    },

    onSuccess: (data) => {
      if (data.already_saved) {
        toast.info(`Already in ${data.collection_name}`);
      } else {
        toast.success(`Saved to ${data.collection_name}`);
      }

      options.onSuccess?.(data);
    },

    onSettled: () => {
      // Always refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: COLLECTION_KEYS.all });
    },
  });
}
