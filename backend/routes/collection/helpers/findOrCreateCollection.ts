import type { SupabaseClient } from "@supabase/supabase-js";

export async function findOrCreateCollection(
  supabase: SupabaseClient,
  userId: string,
  name: string,
  isPinned: boolean,
): Promise<
  | { id: string; isNew: boolean }
  | { error: string; details?: string; code?: string }
> {
  const { data: existing } = await supabase
    .from("collections")
    .select("id")
    .eq("user_id", userId)
    .ilike("name", name)
    .maybeSingle();

  if (existing) {
    return { id: existing.id, isNew: false };
  }

  const name_normalized = name.toLowerCase();
  const { data: newCollection, error: createError } = await supabase
    .from("collections")
    .insert({
      user_id: userId,
      name,
      name_normalized,
      is_pinned: isPinned,
    })
    .select("id")
    .single();

  if (createError) {
    return {
      error: "Failed to create collection",
      details: createError.message,
      code: createError.code,
    };
  }

  return { id: newCollection.id, isNew: true };
}

/**
 * Will try this out later
 */

/**
 * 
 *  export async function findOrCreateCollection(
   supabase: SupabaseClient,
   userId: string,
   name: string,
   isPinned: boolean,
 ): Promise<{ id: string; isNew: boolean } | { error: string }> {
-  const { data: existing } = await supabase
-    .from("collections")
-    .select("id")
-    .eq("user_id", userId)
-    .ilike("name", name)
-    .maybeSingle();
-
-  if (existing) {
-    return { id: existing.id, isNew: false };
-  }
-
   const name_normalized = name.toLowerCase();
-  const { data: newCollection, error: createError } = await supabase
+  
+  // First, try to find existing
+  const { data: existing } = await supabase
     .from("collections")
+    .select("id")
+    .eq("user_id", userId)
+    .eq("name_normalized", name_normalized)
+    .maybeSingle();
+
+  if (existing) {
+    return { id: existing.id, isNew: false };
+  }
+
+  // Use INSERT with ON CONFLICT handling in raw SQL or implement retry logic
+  const { data: newCollection, error: createError } = await supabase
+    .from("collections")
     .insert({
       user_id: userId,
       name,
       name_normalized,
       is_pinned: isPinned,
     })
     .select("id")
     .single();

   if (createError) {
+    // If unique constraint violation, retry the select
+    if (createError.code === '23505') {
+      const { data: retry } = await supabase
+        .from("collections")
+        .select("id")
+        .eq("user_id", userId)
+        .eq("name_normalized", name_normalized)
+        .maybeSingle();
+      
+      if (retry) {
+        return { id: retry.id, isNew: false };
+      }
+    }
     return { error: "Failed to create collection" };
   }

   return { id: newCollection.id, isNew: true };
 }
 */
