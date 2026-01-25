/**
 * Hook for creating a new collection
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { COLLECTION_KEYS } from "../collections.constants";
import { createCollection } from "../lib/collections-api";
import type {
  CollectionsSimpleResponse,
  CreateCollectionBody,
  CreateCollectionResponse,
} from "../collections.types";

interface UseCreateCollectionOptions {
  onSuccess?: (data: CreateCollectionResponse) => void;
  onError?: (error: Error) => void;
}

export function useCreateCollection(options: UseCreateCollectionOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateCollectionBody) => createCollection(body),

    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: COLLECTION_KEYS.all });

      const previousCollections =
        queryClient.getQueryData<CollectionsSimpleResponse>(
          COLLECTION_KEYS.simple(),
        );

      // Optimistically add the new collection
      if (previousCollections) {
        const optimisticCollection = {
          id: `temp-${Date.now()}`,
          name: variables.name,
          is_pinned: variables.is_pinned ?? false,
          position: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          item_count: 0,
        };

        queryClient.setQueryData<CollectionsSimpleResponse>(
          COLLECTION_KEYS.simple(),
          {
            ...previousCollections,
            data: [optimisticCollection, ...previousCollections.data],
          },
        );
      }

      return { previousCollections };
    },

    onError: (error, _variables, context) => {
      if (context?.previousCollections) {
        queryClient.setQueryData(
          COLLECTION_KEYS.simple(),
          context.previousCollections,
        );
      }

      toast.error("Failed to create collection", {
        description: error.message,
      });

      options.onError?.(error);
    },

    onSuccess: (data) => {
      toast.success(`Created "${data.name}"`);
      options.onSuccess?.(data);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: COLLECTION_KEYS.all });
    },
  });
}
