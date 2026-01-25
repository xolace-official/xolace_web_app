/**
 * Hook for deleting a collection
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { COLLECTION_KEYS } from "../collections.constants";
import { deleteCollection } from "../lib/collections-api";
import type { CollectionsSimpleResponse } from "../collections.types";

interface UseDeleteCollectionOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useDeleteCollection(options: UseDeleteCollectionOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (collectionId: string) => deleteCollection(collectionId),

    onMutate: async (collectionId) => {
      await queryClient.cancelQueries({ queryKey: COLLECTION_KEYS.all });

      const previousCollections =
        queryClient.getQueryData<CollectionsSimpleResponse>(
          COLLECTION_KEYS.simple(),
        );

      // Optimistically remove the collection
      if (previousCollections) {
        queryClient.setQueryData<CollectionsSimpleResponse>(
          COLLECTION_KEYS.simple(),
          {
            ...previousCollections,
            data: previousCollections.data.filter(
              (collection) => collection.id !== collectionId,
            ),
          },
        );
      }

      return { previousCollections };
    },

    onError: (error, _collectionId, context) => {
      if (context?.previousCollections) {
        queryClient.setQueryData(
          COLLECTION_KEYS.simple(),
          context.previousCollections,
        );
      }

      toast.error("Failed to delete collection", {
        description: error.message,
      });

      options.onError?.(error);
    },

    onSuccess: () => {
      toast.success("Collection deleted");
      options.onSuccess?.();
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: COLLECTION_KEYS.all });
    },
  });
}
