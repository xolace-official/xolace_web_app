import type { Database } from "@/lib/supabase/types_db";

export type PostMood = Database["public"]["Enums"]["post_mood"];
export type PostKind = Database["public"]["Enums"]["post_kind"];
export type AuthorDisplayMode =
  Database["public"]["Enums"]["author_display_mode"];

export interface CampfireSelection {
  id: string;
  name: string;
  slug: string;
  iconUrl: string | null;
}

export interface MoodOption {
  value: PostMood;
  label: string;
  emoji: string;
}

export interface StarterPrompt {
  id: string;
  text: string;
}

export interface ComposerFormValues {
  content_text: string;
  mood: PostMood;
  author_display_mode: AuthorDisplayMode;
  is_sensitive: boolean;
  auto_expiry: boolean;
  campfire_id: string | null;
}
