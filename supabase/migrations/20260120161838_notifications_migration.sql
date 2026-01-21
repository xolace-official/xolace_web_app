drop policy "Enable read access for authenticated users" on "public"."campfire_realms";

drop policy "comment_pins_select_authenticated" on "public"."comment_pins";

drop policy "comments_select_authenticated" on "public"."comments";


  create table "private"."role_status_audit_log" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "actor_id" uuid,
    "action_type" text not null,
    "entity" text not null,
    "old_value" jsonb,
    "new_value" jsonb not null,
    "reason" text,
    "created_at" timestamp with time zone not null default now()
      );



  create table "private"."user_verification_status" (
    "user_id" uuid not null,
    "professional_status" text not null default 'unverified'::text,
    "mentor_status" text not null default 'unverified'::text,
    "professional_verified_at" timestamp with time zone,
    "mentor_verified_at" timestamp with time zone,
    "updated_at" timestamp with time zone not null default now(),
    "updated_by" uuid,
    "notes" text
      );



  create table "public"."account_statuses" (
    "user_id" uuid not null,
    "status" text not null default 'active'::text,
    "updated_at" timestamp with time zone not null default now(),
    "updated_by" uuid,
    "reason" text
      );



  create table "public"."health_tip_tags" (
    "health_tip_id" uuid not null,
    "tag_id" bigint not null,
    "created_at" timestamp with time zone not null default now()
      );



  create table "public"."notifications" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "recipient_user_id" uuid not null,
    "actor_id" uuid,
    "actor_name" text,
    "actor_avatar_url" text,
    "type" text not null,
    "entity_type" text,
    "entity_id" text,
    "metadata" jsonb not null default '{}'::jsonb,
    "is_read" boolean not null default false
      );


alter table "public"."notifications" enable row level security;


  create table "public"."roles" (
    "role" text not null,
    "description" text not null,
    "created_at" timestamp with time zone not null default now()
      );



  create table "public"."user_role_assignments" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "role" text not null,
    "assigned_by" uuid,
    "assigned_at" timestamp with time zone not null default now(),
    "revoked_by" uuid,
    "revoked_at" timestamp with time zone,
    "reason" text
      );



  create table "public"."video_likes" (
    "id" bigint generated always as identity not null,
    "video_id" uuid not null,
    "user_profile_id" uuid not null,
    "created_at" timestamp with time zone not null default now()
      );



  create table "public"."video_tags" (
    "video_id" uuid not null,
    "tag_id" bigint not null,
    "created_at" timestamp with time zone not null default now()
      );



  create table "public"."videos" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "published_at" timestamp with time zone,
    "bunny_video_id" text not null,
    "playback_url" text not null,
    "thumbnail_url" text not null,
    "duration_seconds" integer not null,
    "author_profile_id" uuid not null,
    "author_display_name" text not null,
    "author_avatar_url" text not null,
    "title" text,
    "description" text,
    "visibility" text not null default 'public'::text,
    "is_featured" boolean not null default false,
    "is_recommended" boolean not null default false,
    "likes_count" bigint not null default 0,
    "views_count" bigint not null default 0,
    "saves_count" bigint not null default 0,
    "is_deleted" boolean not null default false,
    "deleted_at" timestamp with time zone
      );


alter table "private"."profile_private" drop column "account_state";

alter table "private"."profile_private" drop column "restricted_reason";

alter table "private"."profile_private" drop column "restricted_until";

alter table "public"."comment_edits" alter column "comment_id" set data type uuid using "comment_id"::uuid;

alter table "public"."comment_pins" alter column "comment_id" set data type uuid using "comment_id"::uuid;

alter table "public"."comments" add column "is_edited" boolean not null default false;

alter table "public"."comments" add column "root_id" uuid;

alter table "public"."comments" alter column "id" set default gen_random_uuid();

alter table "public"."comments" alter column "id" drop identity;

alter table "public"."comments" alter column "id" set data type uuid using "id"::uuid;

alter table "public"."comments" alter column "parent_comment_id" set data type uuid using "parent_comment_id"::uuid;

CREATE INDEX role_status_audit_log_action_created_idx ON private.role_status_audit_log USING btree (action_type, created_at DESC);

CREATE UNIQUE INDEX role_status_audit_log_pkey ON private.role_status_audit_log USING btree (id);

CREATE INDEX role_status_audit_log_user_created_idx ON private.role_status_audit_log USING btree (user_id, created_at DESC);

CREATE INDEX user_verification_status_mentor_idx ON private.user_verification_status USING btree (mentor_status);

CREATE UNIQUE INDEX user_verification_status_pkey ON private.user_verification_status USING btree (user_id);

CREATE INDEX user_verification_status_professional_idx ON private.user_verification_status USING btree (professional_status);

CREATE UNIQUE INDEX account_statuses_pkey ON public.account_statuses USING btree (user_id);

CREATE INDEX account_statuses_status_idx ON public.account_statuses USING btree (status);

CREATE UNIQUE INDEX health_tip_tags_pkey ON public.health_tip_tags USING btree (health_tip_id, tag_id);

CREATE INDEX health_tip_tags_tag_id_idx ON public.health_tip_tags USING btree (tag_id);

CREATE INDEX health_tip_tags_tip_id_idx ON public.health_tip_tags USING btree (health_tip_id);

CREATE INDEX idx_campfires_discover ON public.campfires USING btree (visibility, realm_id, lane_id, member_count DESC);

CREATE INDEX idx_notifications_recipient_created ON public.notifications USING btree (recipient_user_id, created_at DESC);

CREATE INDEX idx_notifications_unread ON public.notifications USING btree (recipient_user_id) WHERE (is_read = false);

CREATE UNIQUE INDEX notifications_pkey ON public.notifications USING btree (id);

CREATE UNIQUE INDEX roles_pkey ON public.roles USING btree (role);

CREATE UNIQUE INDEX user_role_assignments_one_active_per_role ON public.user_role_assignments USING btree (user_id, role) WHERE (revoked_at IS NULL);

CREATE UNIQUE INDEX user_role_assignments_pkey ON public.user_role_assignments USING btree (id);

CREATE INDEX user_role_assignments_role_active_idx ON public.user_role_assignments USING btree (role) WHERE (revoked_at IS NULL);

CREATE INDEX user_role_assignments_user_active_idx ON public.user_role_assignments USING btree (user_id) WHERE (revoked_at IS NULL);

CREATE UNIQUE INDEX video_likes_pkey ON public.video_likes USING btree (id);

CREATE UNIQUE INDEX video_likes_unique_user ON public.video_likes USING btree (video_id, user_profile_id);

CREATE UNIQUE INDEX video_tags_pkey ON public.video_tags USING btree (video_id, tag_id);

CREATE UNIQUE INDEX videos_bunny_video_id_key ON public.videos USING btree (bunny_video_id);

CREATE UNIQUE INDEX videos_pkey ON public.videos USING btree (id);

alter table "private"."role_status_audit_log" add constraint "role_status_audit_log_pkey" PRIMARY KEY using index "role_status_audit_log_pkey";

alter table "private"."user_verification_status" add constraint "user_verification_status_pkey" PRIMARY KEY using index "user_verification_status_pkey";

alter table "public"."account_statuses" add constraint "account_statuses_pkey" PRIMARY KEY using index "account_statuses_pkey";

alter table "public"."health_tip_tags" add constraint "health_tip_tags_pkey" PRIMARY KEY using index "health_tip_tags_pkey";

alter table "public"."notifications" add constraint "notifications_pkey" PRIMARY KEY using index "notifications_pkey";

alter table "public"."roles" add constraint "roles_pkey" PRIMARY KEY using index "roles_pkey";

alter table "public"."user_role_assignments" add constraint "user_role_assignments_pkey" PRIMARY KEY using index "user_role_assignments_pkey";

alter table "public"."video_likes" add constraint "video_likes_pkey" PRIMARY KEY using index "video_likes_pkey";

alter table "public"."video_tags" add constraint "video_tags_pkey" PRIMARY KEY using index "video_tags_pkey";

alter table "public"."videos" add constraint "videos_pkey" PRIMARY KEY using index "videos_pkey";

alter table "private"."role_status_audit_log" add constraint "role_status_audit_log_action_type_check" CHECK ((action_type = ANY (ARRAY['role_assigned'::text, 'role_revoked'::text, 'account_status_changed'::text, 'professional_verification_changed'::text, 'mentor_verification_changed'::text]))) not valid;

alter table "private"."role_status_audit_log" validate constraint "role_status_audit_log_action_type_check";

alter table "private"."role_status_audit_log" add constraint "role_status_audit_log_actor_id_fkey" FOREIGN KEY (actor_id) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "private"."role_status_audit_log" validate constraint "role_status_audit_log_actor_id_fkey";

alter table "private"."role_status_audit_log" add constraint "role_status_audit_log_entity_check" CHECK ((entity = ANY (ARRAY['role'::text, 'account_status'::text, 'verification'::text]))) not valid;

alter table "private"."role_status_audit_log" validate constraint "role_status_audit_log_entity_check";

alter table "private"."role_status_audit_log" add constraint "role_status_audit_log_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "private"."role_status_audit_log" validate constraint "role_status_audit_log_user_id_fkey";

alter table "private"."user_verification_status" add constraint "user_verification_status_mentor_status_check" CHECK ((mentor_status = ANY (ARRAY['unverified'::text, 'pending'::text, 'verified'::text, 'rejected'::text, 'revoked'::text]))) not valid;

alter table "private"."user_verification_status" validate constraint "user_verification_status_mentor_status_check";

alter table "private"."user_verification_status" add constraint "user_verification_status_professional_status_check" CHECK ((professional_status = ANY (ARRAY['unverified'::text, 'pending'::text, 'verified'::text, 'rejected'::text, 'revoked'::text]))) not valid;

alter table "private"."user_verification_status" validate constraint "user_verification_status_professional_status_check";

alter table "private"."user_verification_status" add constraint "user_verification_status_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "private"."user_verification_status" validate constraint "user_verification_status_updated_by_fkey";

alter table "private"."user_verification_status" add constraint "user_verification_status_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "private"."user_verification_status" validate constraint "user_verification_status_user_id_fkey";

alter table "public"."account_statuses" add constraint "account_statuses_status_check" CHECK ((status = ANY (ARRAY['active'::text, 'suspended'::text, 'deactivated'::text]))) not valid;

alter table "public"."account_statuses" validate constraint "account_statuses_status_check";

alter table "public"."account_statuses" add constraint "account_statuses_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."account_statuses" validate constraint "account_statuses_updated_by_fkey";

alter table "public"."account_statuses" add constraint "account_statuses_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."account_statuses" validate constraint "account_statuses_user_id_fkey";

alter table "public"."comments" add constraint "comments_root_id_fkey" FOREIGN KEY (root_id) REFERENCES public.comments(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."comments" validate constraint "comments_root_id_fkey";

alter table "public"."health_tip_tags" add constraint "health_tip_tags_health_tip_id_fkey" FOREIGN KEY (health_tip_id) REFERENCES public.health_tips(id) ON DELETE CASCADE not valid;

alter table "public"."health_tip_tags" validate constraint "health_tip_tags_health_tip_id_fkey";

alter table "public"."health_tip_tags" add constraint "health_tip_tags_tag_id_fkey" FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON DELETE CASCADE not valid;

alter table "public"."health_tip_tags" validate constraint "health_tip_tags_tag_id_fkey";

alter table "public"."notifications" add constraint "notifications_actor_id_fkey" FOREIGN KEY (actor_id) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."notifications" validate constraint "notifications_actor_id_fkey";

alter table "public"."notifications" add constraint "notifications_entity_type_check" CHECK (((entity_type IS NULL) OR (entity_type = ANY (ARRAY['post'::text, 'comment'::text, 'video'::text, 'campfire'::text, 'campfire_member'::text, 'prompt'::text, 'prompt_response'::text, 'streak'::text, 'anonymous_message'::text, 'anonymous_thread'::text, 'report'::text, 'moderation_action'::text, 'restriction'::text, 'system'::text, 'feature'::text, 'subscription'::text, 'ai_companion'::text, 'ai_session'::text, 'ai_credit'::text, 'collection'::text, 'collection_item'::text, 'user'::text])))) not valid;

alter table "public"."notifications" validate constraint "notifications_entity_type_check";

alter table "public"."notifications" add constraint "notifications_recipient_user_id_fkey" FOREIGN KEY (recipient_user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."notifications" validate constraint "notifications_recipient_user_id_fkey";

alter table "public"."notifications" add constraint "notifications_type_check" CHECK ((type = ANY (ARRAY['post.comment'::text, 'post.vote'::text, 'post.mention'::text, 'post.removed'::text, 'post.flagged'::text, 'comment.reply'::text, 'comment.vote'::text, 'comment.mention'::text, 'comment.removed'::text, 'campfire.invite'::text, 'campfire.joined'::text, 'campfire.role.assigned'::text, 'campfire.role.revoked'::text, 'campfire.post'::text, 'prompt.daily.available'::text, 'prompt.response.reacted'::text, 'prompt.streak.milestone'::text, 'prompt.streak.broken'::text, 'anonymous.message.received'::text, 'anonymous.message.replied'::text, 'anonymous.reshare.allowed'::text, 'video.comment'::text, 'video.like'::text, 'video.mention'::text, 'video.featured'::text, 'collection.post.saved'::text, 'collection.video.saved'::text, 'moderation.report.received'::text, 'moderation.report.resolved'::text, 'moderation.warning.issued'::text, 'moderation.restriction.applied'::text, 'moderation.restriction.lifted'::text, 'system.welcome'::text, 'system.profile.incomplete'::text, 'system.first_post_prompt'::text, 'system.safety_notice'::text, 'system.guideline_update'::text, 'system.feature.unlocked'::text, 'system.pro.expiring'::text, 'system.pro.expired'::text, 'ai.checkin.reminder'::text, 'ai.reflection.ready'::text, 'ai.credit.low'::text, 'ai.credit.reset'::text]))) not valid;

alter table "public"."notifications" validate constraint "notifications_type_check";

alter table "public"."roles" add constraint "roles_role_check" CHECK ((role = ANY (ARRAY['admin'::text, 'platform_moderator'::text, 'support_agent'::text, 'professional'::text, 'mentor'::text]))) not valid;

alter table "public"."roles" validate constraint "roles_role_check";

alter table "public"."user_role_assignments" add constraint "user_role_assignments_assigned_by_fkey" FOREIGN KEY (assigned_by) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."user_role_assignments" validate constraint "user_role_assignments_assigned_by_fkey";

alter table "public"."user_role_assignments" add constraint "user_role_assignments_revocation_order" CHECK (((revoked_at IS NULL) OR (assigned_at <= revoked_at))) not valid;

alter table "public"."user_role_assignments" validate constraint "user_role_assignments_revocation_order";

alter table "public"."user_role_assignments" add constraint "user_role_assignments_revoked_by_fkey" FOREIGN KEY (revoked_by) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."user_role_assignments" validate constraint "user_role_assignments_revoked_by_fkey";

alter table "public"."user_role_assignments" add constraint "user_role_assignments_role_fkey" FOREIGN KEY (role) REFERENCES public.roles(role) ON DELETE RESTRICT not valid;

alter table "public"."user_role_assignments" validate constraint "user_role_assignments_role_fkey";

alter table "public"."user_role_assignments" add constraint "user_role_assignments_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."user_role_assignments" validate constraint "user_role_assignments_user_id_fkey";

alter table "public"."video_likes" add constraint "video_likes_unique_user" UNIQUE using index "video_likes_unique_user";

alter table "public"."video_likes" add constraint "video_likes_user_profile_id_fkey" FOREIGN KEY (user_profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."video_likes" validate constraint "video_likes_user_profile_id_fkey";

alter table "public"."video_likes" add constraint "video_likes_video_id_fkey" FOREIGN KEY (video_id) REFERENCES public.videos(id) ON DELETE CASCADE not valid;

alter table "public"."video_likes" validate constraint "video_likes_video_id_fkey";

alter table "public"."video_tags" add constraint "video_tags_tag_id_fkey" FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON DELETE CASCADE not valid;

alter table "public"."video_tags" validate constraint "video_tags_tag_id_fkey";

alter table "public"."video_tags" add constraint "video_tags_video_id_fkey" FOREIGN KEY (video_id) REFERENCES public.videos(id) ON DELETE CASCADE not valid;

alter table "public"."video_tags" validate constraint "video_tags_video_id_fkey";

alter table "public"."videos" add constraint "videos_author_profile_id_fkey" FOREIGN KEY (author_profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."videos" validate constraint "videos_author_profile_id_fkey";

alter table "public"."videos" add constraint "videos_bunny_video_id_key" UNIQUE using index "videos_bunny_video_id_key";

alter table "public"."videos" add constraint "videos_duration_seconds_check" CHECK ((duration_seconds >= 0)) not valid;

alter table "public"."videos" validate constraint "videos_duration_seconds_check";

alter table "public"."videos" add constraint "videos_visibility_check" CHECK ((visibility = ANY (ARRAY['public'::text, 'unlisted'::text, 'private'::text, 'moderated'::text]))) not valid;

alter table "public"."videos" validate constraint "videos_visibility_check";

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

grant delete on table "public"."account_statuses" to "anon";

grant insert on table "public"."account_statuses" to "anon";

grant references on table "public"."account_statuses" to "anon";

grant select on table "public"."account_statuses" to "anon";

grant trigger on table "public"."account_statuses" to "anon";

grant truncate on table "public"."account_statuses" to "anon";

grant update on table "public"."account_statuses" to "anon";

grant delete on table "public"."account_statuses" to "authenticated";

grant insert on table "public"."account_statuses" to "authenticated";

grant references on table "public"."account_statuses" to "authenticated";

grant select on table "public"."account_statuses" to "authenticated";

grant trigger on table "public"."account_statuses" to "authenticated";

grant truncate on table "public"."account_statuses" to "authenticated";

grant update on table "public"."account_statuses" to "authenticated";

grant delete on table "public"."account_statuses" to "postgres";

grant insert on table "public"."account_statuses" to "postgres";

grant references on table "public"."account_statuses" to "postgres";

grant select on table "public"."account_statuses" to "postgres";

grant trigger on table "public"."account_statuses" to "postgres";

grant truncate on table "public"."account_statuses" to "postgres";

grant update on table "public"."account_statuses" to "postgres";

grant delete on table "public"."account_statuses" to "service_role";

grant insert on table "public"."account_statuses" to "service_role";

grant references on table "public"."account_statuses" to "service_role";

grant select on table "public"."account_statuses" to "service_role";

grant trigger on table "public"."account_statuses" to "service_role";

grant truncate on table "public"."account_statuses" to "service_role";

grant update on table "public"."account_statuses" to "service_role";

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

grant delete on table "public"."collection_items" to "postgres";

grant insert on table "public"."collection_items" to "postgres";

grant references on table "public"."collection_items" to "postgres";

grant select on table "public"."collection_items" to "postgres";

grant trigger on table "public"."collection_items" to "postgres";

grant truncate on table "public"."collection_items" to "postgres";

grant update on table "public"."collection_items" to "postgres";

grant delete on table "public"."collections" to "postgres";

grant insert on table "public"."collections" to "postgres";

grant references on table "public"."collections" to "postgres";

grant select on table "public"."collections" to "postgres";

grant trigger on table "public"."collections" to "postgres";

grant truncate on table "public"."collections" to "postgres";

grant update on table "public"."collections" to "postgres";

grant delete on table "public"."comment_edits" to "postgres";

grant insert on table "public"."comment_edits" to "postgres";

grant references on table "public"."comment_edits" to "postgres";

grant select on table "public"."comment_edits" to "postgres";

grant trigger on table "public"."comment_edits" to "postgres";

grant truncate on table "public"."comment_edits" to "postgres";

grant update on table "public"."comment_edits" to "postgres";

grant delete on table "public"."comment_pins" to "postgres";

grant insert on table "public"."comment_pins" to "postgres";

grant references on table "public"."comment_pins" to "postgres";

grant select on table "public"."comment_pins" to "postgres";

grant trigger on table "public"."comment_pins" to "postgres";

grant truncate on table "public"."comment_pins" to "postgres";

grant update on table "public"."comment_pins" to "postgres";

grant delete on table "public"."comments" to "postgres";

grant insert on table "public"."comments" to "postgres";

grant references on table "public"."comments" to "postgres";

grant select on table "public"."comments" to "postgres";

grant trigger on table "public"."comments" to "postgres";

grant truncate on table "public"."comments" to "postgres";

grant update on table "public"."comments" to "postgres";

grant delete on table "public"."health_tip_categories" to "postgres";

grant insert on table "public"."health_tip_categories" to "postgres";

grant references on table "public"."health_tip_categories" to "postgres";

grant select on table "public"."health_tip_categories" to "postgres";

grant trigger on table "public"."health_tip_categories" to "postgres";

grant truncate on table "public"."health_tip_categories" to "postgres";

grant update on table "public"."health_tip_categories" to "postgres";

grant delete on table "public"."health_tip_sources" to "postgres";

grant insert on table "public"."health_tip_sources" to "postgres";

grant references on table "public"."health_tip_sources" to "postgres";

grant select on table "public"."health_tip_sources" to "postgres";

grant trigger on table "public"."health_tip_sources" to "postgres";

grant truncate on table "public"."health_tip_sources" to "postgres";

grant update on table "public"."health_tip_sources" to "postgres";

grant delete on table "public"."health_tip_tags" to "anon";

grant insert on table "public"."health_tip_tags" to "anon";

grant references on table "public"."health_tip_tags" to "anon";

grant select on table "public"."health_tip_tags" to "anon";

grant trigger on table "public"."health_tip_tags" to "anon";

grant truncate on table "public"."health_tip_tags" to "anon";

grant update on table "public"."health_tip_tags" to "anon";

grant delete on table "public"."health_tip_tags" to "authenticated";

grant insert on table "public"."health_tip_tags" to "authenticated";

grant references on table "public"."health_tip_tags" to "authenticated";

grant select on table "public"."health_tip_tags" to "authenticated";

grant trigger on table "public"."health_tip_tags" to "authenticated";

grant truncate on table "public"."health_tip_tags" to "authenticated";

grant update on table "public"."health_tip_tags" to "authenticated";

grant delete on table "public"."health_tip_tags" to "postgres";

grant insert on table "public"."health_tip_tags" to "postgres";

grant references on table "public"."health_tip_tags" to "postgres";

grant select on table "public"."health_tip_tags" to "postgres";

grant trigger on table "public"."health_tip_tags" to "postgres";

grant truncate on table "public"."health_tip_tags" to "postgres";

grant update on table "public"."health_tip_tags" to "postgres";

grant delete on table "public"."health_tip_tags" to "service_role";

grant insert on table "public"."health_tip_tags" to "service_role";

grant references on table "public"."health_tip_tags" to "service_role";

grant select on table "public"."health_tip_tags" to "service_role";

grant trigger on table "public"."health_tip_tags" to "service_role";

grant truncate on table "public"."health_tip_tags" to "service_role";

grant update on table "public"."health_tip_tags" to "service_role";

grant delete on table "public"."health_tips" to "postgres";

grant insert on table "public"."health_tips" to "postgres";

grant references on table "public"."health_tips" to "postgres";

grant select on table "public"."health_tips" to "postgres";

grant trigger on table "public"."health_tips" to "postgres";

grant truncate on table "public"."health_tips" to "postgres";

grant update on table "public"."health_tips" to "postgres";

grant delete on table "public"."notifications" to "anon";

grant insert on table "public"."notifications" to "anon";

grant references on table "public"."notifications" to "anon";

grant select on table "public"."notifications" to "anon";

grant trigger on table "public"."notifications" to "anon";

grant truncate on table "public"."notifications" to "anon";

grant update on table "public"."notifications" to "anon";

grant delete on table "public"."notifications" to "authenticated";

grant insert on table "public"."notifications" to "authenticated";

grant references on table "public"."notifications" to "authenticated";

grant select on table "public"."notifications" to "authenticated";

grant trigger on table "public"."notifications" to "authenticated";

grant truncate on table "public"."notifications" to "authenticated";

grant update on table "public"."notifications" to "authenticated";

grant delete on table "public"."notifications" to "postgres";

grant insert on table "public"."notifications" to "postgres";

grant references on table "public"."notifications" to "postgres";

grant select on table "public"."notifications" to "postgres";

grant trigger on table "public"."notifications" to "postgres";

grant truncate on table "public"."notifications" to "postgres";

grant update on table "public"."notifications" to "postgres";

grant delete on table "public"."notifications" to "service_role";

grant insert on table "public"."notifications" to "service_role";

grant references on table "public"."notifications" to "service_role";

grant select on table "public"."notifications" to "service_role";

grant trigger on table "public"."notifications" to "service_role";

grant truncate on table "public"."notifications" to "service_role";

grant update on table "public"."notifications" to "service_role";

grant delete on table "public"."post_media" to "postgres";

grant insert on table "public"."post_media" to "postgres";

grant references on table "public"."post_media" to "postgres";

grant select on table "public"."post_media" to "postgres";

grant trigger on table "public"."post_media" to "postgres";

grant truncate on table "public"."post_media" to "postgres";

grant update on table "public"."post_media" to "postgres";

grant delete on table "public"."post_slides" to "postgres";

grant insert on table "public"."post_slides" to "postgres";

grant references on table "public"."post_slides" to "postgres";

grant select on table "public"."post_slides" to "postgres";

grant trigger on table "public"."post_slides" to "postgres";

grant truncate on table "public"."post_slides" to "postgres";

grant update on table "public"."post_slides" to "postgres";

grant delete on table "public"."post_tags" to "postgres";

grant insert on table "public"."post_tags" to "postgres";

grant references on table "public"."post_tags" to "postgres";

grant select on table "public"."post_tags" to "postgres";

grant trigger on table "public"."post_tags" to "postgres";

grant truncate on table "public"."post_tags" to "postgres";

grant update on table "public"."post_tags" to "postgres";

grant delete on table "public"."post_views" to "postgres";

grant insert on table "public"."post_views" to "postgres";

grant references on table "public"."post_views" to "postgres";

grant select on table "public"."post_views" to "postgres";

grant trigger on table "public"."post_views" to "postgres";

grant truncate on table "public"."post_views" to "postgres";

grant update on table "public"."post_views" to "postgres";

grant delete on table "public"."post_votes" to "postgres";

grant insert on table "public"."post_votes" to "postgres";

grant references on table "public"."post_votes" to "postgres";

grant select on table "public"."post_votes" to "postgres";

grant trigger on table "public"."post_votes" to "postgres";

grant truncate on table "public"."post_votes" to "postgres";

grant update on table "public"."post_votes" to "postgres";

grant delete on table "public"."posts" to "postgres";

grant insert on table "public"."posts" to "postgres";

grant references on table "public"."posts" to "postgres";

grant select on table "public"."posts" to "postgres";

grant trigger on table "public"."posts" to "postgres";

grant truncate on table "public"."posts" to "postgres";

grant update on table "public"."posts" to "postgres";

grant delete on table "public"."profiles" to "postgres";

grant insert on table "public"."profiles" to "postgres";

grant references on table "public"."profiles" to "postgres";

grant select on table "public"."profiles" to "postgres";

grant trigger on table "public"."profiles" to "postgres";

grant truncate on table "public"."profiles" to "postgres";

grant update on table "public"."profiles" to "postgres";

grant delete on table "public"."roles" to "anon";

grant insert on table "public"."roles" to "anon";

grant references on table "public"."roles" to "anon";

grant select on table "public"."roles" to "anon";

grant trigger on table "public"."roles" to "anon";

grant truncate on table "public"."roles" to "anon";

grant update on table "public"."roles" to "anon";

grant delete on table "public"."roles" to "authenticated";

grant insert on table "public"."roles" to "authenticated";

grant references on table "public"."roles" to "authenticated";

grant select on table "public"."roles" to "authenticated";

grant trigger on table "public"."roles" to "authenticated";

grant truncate on table "public"."roles" to "authenticated";

grant update on table "public"."roles" to "authenticated";

grant delete on table "public"."roles" to "postgres";

grant insert on table "public"."roles" to "postgres";

grant references on table "public"."roles" to "postgres";

grant select on table "public"."roles" to "postgres";

grant trigger on table "public"."roles" to "postgres";

grant truncate on table "public"."roles" to "postgres";

grant update on table "public"."roles" to "postgres";

grant delete on table "public"."roles" to "service_role";

grant insert on table "public"."roles" to "service_role";

grant references on table "public"."roles" to "service_role";

grant select on table "public"."roles" to "service_role";

grant trigger on table "public"."roles" to "service_role";

grant truncate on table "public"."roles" to "service_role";

grant update on table "public"."roles" to "service_role";

grant delete on table "public"."tags" to "postgres";

grant insert on table "public"."tags" to "postgres";

grant references on table "public"."tags" to "postgres";

grant select on table "public"."tags" to "postgres";

grant trigger on table "public"."tags" to "postgres";

grant truncate on table "public"."tags" to "postgres";

grant update on table "public"."tags" to "postgres";

grant delete on table "public"."user_preferences" to "postgres";

grant insert on table "public"."user_preferences" to "postgres";

grant references on table "public"."user_preferences" to "postgres";

grant select on table "public"."user_preferences" to "postgres";

grant trigger on table "public"."user_preferences" to "postgres";

grant truncate on table "public"."user_preferences" to "postgres";

grant update on table "public"."user_preferences" to "postgres";

grant delete on table "public"."user_role_assignments" to "anon";

grant insert on table "public"."user_role_assignments" to "anon";

grant references on table "public"."user_role_assignments" to "anon";

grant select on table "public"."user_role_assignments" to "anon";

grant trigger on table "public"."user_role_assignments" to "anon";

grant truncate on table "public"."user_role_assignments" to "anon";

grant update on table "public"."user_role_assignments" to "anon";

grant delete on table "public"."user_role_assignments" to "authenticated";

grant insert on table "public"."user_role_assignments" to "authenticated";

grant references on table "public"."user_role_assignments" to "authenticated";

grant select on table "public"."user_role_assignments" to "authenticated";

grant trigger on table "public"."user_role_assignments" to "authenticated";

grant truncate on table "public"."user_role_assignments" to "authenticated";

grant update on table "public"."user_role_assignments" to "authenticated";

grant delete on table "public"."user_role_assignments" to "postgres";

grant insert on table "public"."user_role_assignments" to "postgres";

grant references on table "public"."user_role_assignments" to "postgres";

grant select on table "public"."user_role_assignments" to "postgres";

grant trigger on table "public"."user_role_assignments" to "postgres";

grant truncate on table "public"."user_role_assignments" to "postgres";

grant update on table "public"."user_role_assignments" to "postgres";

grant delete on table "public"."user_role_assignments" to "service_role";

grant insert on table "public"."user_role_assignments" to "service_role";

grant references on table "public"."user_role_assignments" to "service_role";

grant select on table "public"."user_role_assignments" to "service_role";

grant trigger on table "public"."user_role_assignments" to "service_role";

grant truncate on table "public"."user_role_assignments" to "service_role";

grant update on table "public"."user_role_assignments" to "service_role";

grant delete on table "public"."video_likes" to "anon";

grant insert on table "public"."video_likes" to "anon";

grant references on table "public"."video_likes" to "anon";

grant select on table "public"."video_likes" to "anon";

grant trigger on table "public"."video_likes" to "anon";

grant truncate on table "public"."video_likes" to "anon";

grant update on table "public"."video_likes" to "anon";

grant delete on table "public"."video_likes" to "authenticated";

grant insert on table "public"."video_likes" to "authenticated";

grant references on table "public"."video_likes" to "authenticated";

grant select on table "public"."video_likes" to "authenticated";

grant trigger on table "public"."video_likes" to "authenticated";

grant truncate on table "public"."video_likes" to "authenticated";

grant update on table "public"."video_likes" to "authenticated";

grant delete on table "public"."video_likes" to "postgres";

grant insert on table "public"."video_likes" to "postgres";

grant references on table "public"."video_likes" to "postgres";

grant select on table "public"."video_likes" to "postgres";

grant trigger on table "public"."video_likes" to "postgres";

grant truncate on table "public"."video_likes" to "postgres";

grant update on table "public"."video_likes" to "postgres";

grant delete on table "public"."video_likes" to "service_role";

grant insert on table "public"."video_likes" to "service_role";

grant references on table "public"."video_likes" to "service_role";

grant select on table "public"."video_likes" to "service_role";

grant trigger on table "public"."video_likes" to "service_role";

grant truncate on table "public"."video_likes" to "service_role";

grant update on table "public"."video_likes" to "service_role";

grant delete on table "public"."video_tags" to "anon";

grant insert on table "public"."video_tags" to "anon";

grant references on table "public"."video_tags" to "anon";

grant select on table "public"."video_tags" to "anon";

grant trigger on table "public"."video_tags" to "anon";

grant truncate on table "public"."video_tags" to "anon";

grant update on table "public"."video_tags" to "anon";

grant delete on table "public"."video_tags" to "authenticated";

grant insert on table "public"."video_tags" to "authenticated";

grant references on table "public"."video_tags" to "authenticated";

grant select on table "public"."video_tags" to "authenticated";

grant trigger on table "public"."video_tags" to "authenticated";

grant truncate on table "public"."video_tags" to "authenticated";

grant update on table "public"."video_tags" to "authenticated";

grant delete on table "public"."video_tags" to "postgres";

grant insert on table "public"."video_tags" to "postgres";

grant references on table "public"."video_tags" to "postgres";

grant select on table "public"."video_tags" to "postgres";

grant trigger on table "public"."video_tags" to "postgres";

grant truncate on table "public"."video_tags" to "postgres";

grant update on table "public"."video_tags" to "postgres";

grant delete on table "public"."video_tags" to "service_role";

grant insert on table "public"."video_tags" to "service_role";

grant references on table "public"."video_tags" to "service_role";

grant select on table "public"."video_tags" to "service_role";

grant trigger on table "public"."video_tags" to "service_role";

grant truncate on table "public"."video_tags" to "service_role";

grant update on table "public"."video_tags" to "service_role";

grant delete on table "public"."videos" to "anon";

grant insert on table "public"."videos" to "anon";

grant references on table "public"."videos" to "anon";

grant select on table "public"."videos" to "anon";

grant trigger on table "public"."videos" to "anon";

grant truncate on table "public"."videos" to "anon";

grant update on table "public"."videos" to "anon";

grant delete on table "public"."videos" to "authenticated";

grant insert on table "public"."videos" to "authenticated";

grant references on table "public"."videos" to "authenticated";

grant select on table "public"."videos" to "authenticated";

grant trigger on table "public"."videos" to "authenticated";

grant truncate on table "public"."videos" to "authenticated";

grant update on table "public"."videos" to "authenticated";

grant delete on table "public"."videos" to "postgres";

grant insert on table "public"."videos" to "postgres";

grant references on table "public"."videos" to "postgres";

grant select on table "public"."videos" to "postgres";

grant trigger on table "public"."videos" to "postgres";

grant truncate on table "public"."videos" to "postgres";

grant update on table "public"."videos" to "postgres";

grant delete on table "public"."videos" to "service_role";

grant insert on table "public"."videos" to "service_role";

grant references on table "public"."videos" to "service_role";

grant select on table "public"."videos" to "service_role";

grant trigger on table "public"."videos" to "service_role";

grant truncate on table "public"."videos" to "service_role";

grant update on table "public"."videos" to "service_role";


  create policy "Enable read access for all authenticated users"
  on "public"."campfire_realms"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Enable read access for auth users"
  on "public"."campfire_settings"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Enable read access for auth users"
  on "public"."campfires"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Enable read access for auth users"
  on "public"."comments"
  as permissive
  for select
  to authenticated
using (true);



  create policy "notifications_delete_own"
  on "public"."notifications"
  as permissive
  for delete
  to authenticated
using ((recipient_user_id = auth.uid()));



  create policy "notifications_select_own"
  on "public"."notifications"
  as permissive
  for select
  to authenticated
using ((recipient_user_id = auth.uid()));



  create policy "notifications_update_read_state"
  on "public"."notifications"
  as permissive
  for update
  to authenticated
using ((recipient_user_id = auth.uid()))
with check ((recipient_user_id = auth.uid()));




