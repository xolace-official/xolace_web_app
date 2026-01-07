import type { SupabaseClient } from "@supabase/supabase-js";

export async function findOrCreateCollection(
  supabase: SupabaseClient,
  userId: string,
  name: string,
  isPinned: boolean,
): Promise<{ id: string; isNew: boolean } | { error: string }> {
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
    return { error: "Failed to create collection" };
  }

  return { id: newCollection.id, isNew: true };
}
