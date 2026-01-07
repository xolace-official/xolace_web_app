import type { AppRouteHandler } from "@backend/types";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import type { z } from "zod";

import type {
  CreateCollectionRoute,
  DeleteCollectionRoute,
  GetCollectionItemsRoute,
  GetCollectionsRoute,
  GetCollectionsSimpleRoute,
  SaveItemRoute,
  UnsaveItemRoute,
} from "./collection.routes";
import type {
  CollectionEntityType,
  collectionItemsResponse,
  collectionsResponse,
  collectionsSimpleResponse,
  createCollectionResponse,
  saveItemResponse,
} from "./collection.validation";

import { findOrCreateCollection } from "./helpers/findOrCreateCollection";

// =============================================================================
// Constants
// =============================================================================

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 50;
const DEFAULT_SIDEBAR_LIMIT = 5;

// =============================================================================
// GET /collections - Paginated list of user's collections
// =============================================================================

export const getCollections: AppRouteHandler<GetCollectionsRoute> = async (
  c,
) => {
  const userId = c.get("userId");
  const supabase = c.get("supabase");

  const { limit, pinned_only, page, page_size } = c.req.valid("query");

  const pageNumber = Number(page);
  const pageSize = Math.min(
    Number(page_size) || DEFAULT_PAGE_SIZE,
    MAX_PAGE_SIZE,
  );

  try {
    // Build base query with item count subquery
    let query = supabase
      .from("collections")
      .select(
        `
        id,
        name,
        is_pinned,
        position,
        created_at,
        updated_at,
        item_count:collection_items(count)
      `,
        { count: "exact", head: false },
      )
      .eq("user_id", userId);

    // ─────────────────────────────────────────────
    // Filters
    // ─────────────────────────────────────────────

    if (pinned_only === true) {
      query = query.eq("is_pinned", true);
    }

    // ─────────────────────────────────────────────
    // Ordering (pinned first, then position, then newest)
    // ─────────────────────────────────────────────

    query = query
      .order("is_pinned", { ascending: false })
      .order("position", { ascending: true })
      .order("created_at", { ascending: false });

    // ─────────────────────────────────────────────
    // Pagination
    // ─────────────────────────────────────────────

    // If limit is specified (sidebar mode), use it instead of page_size
    const effectivePageSize = limit ?? pageSize;

    const { data, error, count } = await query.range(
      pageNumber * effectivePageSize,
      pageNumber * effectivePageSize + effectivePageSize - 1,
    );

    if (error) {
      console.error("getCollections error:", error);
      return c.json(
        { message: "Failed to fetch collections" },
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      );
    }

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / effectivePageSize);

    // Transform data to flatten item_count from Supabase's aggregate format
    const transformedData = (data ?? []).map((collection) => ({
      ...collection,
      item_count: Array.isArray(collection.item_count)
        ? (collection.item_count[0]?.count ?? 0)
        : 0,
    }));

    const response: z.infer<typeof collectionsResponse> = {
      data: transformedData,
      meta: {
        totalCount,
        currentPage: pageNumber,
        pageSize: effectivePageSize,
        hasNextPage: pageNumber < totalPages - 1,
      },
    };

    return c.json(response, HttpStatusCodes.OK);
  } catch (err) {
    console.error("getCollections exception:", err);
    return c.json(
      { message: HttpStatusPhrases.INTERNAL_SERVER_ERROR },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

// =============================================================================
// GET /collections/simple - Simple list for sidebar (no pagination metadata)
// =============================================================================

export const getCollectionsSimple: AppRouteHandler<
  GetCollectionsSimpleRoute
> = async (c) => {
  const userId = c.get("userId");
  const supabase = c.get("supabase");

  const { limit, pinned_only } = c.req.valid("query");

  const effectiveLimit = limit ?? DEFAULT_SIDEBAR_LIMIT;

  try {
    let query = supabase
      .from("collections")
      .select(
        `
        id,
        name,
        is_pinned,
        position,
        created_at,
        updated_at,
        item_count:collection_items(count)
      `,
      )
      .eq("user_id", userId);

    if (pinned_only === true) {
      query = query.eq("is_pinned", true);
    }

    query = query
      .order("is_pinned", { ascending: false })
      .order("position", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(effectiveLimit);

    const { data, error } = await query;

    if (error) {
      console.error("getCollectionsSimple error:", error);
      return c.json(
        { message: "Failed to fetch collections" },
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      );
    }

    // Transform data to flatten item_count
    const transformedData = (data ?? []).map((collection) => ({
      ...collection,
      item_count: Array.isArray(collection.item_count)
        ? (collection.item_count[0]?.count ?? 0)
        : 0,
    }));

    const response: z.infer<typeof collectionsSimpleResponse> = {
      data: transformedData,
    };

    return c.json(response, HttpStatusCodes.OK);
  } catch (err) {
    console.error("getCollectionsSimple exception:", err);
    return c.json(
      { message: HttpStatusPhrases.INTERNAL_SERVER_ERROR },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

// =============================================================================
// GET /collections/:collectionId/items - Collection items with hydrated entities
// =============================================================================

export const getCollectionItems: AppRouteHandler<
  GetCollectionItemsRoute
> = async (c) => {
  const userId = c.get("userId");
  const supabase = c.get("supabase");
  const { collectionId } = c.req.param();
  const { entity_type, page, page_size } = c.req.valid("query");

  const pageNumber = Number(page);
  const pageSize = Math.min(
    Number(page_size) || DEFAULT_PAGE_SIZE,
    MAX_PAGE_SIZE,
  );

  try {
    // ─────────────────────────────────────────────
    // Step 1: Verify collection ownership
    // ─────────────────────────────────────────────

    const { data: collection, error: collectionError } = await supabase
      .from("collections")
      .select("id, name, is_pinned, position, created_at, updated_at")
      .eq("id", collectionId)
      .eq("user_id", userId)
      .maybeSingle();

    if (collectionError) {
      console.error("getCollectionItems collection error:", collectionError);
      return c.json(
        { message: "Failed to fetch collection" },
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      );
    }

    if (!collection) {
      return c.json(
        { message: "Collection not found" },
        HttpStatusCodes.NOT_FOUND,
      );
    }

    // ─────────────────────────────────────────────
    // Step 2: Fetch collection items
    // ─────────────────────────────────────────────

    let itemsQuery = supabase
      .from("collection_items")
      .select(
        `
        id,
        entity_type,
        entity_id,
        is_pinned,
        position,
        created_at
      `,
        { count: "exact" },
      )
      .eq("collection_id", collectionId);

    if (entity_type) {
      itemsQuery = itemsQuery.eq("entity_type", entity_type);
    }

    itemsQuery = itemsQuery
      .order("is_pinned", { ascending: false })
      .order("position", { ascending: true })
      .order("created_at", { ascending: false });

    const {
      data: items,
      error: itemsError,
      count,
    } = await itemsQuery.range(
      pageNumber * pageSize,
      pageNumber * pageSize + pageSize - 1,
    );

    if (itemsError) {
      console.error("getCollectionItems items error:", itemsError);
      return c.json(
        { message: "Failed to fetch collection items" },
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      );
    }

    // ─────────────────────────────────────────────
    // Step 3: Group items by entity type
    // ─────────────────────────────────────────────

    const itemsByType = (items ?? []).reduce(
      (acc, item) => {
        const type = item.entity_type as CollectionEntityType;
        if (!acc[type]) {
          acc[type] = [];
        }
        acc[type].push(item.entity_id);
        return acc;
      },
      {} as Record<CollectionEntityType, string[]>,
    );

    // ─────────────────────────────────────────────
    // Step 4: Batch fetch entities by type
    // ─────────────────────────────────────────────

    const entityMap = new Map<string, Record<string, unknown>>();

    // Fetch posts (includes voice posts with post_kind = 'voice')
    if (itemsByType.post?.length || itemsByType.voice?.length) {
      const postIds = [
        ...(itemsByType.post ?? []),
        ...(itemsByType.voice ?? []),
      ];

      const { data: posts } = await supabase
        .from("posts")
        .select(
          `
          id,
          content_text,
          author_id,
          author_name_snapshot,
          author_avatar_snapshot,
          post_kind,
          mood,
          created_at,
          upvotes_count,
          downvotes_count
        `,
        )
        .in("id", postIds)
        .is("deleted_at", null);

      posts?.forEach((post) => {
        entityMap.set(post.id, {
          id: post.id,
          content_text: post.content_text,
          author_id: post.author_id,
          author_name_snapshot: post.author_name_snapshot,
          author_avatar_snapshot: post.author_avatar_snapshot,
          post_kind: post.post_kind,
          mood: post.mood,
          created_at: post.created_at,
          upvotes_count: post.upvotes_count,
          downvotes_count: post.downvotes_count,
        });
      });
    }

    // Fetch videos
    if (itemsByType.video?.length) {
      const { data: videos } = await supabase
        .from("videos")
        .select(
          `
          id,
          bunny_video_id,
          thumbnail_url,
          duration_seconds,
          title,
          description,
          author_profile_id,
          author_display_name,
          author_avatar_url,
          likes_count,
          views_count
        `,
        )
        .in("id", itemsByType.video)
        .eq("is_deleted", false);

      videos?.forEach((video) => {
        entityMap.set(video.id, video);
      });
    }

    // Fetch campfire resources (using campfire_guide_resources table)
    // if (itemsByType.campfire_resource?.length) {
    //   // Note: campfire_guide_resources uses numeric IDs, not UUIDs
    //   // This may need adjustment based on actual entity_id storage format
    //   const { data: resources } = await supabase
    //     .from("campfire_guide_resources")
    //     .select(
    //       `
    //       id,
    //       label,
    //       url,
    //       campfire_id,
    //       sort_order
    //     `,
    //     )
    //     .in("id", itemsByType.campfire_resource);

    //   resources?.forEach((resource) => {
    //     // Convert numeric ID to string for consistent map key
    //     entityMap.set(String(resource.id), {
    //       id: resource.id,
    //       label: resource.label,
    //       url: resource.url,
    //       campfire_id: resource.campfire_id,
    //       sort_order: resource.sort_order,
    //     });
    //   });
    // }

    // ─────────────────────────────────────────────
    // Step 5: Hydrate items and filter orphans
    // ─────────────────────────────────────────────

    // Type for hydrated entity - matches the union in validation schema
    type HydratedEntity = z.infer<
      typeof collectionItemsResponse
    >["data"][number]["entity"];

    const hydratedItems = (items ?? [])
      .map((item) => {
        const entity = entityMap.get(item.entity_id) ?? null;
        return {
          id: item.id,
          entity_type: item.entity_type as CollectionEntityType,
          entity_id: item.entity_id,
          is_pinned: item.is_pinned,
          position: item.position,
          created_at: item.created_at,
          // Cast entity to the hydrated entity union type
          entity: entity as HydratedEntity,
        };
      })
      // Filter out orphaned items (entity was deleted)
      .filter((item) => item.entity !== null);

    // ─────────────────────────────────────────────
    // Step 6: Build response
    // ─────────────────────────────────────────────

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / pageSize);

    const response: z.infer<typeof collectionItemsResponse> = {
      collection: {
        id: collection.id,
        name: collection.name,
        is_pinned: collection.is_pinned,
        position: collection.position,
        created_at: collection.created_at,
        updated_at: collection.updated_at,
      },
      data: hydratedItems,
      meta: {
        totalCount,
        currentPage: pageNumber,
        pageSize,
        hasNextPage: pageNumber < totalPages - 1,
      },
    };

    return c.json(response, HttpStatusCodes.OK);
  } catch (err) {
    console.error("getCollectionItems exception:", err);
    return c.json(
      { message: HttpStatusPhrases.INTERNAL_SERVER_ERROR },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

// =============================================================================
// POST /collections - Create a new collection
// =============================================================================

export const createCollection: AppRouteHandler<CreateCollectionRoute> = async (
  c,
) => {
  const userId = c.get("userId");
  const supabase = c.get("supabase");
  const body = c.req.valid("json");

  const { name, is_pinned } = body;
  const name_normalized = name.toLowerCase();

  try {
    const { data: collection, error } = await supabase
      .from("collections")
      .insert({
        user_id: userId,
        name,
        name_normalized,
        is_pinned: is_pinned ?? false,
      })
      .select()
      .single();

    if (error) {
      console.error("createCollection error:", error);
      return c.json(
        { message: "Failed to create collection" },
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      );
    }

    const response: z.infer<typeof createCollectionResponse> = {
      id: collection.id,
      name: collection.name,
      name_normalized: collection.name_normalized,
      is_pinned: collection.is_pinned,
      position: collection.position,
      created_at: collection.created_at,
      updated_at: collection.updated_at,
    };

    return c.json(response, HttpStatusCodes.CREATED);
  } catch (err) {
    console.error("createCollection exception:", err);
    return c.json(
      { message: HttpStatusPhrases.INTERNAL_SERVER_ERROR },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

// =============================================================================
// POST /collections/items - Save item to collection
// =============================================================================

export const saveItem: AppRouteHandler<SaveItemRoute> = async (c) => {
  const userId = c.get("userId");
  const supabase = c.get("supabase");
  const body = c.req.valid("json");

  try {
    let collectionId = body.collection_id;
    let collectionName = body.collection_name;
    let isNewCollection = false;

    // ─────────────────────────────────────────────
    // Step 1: Resolve Collection ID
    // ─────────────────────────────────────────────

    if (collectionId) {
      // Case 1: Saving to specific collection ID
      // Verify ownership
      const { data: existing, error: findError } = await supabase
        .from("collections")
        .select("id, name")
        .eq("id", collectionId)
        .eq("user_id", userId)
        .single();

      if (findError || !existing) {
        return c.json(
          {
            message:
              "Collection not found - cannot save to non-existent collection",
          },
          HttpStatusCodes.BAD_REQUEST,
        );
      }
      collectionName = existing.name;
    } else if (collectionName) {
      // Case 2: Saving to specific collection Name (find or create)
      const result = await findOrCreateCollection(
        supabase,
        userId,
        collectionName,
        false,
      );

      if ("error" in result) {
        console.error("saveItem create collection error:", result.error, {
          details: result.details,
          code: result.code,
        });
        return c.json(
          { message: "Failed to create collection" },
          HttpStatusCodes.INTERNAL_SERVER_ERROR,
        );
      }

      collectionId = result.id;
      isNewCollection = result.isNew;
    } else {
      // Case 3: Default "Favorites" collection
      const result = await findOrCreateCollection(
        supabase,
        userId,
        "Favorites",
        true,
      );

      if ("error" in result) {
        console.error("saveItem create favorites error:", result.error, {
          details: result.details,
          code: result.code,
        });
        return c.json(
          { message: "Failed to create default collection" },
          HttpStatusCodes.INTERNAL_SERVER_ERROR,
        );
      }
      collectionId = result.id;
      isNewCollection = result.isNew;
      collectionName = "Favorites";
    }

    if (!collectionId || !collectionName) {
      // Should be unreachable
      return c.json(
        { message: "Failed to resolve collection" },
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      );
    }

    // ─────────────────────────────────────────────
    // Step 2: Insert Item
    // ─────────────────────────────────────────────

    // Check if checks already exists to avoid unique constraint violation if not using upsert
    // Or just use upsert/onConflict
    // Using simple insert + ignore or select first approach.
    // Let's use select first to return "already_saved" correctly.

    const { data: existingItem } = await supabase
      .from("collection_items")
      .select("id")
      .eq("collection_id", collectionId)
      .eq("entity_type", body.entity_type)
      .eq("entity_id", body.entity_id)
      .maybeSingle();

    let collectionItemId: string;
    let alreadySaved = false;

    if (existingItem) {
      collectionItemId = existingItem.id;
      alreadySaved = true;
    } else {
      const { data: newItem, error: insertError } = await supabase
        .from("collection_items")
        .insert({
          user_id: userId,
          collection_id: collectionId,
          entity_type: body.entity_type,
          entity_id: body.entity_id,
        })
        .select("id")
        .single();

      if (insertError) {
        console.error("saveItem insert error:", insertError);
        return c.json(
          { message: "Failed to save item" },
          HttpStatusCodes.INTERNAL_SERVER_ERROR,
        );
      }
      collectionItemId = newItem.id;
    }

    const response: z.infer<typeof saveItemResponse> = {
      collection_item_id: collectionItemId,
      collection_id: collectionId,
      collection_name: collectionName,
      is_new_collection: isNewCollection,
      already_saved: alreadySaved,
    };

    return c.json(response, HttpStatusCodes.OK);
  } catch (err) {
    console.error("saveItem exception:", err);
    return c.json(
      { message: HttpStatusPhrases.INTERNAL_SERVER_ERROR },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

// =============================================================================
// DELETE /collections/items - Unsave item from collection
// =============================================================================

export const unsaveItem: AppRouteHandler<UnsaveItemRoute> = async (c) => {
  const userId = c.get("userId");
  const supabase = c.get("supabase");
  const body = c.req.valid("json");

  try {
    // ─────────────────────────────────────────────
    // Step 1: Verify Collection Ownership
    // ─────────────────────────────────────────────
    const { data: collection, error: findError } = await supabase
      .from("collections")
      .select("id")
      .eq("id", body.collection_id)
      .eq("user_id", userId)
      .single();

    if (findError || !collection) {
      // Return 404 to avoid leaking collection existence or if it genuinely doesn't exist
      return c.json(
        { message: "Collection not found" },
        HttpStatusCodes.NOT_FOUND,
      );
    }

    // ─────────────────────────────────────────────
    // Step 2: Delete Item
    // ─────────────────────────────────────────────
    const { error } = await supabase
      .from("collection_items")
      .delete()
      .eq("collection_id", body.collection_id)
      .eq("entity_type", body.entity_type)
      .eq("entity_id", body.entity_id);

    if (error) {
      console.error("unsaveItem error:", error);
      return c.json(
        { message: "Failed to unsave item" },
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      );
    }

    return c.json({ message: "Item removed successfully" }, HttpStatusCodes.OK);
  } catch (err) {
    console.error("unsaveItem exception:", err);
    return c.json(
      { message: HttpStatusPhrases.INTERNAL_SERVER_ERROR },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

// =============================================================================
// DELETE /collections/:collectionId - Delete collection
// =============================================================================

export const deleteCollection: AppRouteHandler<DeleteCollectionRoute> = async (
  c,
) => {
  const userId = c.get("userId");
  const supabase = c.get("supabase");
  const { collectionId } = c.req.param();

  try {
    // Verify ownership and existence
    const { data: collection, error: findError } = await supabase
      .from("collections")
      .select("id")
      .eq("id", collectionId)
      .eq("user_id", userId)
      .single();

    if (findError || !collection) {
      return c.json(
        { message: "Collection not found" },
        HttpStatusCodes.NOT_FOUND,
      );
    }

    // Delete collection (cascade should handle items)
    const { error: deleteError } = await supabase
      .from("collections")
      .delete()
      .eq("id", collectionId);

    if (deleteError) {
      console.error("deleteCollection error:", deleteError);
      return c.json(
        { message: "Failed to delete collection" },
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      );
    }

    return c.json(
      { message: "Collection deleted successfully" },
      HttpStatusCodes.OK,
    );
  } catch (err) {
    console.error("deleteCollection exception:", err);
    return c.json(
      { message: HttpStatusPhrases.INTERNAL_SERVER_ERROR },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};
