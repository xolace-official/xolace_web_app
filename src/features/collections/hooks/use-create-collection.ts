/**
 * Hook for creating a new collection using the generated api-client.
 */

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getGetApiV1AuthCollectionQueryKey,
  getGetApiV1AuthCollectionSimpleQueryKey,
  type PostApiV1AuthCollection201,
  usePostApiV1AuthCollection,
} from "@/api-client";
import { useAuthHeaders } from "@/features/campfires/campfire-api-utils";
import { useAppStore } from "@/providers/app-store-provider";

interface UseCreateCollectionOptions {
  onSuccess?: (data: PostApiV1AuthCollection201) => void;
  onError?: (error: unknown) => void;
}

export function useCreateCollection(options: UseCreateCollectionOptions = {}) {
  const queryClient = useQueryClient();
  const session = useAppStore((s) => s.session);
  const authHeaders = useAuthHeaders(session.access_token);

  const mutation = usePostApiV1AuthCollection({
    fetch: authHeaders,
    mutation: {
      onSuccess: (response) => {
        if (response.status === 201) {
          toast.success(`Created "${response.data.name}"`);
          options.onSuccess?.(response.data);
        }
      },
      onError: (error) => {
        toast.error("Failed to create collection", {
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
    mutate: (body: { name: string; is_pinned?: boolean }) =>
      mutation.mutate({ data: body }),
  };
}
