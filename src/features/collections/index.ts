/**
 * Collections feature - public exports
 */

export type { DrawerStep } from "./collections.constants";

// Constants
export {
  COLLECTION_KEYS,
  COLLECTIONS_API_BASE,
  DEFAULT_PAGE_SIZE,
  DEFAULT_SIDEBAR_LIMIT,
  DRAWER_STEPS,
  MAX_COLLECTION_NAME_LENGTH,
} from "./collections.constants";
export type { CreateCollectionFormValues } from "./collections.schema";
// Schema
export { createCollectionSchema } from "./collections.schema";
// Types
export type {
  CollectionDetail,
  CollectionEntityType,
  CollectionItemHydrated,
  CollectionItemReference,
  CollectionItemsResponse,
  CollectionListItem,
  CollectionsResponse,
  CollectionsSimpleResponse,
  CreateCollectionBody,
  CreateCollectionResponse,
  HydratedEntity,
  HydratedPost,
  HydratedVideo,
  HydratedVoice,
  PaginationMeta,
  SaveItemBody,
  SaveItemResponse,
  UnsaveItemBody,
} from "./collections.types";
export { CollectionCard } from "./components/collection-card";
export { CollectionDetailContent } from "./components/collection-detail-content";
export { CollectionEmptyState } from "./components/collection-empty-state";
export { CollectionHeader } from "./components/collection-header";
export { CollectionItemsList } from "./components/collection-items-list";
export { CollectionListItem as CollectionListItemRow } from "./components/collection-list-item";
export {
  CollectionCardSkeleton,
  CollectionSkeletonGrid,
} from "./components/collection-skeleton";
export type { FilterOption } from "./components/collection-type-filter";
export { CollectionTypeFilter } from "./components/collection-type-filter";
export { CollectionsGrid } from "./components/collections-grid";
export { CreateCollectionForm } from "./components/create-collection-form";
// Components
export { SaveToCollectionDrawer } from "./components/save-to-collection-drawer";
// Context
export {
  SaveToCollectionProvider,
  useSaveToCollection,
} from "./context/save-to-collection-context";
export { useCollectionItems } from "./hooks/use-collection-items";
// Hooks
export { useCollections } from "./hooks/use-collections";
export { useCreateCollection } from "./hooks/use-create-collection";
export { useDeleteCollection } from "./hooks/use-delete-collection";
export { useSaveItem } from "./hooks/use-save-item";
export { useUnsaveItem } from "./hooks/use-unsave-item";
