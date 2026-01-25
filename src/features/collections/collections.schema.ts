import { z } from "zod";
import { MAX_COLLECTION_NAME_LENGTH } from "./collections.constants";

export const createCollectionSchema = z.object({
  name: z
    .string()
    .min(1, "Collection name is required")
    .max(
      MAX_COLLECTION_NAME_LENGTH,
      `Name must not exceed ${MAX_COLLECTION_NAME_LENGTH} characters`,
    ),
  is_pinned: z.boolean().default(false),
});

export type CreateCollectionFormValues = z.input<typeof createCollectionSchema>;
