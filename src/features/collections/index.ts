/**
 * Collections feature - public exports
 */

// Types
export type {
  CollectionEntityType,
  CollectionListItem,
  CollectionDetail,
  CollectionItemReference,
  CollectionItemHydrated,
  HydratedPost,
  HydratedVideo,
  HydratedVoice,
  HydratedEntity,
  CollectionsResponse,
  CollectionsSimpleResponse,
  CollectionItemsResponse,
  CreateCollectionBody,
  CreateCollectionResponse,
  SaveItemBody,
  SaveItemResponse,
  UnsaveItemBody,
  PaginationMeta,
} from "./collections.types";

// Constants
export {
  COLLECTION_KEYS,
  COLLECTIONS_API_BASE,
  DEFAULT_PAGE_SIZE,
  DEFAULT_SIDEBAR_LIMIT,
  MAX_COLLECTION_NAME_LENGTH,
  DRAWER_STEPS,
} from "./collections.constants";
export type { DrawerStep } from "./collections.constants";

// Hooks
export { useCollections } from "./hooks/use-collections";
export { useCollectionItems } from "./hooks/use-collection-items";
export { useSaveItem } from "./hooks/use-save-item";
export { useUnsaveItem } from "./hooks/use-unsave-item";
export { useCreateCollection } from "./hooks/use-create-collection";
export { useDeleteCollection } from "./hooks/use-delete-collection";

// Context
export {
  SaveToCollectionProvider,
  useSaveToCollection,
} from "./context/save-to-collection-context";

// Components
export { SaveToCollectionDrawer } from "./components/save-to-collection-drawer";
export { CollectionListItem as CollectionListItemRow } from "./components/collection-list-item";
export { CreateCollectionForm } from "./components/create-collection-form";
export { CollectionCard } from "./components/collection-card";
export { CollectionEmptyState } from "./components/collection-empty-state";
export {
  CollectionCardSkeleton,
  CollectionSkeletonGrid,
} from "./components/collection-skeleton";
export { CollectionHeader } from "./components/collection-header";
export { CollectionItemsList } from "./components/collection-items-list";
export { CollectionTypeFilter } from "./components/collection-type-filter";
export type { FilterOption } from "./components/collection-type-filter";

// Schema
export { createCollectionSchema } from "./collections.schema";
export type { CreateCollectionFormValues } from "./collections.schema";

// API (for direct use if needed)
export {
  fetchCollections,
  fetchCollectionsSimple,
  fetchCollectionItems,
  createCollection,
  saveItem,
  unsaveItem,
  deleteCollection,
} from "./lib/collections-api";
