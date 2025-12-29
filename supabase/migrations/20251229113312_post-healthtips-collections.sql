create extension if not exists "citext" with schema "public";

create type "public"."author_display_mode" as enum ('attributed', 'anonymous');

create type "public"."health_tip_sensitivity" as enum ('general', 'mild', 'sensitive');

create type "public"."health_tip_source_type" as enum ('url', 'paper', 'book', 'organization');

create type "public"."health_tip_status" as enum ('draft', 'in_review', 'published', 'rejected', 'archived');

create type "public"."post_kind" as enum ('text', 'text_with_media', 'carousel', 'voice');

create type "public"."post_media_type" as enum ('image');

create type "public"."post_mood" as enum ('neutral', 'happy', 'sad', 'angry', 'grateful', 'melancholy', 'peaceful', 'excited', 'confused', 'thoughtful', 'nostalgic', 'reflecting', 'processing', 'chill', 'energetic', 'motivated', 'venting', 'ranting', 'sharing', 'seeking_advice', 'creative', 'inspired', 'laughing');

create type "public"."vote_type" as enum ('upvote', 'downvote');


  create table "public"."collection_items" (
    "id" uuid not null default gen_random_uuid(),
    "collection_id" uuid not null,
    "user_id" uuid not null,
    "entity_type" text not null,
    "entity_id" uuid not null,
    "is_pinned" boolean not null default false,
    "position" integer not null default 0,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."collection_items" enable row level security;


  create table "public"."collections" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "name" text not null,
    "name_normalized" text not null,
    "is_pinned" boolean not null default false,
    "position" integer not null default 0,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."collections" enable row level security;


  create table "public"."health_tip_categories" (
    "id" uuid not null default gen_random_uuid(),
    "key" text not null,
    "display_name" text not null,
    "sort_order" integer not null default 0,
    "is_active" boolean not null default true,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."health_tip_categories" enable row level security;


  create table "public"."health_tip_sources" (
    "id" uuid not null default gen_random_uuid(),
    "health_tip_id" uuid not null,
    "source_type" public.health_tip_source_type not null,
    "title" text,
    "url" text,
    "publisher" text,
    "published_year" integer,
    "notes" text,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."health_tip_sources" enable row level security;


  create table "public"."health_tips" (
    "id" uuid not null default gen_random_uuid(),
    "title" text not null,
    "slug" text not null,
    "excerpt" text,
    "content" text not null,
    "content_format" text not null default 'markdown'::text,
    "read_time_minutes" integer not null default 5,
    "language_code" text not null default 'en'::text,
    "status" public.health_tip_status not null default 'draft'::public.health_tip_status,
    "published_at" timestamp with time zone,
    "reviewed_at" timestamp with time zone,
    "rejected_reason" text,
    "created_by" uuid,
    "approved_by" uuid,
    "is_sponsored" boolean not null default false,
    "sponsor_label" text,
    "sensitive_level" public.health_tip_sensitivity not null default 'general'::public.health_tip_sensitivity,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "category_id" uuid
      );


alter table "public"."health_tips" enable row level security;


  create table "public"."post_media" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "post_id" uuid not null,
    "created_by" uuid not null,
    "type" public.post_media_type not null default 'image'::public.post_media_type,
    "storage_path" text not null,
    "mime_type" text not null,
    "width" integer,
    "height" integer,
    "file_size" integer,
    "blurhash" text,
    "dominant_hex" text,
    "alt_text" text,
    "sort_order" integer not null default 0
      );


alter table "public"."post_media" enable row level security;


  create table "public"."post_slides" (
    "id" uuid not null default gen_random_uuid(),
    "post_id" uuid not null,
    "slide_index" integer not null,
    "content" text not null,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."post_slides" enable row level security;


  create table "public"."post_tags" (
    "post_id" uuid not null,
    "tag_id" bigint not null,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."post_tags" enable row level security;


  create table "public"."post_views" (
    "post_id" uuid not null,
    "user_id" uuid not null,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."post_views" enable row level security;


  create table "public"."post_votes" (
    "post_id" uuid not null,
    "user_id" uuid not null,
    "vote_type" public.vote_type not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."post_votes" enable row level security;


  create table "public"."posts" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "author_id" uuid not null,
    "campfire_id" uuid,
    "post_kind" public.post_kind not null default 'text'::public.post_kind,
    "content_text" text not null,
    "mood" public.post_mood not null default 'neutral'::public.post_mood,
    "is_sensitive" boolean not null default false,
    "author_display_mode" public.author_display_mode not null default 'attributed'::public.author_display_mode,
    "author_name_snapshot" text not null,
    "author_avatar_snapshot" text,
    "expires_at" timestamp with time zone,
    "deleted_at" timestamp with time zone,
    "deleted_by" uuid,
    "delete_reason" text,
    "media_count" integer not null default 0,
    "hero_media_id" uuid,
    "upvotes_count" integer not null default 0,
    "downvotes_count" integer not null default 0
      );


alter table "public"."posts" enable row level security;


  create table "public"."tags" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "name" public.citext not null,
    "count" integer not null default 0
      );


alter table "public"."tags" enable row level security;

CREATE INDEX collection_items_collection_order_idx ON public.collection_items USING btree (collection_id, is_pinned DESC, "position", created_at DESC);

CREATE UNIQUE INDEX collection_items_pkey ON public.collection_items USING btree (id);

CREATE UNIQUE INDEX collection_items_unique_entity ON public.collection_items USING btree (collection_id, entity_type, entity_id);

CREATE INDEX collection_items_user_entity_idx ON public.collection_items USING btree (user_id, entity_type, entity_id);

CREATE UNIQUE INDEX collections_pkey ON public.collections USING btree (id);

CREATE UNIQUE INDEX collections_user_name_unique ON public.collections USING btree (user_id, name_normalized);

CREATE INDEX collections_user_order_idx ON public.collections USING btree (user_id, is_pinned DESC, "position", created_at DESC);

CREATE UNIQUE INDEX health_tip_categories_key_unique ON public.health_tip_categories USING btree (key);

CREATE UNIQUE INDEX health_tip_categories_pkey ON public.health_tip_categories USING btree (id);

CREATE UNIQUE INDEX health_tip_sources_pkey ON public.health_tip_sources USING btree (id);

CREATE UNIQUE INDEX health_tip_sources_unique_url ON public.health_tip_sources USING btree (health_tip_id, url);

CREATE INDEX health_tips_category_idx ON public.health_tips USING btree (category_id);

CREATE UNIQUE INDEX health_tips_pkey ON public.health_tips USING btree (id);

CREATE INDEX health_tips_published_at_idx ON public.health_tips USING btree (published_at DESC) WHERE (status = 'published'::public.health_tip_status);

CREATE UNIQUE INDEX health_tips_slug_unique ON public.health_tips USING btree (slug);

CREATE INDEX health_tips_status_idx ON public.health_tips USING btree (status);

CREATE INDEX idx_post_media_post_id ON public.post_media USING btree (post_id);

CREATE INDEX idx_post_media_post_order ON public.post_media USING btree (post_id, sort_order);

CREATE INDEX idx_post_slides_post_id ON public.post_slides USING btree (post_id);

CREATE INDEX idx_post_tags_tag_id ON public.post_tags USING btree (tag_id);

CREATE INDEX idx_post_views_post_id ON public.post_views USING btree (post_id);

CREATE INDEX idx_post_views_user_id ON public.post_views USING btree (user_id);

CREATE INDEX idx_post_votes_post_id ON public.post_votes USING btree (post_id);

CREATE INDEX idx_post_votes_user_id ON public.post_votes USING btree (user_id);

CREATE INDEX idx_posts_author_created_at_desc ON public.posts USING btree (author_id, created_at DESC);

CREATE INDEX idx_posts_campfire_created_at_desc ON public.posts USING btree (campfire_id, created_at DESC) WHERE (campfire_id IS NOT NULL);

CREATE INDEX idx_posts_created_at_desc ON public.posts USING btree (created_at DESC);

CREATE INDEX idx_posts_expires_at ON public.posts USING btree (expires_at) WHERE (expires_at IS NOT NULL);

CREATE INDEX idx_posts_not_deleted_created_at_desc ON public.posts USING btree (created_at DESC) WHERE (deleted_at IS NULL);

CREATE UNIQUE INDEX post_media_pkey ON public.post_media USING btree (id);

CREATE UNIQUE INDEX post_slides_pkey ON public.post_slides USING btree (id);

CREATE UNIQUE INDEX post_tags_pkey ON public.post_tags USING btree (post_id, tag_id);

CREATE UNIQUE INDEX post_views_pkey ON public.post_views USING btree (post_id, user_id);

CREATE UNIQUE INDEX post_votes_pkey ON public.post_votes USING btree (post_id, user_id);

CREATE UNIQUE INDEX posts_pkey ON public.posts USING btree (id);

CREATE UNIQUE INDEX tags_pkey ON public.tags USING btree (id);

CREATE UNIQUE INDEX ux_post_media_single_image_per_post ON public.post_media USING btree (post_id) WHERE (type = 'image'::public.post_media_type);

CREATE UNIQUE INDEX ux_post_slides_post_idx ON public.post_slides USING btree (post_id, slide_index);

CREATE UNIQUE INDEX ux_tags_name ON public.tags USING btree (name);

alter table "public"."collection_items" add constraint "collection_items_pkey" PRIMARY KEY using index "collection_items_pkey";

alter table "public"."collections" add constraint "collections_pkey" PRIMARY KEY using index "collections_pkey";

alter table "public"."health_tip_categories" add constraint "health_tip_categories_pkey" PRIMARY KEY using index "health_tip_categories_pkey";

alter table "public"."health_tip_sources" add constraint "health_tip_sources_pkey" PRIMARY KEY using index "health_tip_sources_pkey";

alter table "public"."health_tips" add constraint "health_tips_pkey" PRIMARY KEY using index "health_tips_pkey";

alter table "public"."post_media" add constraint "post_media_pkey" PRIMARY KEY using index "post_media_pkey";

alter table "public"."post_slides" add constraint "post_slides_pkey" PRIMARY KEY using index "post_slides_pkey";

alter table "public"."post_tags" add constraint "post_tags_pkey" PRIMARY KEY using index "post_tags_pkey";

alter table "public"."post_views" add constraint "post_views_pkey" PRIMARY KEY using index "post_views_pkey";

alter table "public"."post_votes" add constraint "post_votes_pkey" PRIMARY KEY using index "post_votes_pkey";

alter table "public"."posts" add constraint "posts_pkey" PRIMARY KEY using index "posts_pkey";

alter table "public"."tags" add constraint "tags_pkey" PRIMARY KEY using index "tags_pkey";

alter table "public"."collection_items" add constraint "collection_items_collection_id_fkey" FOREIGN KEY (collection_id) REFERENCES public.collections(id) ON DELETE CASCADE not valid;

alter table "public"."collection_items" validate constraint "collection_items_collection_id_fkey";

alter table "public"."collection_items" add constraint "collection_items_entity_type_check" CHECK ((entity_type = ANY (ARRAY['post'::text, 'video'::text, 'voice'::text, 'campfire_resource'::text]))) not valid;

alter table "public"."collection_items" validate constraint "collection_items_entity_type_check";

alter table "public"."collection_items" add constraint "collection_items_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."collection_items" validate constraint "collection_items_user_id_fkey";

alter table "public"."collections" add constraint "collections_name_length" CHECK (((char_length(name) >= 1) AND (char_length(name) <= 50))) not valid;

alter table "public"."collections" validate constraint "collections_name_length";

alter table "public"."collections" add constraint "collections_name_normalized_length" CHECK (((char_length(name_normalized) >= 1) AND (char_length(name_normalized) <= 50))) not valid;

alter table "public"."collections" validate constraint "collections_name_normalized_length";

alter table "public"."collections" add constraint "collections_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."collections" validate constraint "collections_user_id_fkey";

alter table "public"."health_tip_categories" add constraint "health_tip_categories_key_unique" UNIQUE using index "health_tip_categories_key_unique";

alter table "public"."health_tip_sources" add constraint "health_tip_sources_health_tip_id_fkey" FOREIGN KEY (health_tip_id) REFERENCES public.health_tips(id) ON DELETE CASCADE not valid;

alter table "public"."health_tip_sources" validate constraint "health_tip_sources_health_tip_id_fkey";

alter table "public"."health_tip_sources" add constraint "health_tip_sources_unique_url" UNIQUE using index "health_tip_sources_unique_url";

alter table "public"."health_tips" add constraint "health_tips_approved_by_fkey" FOREIGN KEY (approved_by) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."health_tips" validate constraint "health_tips_approved_by_fkey";

alter table "public"."health_tips" add constraint "health_tips_category_id_fkey" FOREIGN KEY (category_id) REFERENCES public.health_tip_categories(id) ON DELETE SET NULL not valid;

alter table "public"."health_tips" validate constraint "health_tips_category_id_fkey";

alter table "public"."health_tips" add constraint "health_tips_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."health_tips" validate constraint "health_tips_created_by_fkey";

alter table "public"."health_tips" add constraint "health_tips_publish_check" CHECK ((((status = 'published'::public.health_tip_status) AND (published_at IS NOT NULL)) OR (status <> 'published'::public.health_tip_status))) not valid;

alter table "public"."health_tips" validate constraint "health_tips_publish_check";

alter table "public"."health_tips" add constraint "health_tips_slug_unique" UNIQUE using index "health_tips_slug_unique";

alter table "public"."post_media" add constraint "post_media_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE RESTRICT not valid;

alter table "public"."post_media" validate constraint "post_media_created_by_fkey";

alter table "public"."post_media" add constraint "post_media_mime_type_len" CHECK (((length(mime_type) >= 1) AND (length(mime_type) <= 255))) not valid;

alter table "public"."post_media" validate constraint "post_media_mime_type_len";

alter table "public"."post_media" add constraint "post_media_post_id_fkey" FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE not valid;

alter table "public"."post_media" validate constraint "post_media_post_id_fkey";

alter table "public"."post_media" add constraint "post_media_sort_order_nonnegative" CHECK ((sort_order >= 0)) not valid;

alter table "public"."post_media" validate constraint "post_media_sort_order_nonnegative";

alter table "public"."post_media" add constraint "post_media_storage_path_len" CHECK (((length(storage_path) >= 1) AND (length(storage_path) <= 1024))) not valid;

alter table "public"."post_media" validate constraint "post_media_storage_path_len";

alter table "public"."post_slides" add constraint "post_slides_content_max_len" CHECK ((length(content) <= 500)) not valid;

alter table "public"."post_slides" validate constraint "post_slides_content_max_len";

alter table "public"."post_slides" add constraint "post_slides_index_nonnegative" CHECK ((slide_index >= 0)) not valid;

alter table "public"."post_slides" validate constraint "post_slides_index_nonnegative";

alter table "public"."post_slides" add constraint "post_slides_post_id_fkey" FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE not valid;

alter table "public"."post_slides" validate constraint "post_slides_post_id_fkey";

alter table "public"."post_tags" add constraint "post_tags_post_id_fkey" FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE not valid;

alter table "public"."post_tags" validate constraint "post_tags_post_id_fkey";

alter table "public"."post_tags" add constraint "post_tags_tag_id_fkey" FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON DELETE CASCADE not valid;

alter table "public"."post_tags" validate constraint "post_tags_tag_id_fkey";

alter table "public"."post_views" add constraint "post_views_post_id_fkey" FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE not valid;

alter table "public"."post_views" validate constraint "post_views_post_id_fkey";

alter table "public"."post_views" add constraint "post_views_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE RESTRICT not valid;

alter table "public"."post_views" validate constraint "post_views_user_id_fkey";

alter table "public"."post_votes" add constraint "post_votes_post_id_fkey" FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE not valid;

alter table "public"."post_votes" validate constraint "post_votes_post_id_fkey";

alter table "public"."post_votes" add constraint "post_votes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE RESTRICT not valid;

alter table "public"."post_votes" validate constraint "post_votes_user_id_fkey";

alter table "public"."posts" add constraint "posts_author_id_fkey" FOREIGN KEY (author_id) REFERENCES public.profiles(id) ON DELETE RESTRICT not valid;

alter table "public"."posts" validate constraint "posts_author_id_fkey";

alter table "public"."posts" add constraint "posts_campfire_id_fkey" FOREIGN KEY (campfire_id) REFERENCES public.campfires(id) ON DELETE SET NULL not valid;

alter table "public"."posts" validate constraint "posts_campfire_id_fkey";

alter table "public"."posts" add constraint "posts_content_min_len" CHECK ((length(content_text) >= 10)) not valid;

alter table "public"."posts" validate constraint "posts_content_min_len";

alter table "public"."posts" add constraint "posts_counts_nonnegative" CHECK (((media_count >= 0) AND (upvotes_count >= 0) AND (downvotes_count >= 0))) not valid;

alter table "public"."posts" validate constraint "posts_counts_nonnegative";

alter table "public"."posts" add constraint "posts_deleted_by_fkey" FOREIGN KEY (deleted_by) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."posts" validate constraint "posts_deleted_by_fkey";

alter table "public"."posts" add constraint "posts_hero_media_id_fkey" FOREIGN KEY (hero_media_id) REFERENCES public.post_media(id) ON DELETE SET NULL not valid;

alter table "public"."posts" validate constraint "posts_hero_media_id_fkey";

alter table "public"."posts" add constraint "posts_kind_media_consistency" CHECK ((((post_kind = 'text'::public.post_kind) AND (media_count = 0)) OR ((post_kind = 'text_with_media'::public.post_kind) AND (media_count = 1)) OR (post_kind = 'carousel'::public.post_kind) OR (post_kind = 'voice'::public.post_kind))) not valid;

alter table "public"."posts" validate constraint "posts_kind_media_consistency";

alter table "public"."posts" add constraint "posts_media_count_one_for_now" CHECK (((media_count >= 0) AND (media_count <= 1))) not valid;

alter table "public"."posts" validate constraint "posts_media_count_one_for_now";

alter table "public"."tags" add constraint "tags_name_len" CHECK (((length((name)::text) >= 1) AND (length((name)::text) <= 64))) not valid;

alter table "public"."tags" validate constraint "tags_name_len";

alter table "public"."tags" add constraint "tags_post_count_nonnegative" CHECK ((count >= 0)) not valid;

alter table "public"."tags" validate constraint "tags_post_count_nonnegative";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION private.provision_user_on_auth_insert()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  v_username text;
  v_is_anonymous boolean;
begin
  -- username may be provided at signup; if not present, keep null
  v_username := nullif(new.raw_user_meta_data->>'username', '');

  -- infer anonymous sign-in from auth metadata (avoid relying on nonstandard columns)
  -- note: this is a best-effort inference and remains a display/state flag only.
  v_is_anonymous :=
    coalesce((new.is_anonymous) = 'true', false);

  -- public profile card
  insert into public.profiles (
    id,
    username,
    avatar_url,
    is_anonymous
  )
  values (
    new.id,
    v_username,
    'default_profile.png',
    v_is_anonymous
  )
  on conflict (id) do nothing;

  -- sensitive private row (minimal defaults; email optional)
  insert into private.profile_private (
    user_id,
    email
  )
  values (
    new.id,
    nullif(new.email, '')
  )
  on conflict (user_id) do nothing;

  -- preferences row (defaults)
  insert into public.user_preferences (
    user_id
  )
  values (
    new.id
  )
  on conflict (user_id) do nothing;

  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION private.set_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
begin
  new.updated_at := now();
  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.ensure_campfire_settings()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
  insert into public.campfire_settings (campfire_id)
  values (new.id)
  on conflict (campfire_id) do nothing;

  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.recount_campfire_members(p_campfire_id uuid)
 RETURNS void
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
  update public.campfires c
  set member_count = (
    select count(*)
    from public.campfire_members m
    where m.campfire_id = c.id
      and m.status = 'approved'
  ),
  updated_at = now()
  where c.id = p_campfire_id;
$function$
;

CREATE OR REPLACE FUNCTION public.tr_campfire_members_recount()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  v_campfire_id uuid;
begin
  v_campfire_id := coalesce(new.campfire_id, old.campfire_id);

  -- only recompute when insert/delete, or when status changes
  if (tg_op = 'UPDATE') then
    if new.status is not distinct from old.status then
      return new;
    end if;
  end if;

  perform public.recount_campfire_members(v_campfire_id);
  return coalesce(new, old);
end;
$function$
;

grant delete on table "public"."campfire_guide_resources" to "postgres";

grant insert on table "public"."campfire_guide_resources" to "postgres";

grant references on table "public"."campfire_guide_resources" to "postgres";

grant select on table "public"."campfire_guide_resources" to "postgres";

grant trigger on table "public"."campfire_guide_resources" to "postgres";

grant truncate on table "public"."campfire_guide_resources" to "postgres";

grant update on table "public"."campfire_guide_resources" to "postgres";

grant delete on table "public"."campfire_lanes" to "postgres";

grant insert on table "public"."campfire_lanes" to "postgres";

grant references on table "public"."campfire_lanes" to "postgres";

grant select on table "public"."campfire_lanes" to "postgres";

grant trigger on table "public"."campfire_lanes" to "postgres";

grant truncate on table "public"."campfire_lanes" to "postgres";

grant update on table "public"."campfire_lanes" to "postgres";

grant delete on table "public"."campfire_members" to "postgres";

grant insert on table "public"."campfire_members" to "postgres";

grant references on table "public"."campfire_members" to "postgres";

grant select on table "public"."campfire_members" to "postgres";

grant trigger on table "public"."campfire_members" to "postgres";

grant truncate on table "public"."campfire_members" to "postgres";

grant update on table "public"."campfire_members" to "postgres";

grant delete on table "public"."campfire_realms" to "postgres";

grant insert on table "public"."campfire_realms" to "postgres";

grant references on table "public"."campfire_realms" to "postgres";

grant select on table "public"."campfire_realms" to "postgres";

grant trigger on table "public"."campfire_realms" to "postgres";

grant truncate on table "public"."campfire_realms" to "postgres";

grant update on table "public"."campfire_realms" to "postgres";

grant delete on table "public"."campfire_settings" to "postgres";

grant insert on table "public"."campfire_settings" to "postgres";

grant references on table "public"."campfire_settings" to "postgres";

grant select on table "public"."campfire_settings" to "postgres";

grant trigger on table "public"."campfire_settings" to "postgres";

grant truncate on table "public"."campfire_settings" to "postgres";

grant update on table "public"."campfire_settings" to "postgres";

grant delete on table "public"."campfires" to "postgres";

grant insert on table "public"."campfires" to "postgres";

grant references on table "public"."campfires" to "postgres";

grant select on table "public"."campfires" to "postgres";

grant trigger on table "public"."campfires" to "postgres";

grant truncate on table "public"."campfires" to "postgres";

grant update on table "public"."campfires" to "postgres";

grant delete on table "public"."collection_items" to "anon";

grant insert on table "public"."collection_items" to "anon";

grant references on table "public"."collection_items" to "anon";

grant select on table "public"."collection_items" to "anon";

grant trigger on table "public"."collection_items" to "anon";

grant truncate on table "public"."collection_items" to "anon";

grant update on table "public"."collection_items" to "anon";

grant delete on table "public"."collection_items" to "authenticated";

grant insert on table "public"."collection_items" to "authenticated";

grant references on table "public"."collection_items" to "authenticated";

grant select on table "public"."collection_items" to "authenticated";

grant trigger on table "public"."collection_items" to "authenticated";

grant truncate on table "public"."collection_items" to "authenticated";

grant update on table "public"."collection_items" to "authenticated";

grant delete on table "public"."collection_items" to "postgres";

grant insert on table "public"."collection_items" to "postgres";

grant references on table "public"."collection_items" to "postgres";

grant select on table "public"."collection_items" to "postgres";

grant trigger on table "public"."collection_items" to "postgres";

grant truncate on table "public"."collection_items" to "postgres";

grant update on table "public"."collection_items" to "postgres";

grant delete on table "public"."collection_items" to "service_role";

grant insert on table "public"."collection_items" to "service_role";

grant references on table "public"."collection_items" to "service_role";

grant select on table "public"."collection_items" to "service_role";

grant trigger on table "public"."collection_items" to "service_role";

grant truncate on table "public"."collection_items" to "service_role";

grant update on table "public"."collection_items" to "service_role";

grant delete on table "public"."collections" to "anon";

grant insert on table "public"."collections" to "anon";

grant references on table "public"."collections" to "anon";

grant select on table "public"."collections" to "anon";

grant trigger on table "public"."collections" to "anon";

grant truncate on table "public"."collections" to "anon";

grant update on table "public"."collections" to "anon";

grant delete on table "public"."collections" to "authenticated";

grant insert on table "public"."collections" to "authenticated";

grant references on table "public"."collections" to "authenticated";

grant select on table "public"."collections" to "authenticated";

grant trigger on table "public"."collections" to "authenticated";

grant truncate on table "public"."collections" to "authenticated";

grant update on table "public"."collections" to "authenticated";

grant delete on table "public"."collections" to "postgres";

grant insert on table "public"."collections" to "postgres";

grant references on table "public"."collections" to "postgres";

grant select on table "public"."collections" to "postgres";

grant trigger on table "public"."collections" to "postgres";

grant truncate on table "public"."collections" to "postgres";

grant update on table "public"."collections" to "postgres";

grant delete on table "public"."collections" to "service_role";

grant insert on table "public"."collections" to "service_role";

grant references on table "public"."collections" to "service_role";

grant select on table "public"."collections" to "service_role";

grant trigger on table "public"."collections" to "service_role";

grant truncate on table "public"."collections" to "service_role";

grant update on table "public"."collections" to "service_role";

grant delete on table "public"."health_tip_categories" to "anon";

grant insert on table "public"."health_tip_categories" to "anon";

grant references on table "public"."health_tip_categories" to "anon";

grant select on table "public"."health_tip_categories" to "anon";

grant trigger on table "public"."health_tip_categories" to "anon";

grant truncate on table "public"."health_tip_categories" to "anon";

grant update on table "public"."health_tip_categories" to "anon";

grant delete on table "public"."health_tip_categories" to "authenticated";

grant insert on table "public"."health_tip_categories" to "authenticated";

grant references on table "public"."health_tip_categories" to "authenticated";

grant select on table "public"."health_tip_categories" to "authenticated";

grant trigger on table "public"."health_tip_categories" to "authenticated";

grant truncate on table "public"."health_tip_categories" to "authenticated";

grant update on table "public"."health_tip_categories" to "authenticated";

grant delete on table "public"."health_tip_categories" to "postgres";

grant insert on table "public"."health_tip_categories" to "postgres";

grant references on table "public"."health_tip_categories" to "postgres";

grant select on table "public"."health_tip_categories" to "postgres";

grant trigger on table "public"."health_tip_categories" to "postgres";

grant truncate on table "public"."health_tip_categories" to "postgres";

grant update on table "public"."health_tip_categories" to "postgres";

grant delete on table "public"."health_tip_categories" to "service_role";

grant insert on table "public"."health_tip_categories" to "service_role";

grant references on table "public"."health_tip_categories" to "service_role";

grant select on table "public"."health_tip_categories" to "service_role";

grant trigger on table "public"."health_tip_categories" to "service_role";

grant truncate on table "public"."health_tip_categories" to "service_role";

grant update on table "public"."health_tip_categories" to "service_role";

grant delete on table "public"."health_tip_sources" to "anon";

grant insert on table "public"."health_tip_sources" to "anon";

grant references on table "public"."health_tip_sources" to "anon";

grant select on table "public"."health_tip_sources" to "anon";

grant trigger on table "public"."health_tip_sources" to "anon";

grant truncate on table "public"."health_tip_sources" to "anon";

grant update on table "public"."health_tip_sources" to "anon";

grant delete on table "public"."health_tip_sources" to "authenticated";

grant insert on table "public"."health_tip_sources" to "authenticated";

grant references on table "public"."health_tip_sources" to "authenticated";

grant select on table "public"."health_tip_sources" to "authenticated";

grant trigger on table "public"."health_tip_sources" to "authenticated";

grant truncate on table "public"."health_tip_sources" to "authenticated";

grant update on table "public"."health_tip_sources" to "authenticated";

grant delete on table "public"."health_tip_sources" to "postgres";

grant insert on table "public"."health_tip_sources" to "postgres";

grant references on table "public"."health_tip_sources" to "postgres";

grant select on table "public"."health_tip_sources" to "postgres";

grant trigger on table "public"."health_tip_sources" to "postgres";

grant truncate on table "public"."health_tip_sources" to "postgres";

grant update on table "public"."health_tip_sources" to "postgres";

grant delete on table "public"."health_tip_sources" to "service_role";

grant insert on table "public"."health_tip_sources" to "service_role";

grant references on table "public"."health_tip_sources" to "service_role";

grant select on table "public"."health_tip_sources" to "service_role";

grant trigger on table "public"."health_tip_sources" to "service_role";

grant truncate on table "public"."health_tip_sources" to "service_role";

grant update on table "public"."health_tip_sources" to "service_role";

grant delete on table "public"."health_tips" to "anon";

grant insert on table "public"."health_tips" to "anon";

grant references on table "public"."health_tips" to "anon";

grant select on table "public"."health_tips" to "anon";

grant trigger on table "public"."health_tips" to "anon";

grant truncate on table "public"."health_tips" to "anon";

grant update on table "public"."health_tips" to "anon";

grant delete on table "public"."health_tips" to "authenticated";

grant insert on table "public"."health_tips" to "authenticated";

grant references on table "public"."health_tips" to "authenticated";

grant select on table "public"."health_tips" to "authenticated";

grant trigger on table "public"."health_tips" to "authenticated";

grant truncate on table "public"."health_tips" to "authenticated";

grant update on table "public"."health_tips" to "authenticated";

grant delete on table "public"."health_tips" to "postgres";

grant insert on table "public"."health_tips" to "postgres";

grant references on table "public"."health_tips" to "postgres";

grant select on table "public"."health_tips" to "postgres";

grant trigger on table "public"."health_tips" to "postgres";

grant truncate on table "public"."health_tips" to "postgres";

grant update on table "public"."health_tips" to "postgres";

grant delete on table "public"."health_tips" to "service_role";

grant insert on table "public"."health_tips" to "service_role";

grant references on table "public"."health_tips" to "service_role";

grant select on table "public"."health_tips" to "service_role";

grant trigger on table "public"."health_tips" to "service_role";

grant truncate on table "public"."health_tips" to "service_role";

grant update on table "public"."health_tips" to "service_role";

grant delete on table "public"."post_media" to "anon";

grant insert on table "public"."post_media" to "anon";

grant references on table "public"."post_media" to "anon";

grant select on table "public"."post_media" to "anon";

grant trigger on table "public"."post_media" to "anon";

grant truncate on table "public"."post_media" to "anon";

grant update on table "public"."post_media" to "anon";

grant delete on table "public"."post_media" to "authenticated";

grant insert on table "public"."post_media" to "authenticated";

grant references on table "public"."post_media" to "authenticated";

grant select on table "public"."post_media" to "authenticated";

grant trigger on table "public"."post_media" to "authenticated";

grant truncate on table "public"."post_media" to "authenticated";

grant update on table "public"."post_media" to "authenticated";

grant delete on table "public"."post_media" to "postgres";

grant insert on table "public"."post_media" to "postgres";

grant references on table "public"."post_media" to "postgres";

grant select on table "public"."post_media" to "postgres";

grant trigger on table "public"."post_media" to "postgres";

grant truncate on table "public"."post_media" to "postgres";

grant update on table "public"."post_media" to "postgres";

grant delete on table "public"."post_media" to "service_role";

grant insert on table "public"."post_media" to "service_role";

grant references on table "public"."post_media" to "service_role";

grant select on table "public"."post_media" to "service_role";

grant trigger on table "public"."post_media" to "service_role";

grant truncate on table "public"."post_media" to "service_role";

grant update on table "public"."post_media" to "service_role";

grant delete on table "public"."post_slides" to "anon";

grant insert on table "public"."post_slides" to "anon";

grant references on table "public"."post_slides" to "anon";

grant select on table "public"."post_slides" to "anon";

grant trigger on table "public"."post_slides" to "anon";

grant truncate on table "public"."post_slides" to "anon";

grant update on table "public"."post_slides" to "anon";

grant delete on table "public"."post_slides" to "authenticated";

grant insert on table "public"."post_slides" to "authenticated";

grant references on table "public"."post_slides" to "authenticated";

grant select on table "public"."post_slides" to "authenticated";

grant trigger on table "public"."post_slides" to "authenticated";

grant truncate on table "public"."post_slides" to "authenticated";

grant update on table "public"."post_slides" to "authenticated";

grant delete on table "public"."post_slides" to "postgres";

grant insert on table "public"."post_slides" to "postgres";

grant references on table "public"."post_slides" to "postgres";

grant select on table "public"."post_slides" to "postgres";

grant trigger on table "public"."post_slides" to "postgres";

grant truncate on table "public"."post_slides" to "postgres";

grant update on table "public"."post_slides" to "postgres";

grant delete on table "public"."post_slides" to "service_role";

grant insert on table "public"."post_slides" to "service_role";

grant references on table "public"."post_slides" to "service_role";

grant select on table "public"."post_slides" to "service_role";

grant trigger on table "public"."post_slides" to "service_role";

grant truncate on table "public"."post_slides" to "service_role";

grant update on table "public"."post_slides" to "service_role";

grant delete on table "public"."post_tags" to "anon";

grant insert on table "public"."post_tags" to "anon";

grant references on table "public"."post_tags" to "anon";

grant select on table "public"."post_tags" to "anon";

grant trigger on table "public"."post_tags" to "anon";

grant truncate on table "public"."post_tags" to "anon";

grant update on table "public"."post_tags" to "anon";

grant delete on table "public"."post_tags" to "authenticated";

grant insert on table "public"."post_tags" to "authenticated";

grant references on table "public"."post_tags" to "authenticated";

grant select on table "public"."post_tags" to "authenticated";

grant trigger on table "public"."post_tags" to "authenticated";

grant truncate on table "public"."post_tags" to "authenticated";

grant update on table "public"."post_tags" to "authenticated";

grant delete on table "public"."post_tags" to "postgres";

grant insert on table "public"."post_tags" to "postgres";

grant references on table "public"."post_tags" to "postgres";

grant select on table "public"."post_tags" to "postgres";

grant trigger on table "public"."post_tags" to "postgres";

grant truncate on table "public"."post_tags" to "postgres";

grant update on table "public"."post_tags" to "postgres";

grant delete on table "public"."post_tags" to "service_role";

grant insert on table "public"."post_tags" to "service_role";

grant references on table "public"."post_tags" to "service_role";

grant select on table "public"."post_tags" to "service_role";

grant trigger on table "public"."post_tags" to "service_role";

grant truncate on table "public"."post_tags" to "service_role";

grant update on table "public"."post_tags" to "service_role";

grant delete on table "public"."post_views" to "anon";

grant insert on table "public"."post_views" to "anon";

grant references on table "public"."post_views" to "anon";

grant select on table "public"."post_views" to "anon";

grant trigger on table "public"."post_views" to "anon";

grant truncate on table "public"."post_views" to "anon";

grant update on table "public"."post_views" to "anon";

grant delete on table "public"."post_views" to "authenticated";

grant insert on table "public"."post_views" to "authenticated";

grant references on table "public"."post_views" to "authenticated";

grant select on table "public"."post_views" to "authenticated";

grant trigger on table "public"."post_views" to "authenticated";

grant truncate on table "public"."post_views" to "authenticated";

grant update on table "public"."post_views" to "authenticated";

grant delete on table "public"."post_views" to "postgres";

grant insert on table "public"."post_views" to "postgres";

grant references on table "public"."post_views" to "postgres";

grant select on table "public"."post_views" to "postgres";

grant trigger on table "public"."post_views" to "postgres";

grant truncate on table "public"."post_views" to "postgres";

grant update on table "public"."post_views" to "postgres";

grant delete on table "public"."post_views" to "service_role";

grant insert on table "public"."post_views" to "service_role";

grant references on table "public"."post_views" to "service_role";

grant select on table "public"."post_views" to "service_role";

grant trigger on table "public"."post_views" to "service_role";

grant truncate on table "public"."post_views" to "service_role";

grant update on table "public"."post_views" to "service_role";

grant delete on table "public"."post_votes" to "anon";

grant insert on table "public"."post_votes" to "anon";

grant references on table "public"."post_votes" to "anon";

grant select on table "public"."post_votes" to "anon";

grant trigger on table "public"."post_votes" to "anon";

grant truncate on table "public"."post_votes" to "anon";

grant update on table "public"."post_votes" to "anon";

grant delete on table "public"."post_votes" to "authenticated";

grant insert on table "public"."post_votes" to "authenticated";

grant references on table "public"."post_votes" to "authenticated";

grant select on table "public"."post_votes" to "authenticated";

grant trigger on table "public"."post_votes" to "authenticated";

grant truncate on table "public"."post_votes" to "authenticated";

grant update on table "public"."post_votes" to "authenticated";

grant delete on table "public"."post_votes" to "postgres";

grant insert on table "public"."post_votes" to "postgres";

grant references on table "public"."post_votes" to "postgres";

grant select on table "public"."post_votes" to "postgres";

grant trigger on table "public"."post_votes" to "postgres";

grant truncate on table "public"."post_votes" to "postgres";

grant update on table "public"."post_votes" to "postgres";

grant delete on table "public"."post_votes" to "service_role";

grant insert on table "public"."post_votes" to "service_role";

grant references on table "public"."post_votes" to "service_role";

grant select on table "public"."post_votes" to "service_role";

grant trigger on table "public"."post_votes" to "service_role";

grant truncate on table "public"."post_votes" to "service_role";

grant update on table "public"."post_votes" to "service_role";

grant delete on table "public"."posts" to "anon";

grant insert on table "public"."posts" to "anon";

grant references on table "public"."posts" to "anon";

grant select on table "public"."posts" to "anon";

grant trigger on table "public"."posts" to "anon";

grant truncate on table "public"."posts" to "anon";

grant update on table "public"."posts" to "anon";

grant delete on table "public"."posts" to "authenticated";

grant insert on table "public"."posts" to "authenticated";

grant references on table "public"."posts" to "authenticated";

grant select on table "public"."posts" to "authenticated";

grant trigger on table "public"."posts" to "authenticated";

grant truncate on table "public"."posts" to "authenticated";

grant update on table "public"."posts" to "authenticated";

grant delete on table "public"."posts" to "postgres";

grant insert on table "public"."posts" to "postgres";

grant references on table "public"."posts" to "postgres";

grant select on table "public"."posts" to "postgres";

grant trigger on table "public"."posts" to "postgres";

grant truncate on table "public"."posts" to "postgres";

grant update on table "public"."posts" to "postgres";

grant delete on table "public"."posts" to "service_role";

grant insert on table "public"."posts" to "service_role";

grant references on table "public"."posts" to "service_role";

grant select on table "public"."posts" to "service_role";

grant trigger on table "public"."posts" to "service_role";

grant truncate on table "public"."posts" to "service_role";

grant update on table "public"."posts" to "service_role";

grant delete on table "public"."profiles" to "postgres";

grant insert on table "public"."profiles" to "postgres";

grant references on table "public"."profiles" to "postgres";

grant select on table "public"."profiles" to "postgres";

grant trigger on table "public"."profiles" to "postgres";

grant truncate on table "public"."profiles" to "postgres";

grant update on table "public"."profiles" to "postgres";

grant delete on table "public"."tags" to "anon";

grant insert on table "public"."tags" to "anon";

grant references on table "public"."tags" to "anon";

grant select on table "public"."tags" to "anon";

grant trigger on table "public"."tags" to "anon";

grant truncate on table "public"."tags" to "anon";

grant update on table "public"."tags" to "anon";

grant delete on table "public"."tags" to "authenticated";

grant insert on table "public"."tags" to "authenticated";

grant references on table "public"."tags" to "authenticated";

grant select on table "public"."tags" to "authenticated";

grant trigger on table "public"."tags" to "authenticated";

grant truncate on table "public"."tags" to "authenticated";

grant update on table "public"."tags" to "authenticated";

grant delete on table "public"."tags" to "postgres";

grant insert on table "public"."tags" to "postgres";

grant references on table "public"."tags" to "postgres";

grant select on table "public"."tags" to "postgres";

grant trigger on table "public"."tags" to "postgres";

grant truncate on table "public"."tags" to "postgres";

grant update on table "public"."tags" to "postgres";

grant delete on table "public"."tags" to "service_role";

grant insert on table "public"."tags" to "service_role";

grant references on table "public"."tags" to "service_role";

grant select on table "public"."tags" to "service_role";

grant trigger on table "public"."tags" to "service_role";

grant truncate on table "public"."tags" to "service_role";

grant update on table "public"."tags" to "service_role";

grant delete on table "public"."user_preferences" to "postgres";

grant insert on table "public"."user_preferences" to "postgres";

grant references on table "public"."user_preferences" to "postgres";

grant select on table "public"."user_preferences" to "postgres";

grant trigger on table "public"."user_preferences" to "postgres";

grant truncate on table "public"."user_preferences" to "postgres";

grant update on table "public"."user_preferences" to "postgres";


  create policy "collection_items_delete_own"
  on "public"."collection_items"
  as permissive
  for delete
  to public
using ((user_id = auth.uid()));



  create policy "collection_items_insert_own"
  on "public"."collection_items"
  as permissive
  for insert
  to public
with check (((user_id = auth.uid()) AND (EXISTS ( SELECT 1
   FROM public.collections c
  WHERE ((c.id = collection_items.collection_id) AND (c.user_id = auth.uid()))))));



  create policy "collection_items_select_own"
  on "public"."collection_items"
  as permissive
  for select
  to public
using ((user_id = auth.uid()));



  create policy "collection_items_update_own"
  on "public"."collection_items"
  as permissive
  for update
  to public
using ((user_id = auth.uid()))
with check ((user_id = auth.uid()));



  create policy "collections_delete_own"
  on "public"."collections"
  as permissive
  for delete
  to public
using ((user_id = auth.uid()));



  create policy "collections_insert_own"
  on "public"."collections"
  as permissive
  for insert
  to public
with check ((user_id = auth.uid()));



  create policy "collections_select_own"
  on "public"."collections"
  as permissive
  for select
  to public
using ((user_id = auth.uid()));



  create policy "collections_update_own"
  on "public"."collections"
  as permissive
  for update
  to public
using ((user_id = auth.uid()))
with check ((user_id = auth.uid()));



  create policy "public_read_active_categories"
  on "public"."health_tip_categories"
  as permissive
  for select
  to public
using ((is_active = true));



  create policy "public_read_sources_for_published_tips"
  on "public"."health_tip_sources"
  as permissive
  for select
  to public
using ((EXISTS ( SELECT 1
   FROM public.health_tips ht
  WHERE ((ht.id = health_tip_sources.health_tip_id) AND (ht.status = 'published'::public.health_tip_status)))));



  create policy "public_read_published_health_tips"
  on "public"."health_tips"
  as permissive
  for select
  to public
using ((status = 'published'::public.health_tip_status));



  create policy "post_media_select_public"
  on "public"."post_media"
  as permissive
  for select
  to anon, authenticated
using ((EXISTS ( SELECT 1
   FROM public.posts p
  WHERE ((p.id = post_media.post_id) AND (p.deleted_at IS NULL) AND ((p.expires_at IS NULL) OR (p.expires_at > now()))))));



  create policy "post_slides_select_public"
  on "public"."post_slides"
  as permissive
  for select
  to anon, authenticated
using ((EXISTS ( SELECT 1
   FROM public.posts p
  WHERE ((p.id = post_slides.post_id) AND (p.deleted_at IS NULL) AND ((p.expires_at IS NULL) OR (p.expires_at > now()))))));



  create policy "post_tags_select_public"
  on "public"."post_tags"
  as permissive
  for select
  to anon, authenticated
using (true);



  create policy "post_views_select_own"
  on "public"."post_views"
  as permissive
  for select
  to authenticated
using ((user_id = auth.uid()));



  create policy "post_votes_select_own"
  on "public"."post_votes"
  as permissive
  for select
  to authenticated
using ((user_id = auth.uid()));



  create policy "posts_select_public"
  on "public"."posts"
  as permissive
  for select
  to anon, authenticated
using (((deleted_at IS NULL) AND ((expires_at IS NULL) OR (expires_at > now()))));



  create policy "tags_select_public"
  on "public"."tags"
  as permissive
  for select
  to anon, authenticated
using (true);


CREATE TRIGGER set_health_tip_categories_updated_at BEFORE UPDATE ON public.health_tip_categories FOR EACH ROW EXECUTE FUNCTION private.set_updated_at();

CREATE TRIGGER set_health_tips_updated_at BEFORE UPDATE ON public.health_tips FOR EACH ROW EXECUTE FUNCTION private.set_updated_at();



