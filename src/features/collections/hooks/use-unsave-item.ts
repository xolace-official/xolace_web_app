/**
 * Hook for removing an item from a collection with optimistic updates
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { COLLECTION_KEYS } from "../collections.constants";
import { unsaveItem } from "../lib/collections-api";
import type {
  CollectionItemsResponse,
  CollectionsSimpleResponse,
  UnsaveItemBody,
} from "../collections.types";

interface UseUnsaveItemOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useUnsaveItem(options: UseUnsaveItemOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UnsaveItemBody) => unsaveItem(body),

    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: COLLECTION_KEYS.all });

      // Snapshot previous values
      const previousCollections =
        queryClient.getQueryData<CollectionsSimpleResponse>(
          COLLECTION_KEYS.simple(),
        );

      // Get all matching item queries to update
      const itemsQueryKey = COLLECTION_KEYS.items(variables.collection_id, {});

      // Optimistically update collection item count
      if (previousCollections) {
        queryClient.setQueryData<CollectionsSimpleResponse>(
          COLLECTION_KEYS.simple(),
          {
            ...previousCollections,
            data: previousCollections.data.map((collection) =>
              collection.id === variables.collection_id
                ? {
                    ...collection,
                    item_count: Math.max(0, collection.item_count - 1),
                  }
                : collection,
            ),
          },
        );
      }

      // Optimistically remove item from items list
      queryClient.setQueriesData<CollectionItemsResponse>(
        { queryKey: itemsQueryKey, exact: false },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter(
              (item) =>
                !(
                  item.entity_type === variables.entity_type &&
                  item.entity_id === variables.entity_id
                ),
            ),
            meta: {
              ...old.meta,
              totalCount: Math.max(0, old.meta.totalCount - 1),
            },
          };
        },
      );

      return { previousCollections };
    },

    onError: (error, _variables, context) => {
      // Rollback
      if (context?.previousCollections) {
        queryClient.setQueryData(
          COLLECTION_KEYS.simple(),
          context.previousCollections,
        );
      }

      toast.error("Failed to remove item", {
        description: error.message,
      });

      options.onError?.(error);
    },

    onSuccess: () => {
      toast.success("Item removed");
      options.onSuccess?.();
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: COLLECTION_KEYS.all });
    },
  });
}
