export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      account_statuses: {
        Row: {
          reason: string | null;
          status: string;
          updated_at: string;
          updated_by: string | null;
          user_id: string;
        };
        Insert: {
          reason?: string | null;
          status?: string;
          updated_at?: string;
          updated_by?: string | null;
          user_id: string;
        };
        Update: {
          reason?: string | null;
          status?: string;
          updated_at?: string;
          updated_by?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "account_statuses_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "account_statuses_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      campfire_guide_resources: {
        Row: {
          campfire_id: string;
          created_at: string;
          id: number;
          label: string;
          sort_order: number;
          url: string | null;
        };
        Insert: {
          campfire_id: string;
          created_at?: string;
          id?: number;
          label: string;
          sort_order?: number;
          url?: string | null;
        };
        Update: {
          campfire_id?: string;
          created_at?: string;
          id?: number;
          label?: string;
          sort_order?: number;
          url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "campfire_guide_resources_campfire_id_fkey";
            columns: ["campfire_id"];
            isOneToOne: false;
            referencedRelation: "campfires";
            referencedColumns: ["id"];
          },
        ];
      };
      campfire_lanes: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          is_active: boolean;
          is_high_safety: boolean | null;
          key: string;
          name: string;
          realm_id: string;
          sort_order: number;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          is_high_safety?: boolean | null;
          key: string;
          name: string;
          realm_id: string;
          sort_order?: number;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          is_high_safety?: boolean | null;
          key?: string;
          name?: string;
          realm_id?: string;
          sort_order?: number;
        };
        Relationships: [
          {
            foreignKeyName: "campfire_lanes_realm_id_fkey";
            columns: ["realm_id"];
            isOneToOne: false;
            referencedRelation: "campfire_realms";
            referencedColumns: ["id"];
          },
        ];
      };
      campfire_members: {
        Row: {
          campfire_id: string;
          is_favorite: boolean;
          joined_at: string;
          role: Database["public"]["Enums"]["campfire_role"];
          status: Database["public"]["Enums"]["campfire_member_status"];
          user_id: string;
        };
        Insert: {
          campfire_id: string;
          is_favorite?: boolean;
          joined_at?: string;
          role?: Database["public"]["Enums"]["campfire_role"];
          status?: Database["public"]["Enums"]["campfire_member_status"];
          user_id: string;
        };
        Update: {
          campfire_id?: string;
          is_favorite?: boolean;
          joined_at?: string;
          role?: Database["public"]["Enums"]["campfire_role"];
          status?: Database["public"]["Enums"]["campfire_member_status"];
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "campfire_members_campfire_id_fkey";
            columns: ["campfire_id"];
            isOneToOne: false;
            referencedRelation: "campfires";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "campfire_members_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      campfire_realms: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          is_active: boolean;
          is_high_safety: boolean | null;
          key: string;
          name: string;
          sort_order: number;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          is_high_safety?: boolean | null;
          key: string;
          name: string;
          sort_order?: number;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          is_high_safety?: boolean | null;
          key?: string;
          name?: string;
          sort_order?: number;
        };
        Relationships: [];
      };
      campfire_settings: {
        Row: {
          campfire_id: string;
          created_at: string;
          guide_enabled: boolean;
          guide_header_image: string | null;
          guide_header_layout: string | null;
          guide_show_on_join: boolean;
          guide_welcome_message: string;
          updated_at: string;
        };
        Insert: {
          campfire_id: string;
          created_at?: string;
          guide_enabled?: boolean;
          guide_header_image?: string | null;
          guide_header_layout?: string | null;
          guide_show_on_join?: boolean;
          guide_welcome_message?: string;
          updated_at?: string;
        };
        Update: {
          campfire_id?: string;
          created_at?: string;
          guide_enabled?: boolean;
          guide_header_image?: string | null;
          guide_header_layout?: string | null;
          guide_show_on_join?: boolean;
          guide_welcome_message?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "campfire_settings_campfire_id_fkey";
            columns: ["campfire_id"];
            isOneToOne: true;
            referencedRelation: "campfires";
            referencedColumns: ["id"];
          },
        ];
      };
      campfires: {
        Row: {
          banner_path: string | null;
          created_at: string;
          created_by: string;
          description: string | null;
          icon_path: string | null;
          id: string;
          interaction_style: Database["public"]["Enums"]["interaction_style_enum"];
          lane_id: string | null;
          member_count: number;
          name: string;
          realm_id: string;
          slug: string;
          updated_at: string;
          visibility: Database["public"]["Enums"]["campfire_visibility"];
        };
        Insert: {
          banner_path?: string | null;
          created_at?: string;
          created_by: string;
          description?: string | null;
          icon_path?: string | null;
          id?: string;
          interaction_style?: Database["public"]["Enums"]["interaction_style_enum"];
          lane_id?: string | null;
          member_count?: number;
          name: string;
          realm_id: string;
          slug: string;
          updated_at?: string;
          visibility?: Database["public"]["Enums"]["campfire_visibility"];
        };
        Update: {
          banner_path?: string | null;
          created_at?: string;
          created_by?: string;
          description?: string | null;
          icon_path?: string | null;
          id?: string;
          interaction_style?: Database["public"]["Enums"]["interaction_style_enum"];
          lane_id?: string | null;
          member_count?: number;
          name?: string;
          realm_id?: string;
          slug?: string;
          updated_at?: string;
          visibility?: Database["public"]["Enums"]["campfire_visibility"];
        };
        Relationships: [
          {
            foreignKeyName: "campfires_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "campfires_lane_id_fkey";
            columns: ["lane_id"];
            isOneToOne: false;
            referencedRelation: "campfire_lanes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "campfires_realm_id_fkey";
            columns: ["realm_id"];
            isOneToOne: false;
            referencedRelation: "campfire_realms";
            referencedColumns: ["id"];
          },
        ];
      };
      collection_items: {
        Row: {
          collection_id: string;
          created_at: string;
          entity_id: string;
          entity_type: string;
          id: string;
          is_pinned: boolean;
          position: number;
          user_id: string;
        };
        Insert: {
          collection_id: string;
          created_at?: string;
          entity_id: string;
          entity_type: string;
          id?: string;
          is_pinned?: boolean;
          position?: number;
          user_id: string;
        };
        Update: {
          collection_id?: string;
          created_at?: string;
          entity_id?: string;
          entity_type?: string;
          id?: string;
          is_pinned?: boolean;
          position?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "collection_items_collection_id_fkey";
            columns: ["collection_id"];
            isOneToOne: false;
            referencedRelation: "collections";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "collection_items_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      collections: {
        Row: {
          created_at: string;
          id: string;
          is_pinned: boolean;
          name: string;
          name_normalized: string;
          position: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_pinned?: boolean;
          name: string;
          name_normalized: string;
          position?: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_pinned?: boolean;
          name?: string;
          name_normalized?: string;
          position?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "collections_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      comment_edits: {
        Row: {
          comment_id: number;
          edited_at: string;
          edited_by: string;
          id: number;
          previous_body: string;
        };
        Insert: {
          comment_id: number;
          edited_at?: string;
          edited_by: string;
          id?: number;
          previous_body: string;
        };
        Update: {
          comment_id?: number;
          edited_at?: string;
          edited_by?: string;
          id?: number;
          previous_body?: string;
        };
        Relationships: [
          {
            foreignKeyName: "comment_edits_comment_id_fkey";
            columns: ["comment_id"];
            isOneToOne: false;
            referencedRelation: "comments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "comment_edits_edited_by_fkey";
            columns: ["edited_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      comment_pins: {
        Row: {
          comment_id: number;
          id: number;
          pin_type: string;
          pinned_at: string;
          pinned_by: string;
          post_id: string;
        };
        Insert: {
          comment_id: number;
          id?: number;
          pin_type: string;
          pinned_at?: string;
          pinned_by: string;
          post_id: string;
        };
        Update: {
          comment_id?: number;
          id?: number;
          pin_type?: string;
          pinned_at?: string;
          pinned_by?: string;
          post_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "comment_pins_comment_id_fkey";
            columns: ["comment_id"];
            isOneToOne: true;
            referencedRelation: "comments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "comment_pins_pinned_by_fkey";
            columns: ["pinned_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "comment_pins_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
        ];
      };
      comments: {
        Row: {
          author_avatar_url_snapshot: string | null;
          author_id: string | null;
          author_name_snapshot: string;
          body: string;
          campfire_id: string | null;
          created_at: string;
          deleted_at: string | null;
          deleted_by: string | null;
          depth: number | null;
          hidden_at: string | null;
          hidden_by: string | null;
          id: number;
          is_ai_suggestion: boolean;
          moderation_reason: string | null;
          parent_comment_id: number | null;
          post_id: string;
          removed_at: string | null;
          removed_by: string | null;
          status: string;
          thread_path: unknown;
          updated_at: string;
        };
        Insert: {
          author_avatar_url_snapshot?: string | null;
          author_id?: string | null;
          author_name_snapshot: string;
          body: string;
          campfire_id?: string | null;
          created_at?: string;
          deleted_at?: string | null;
          deleted_by?: string | null;
          depth?: number | null;
          hidden_at?: string | null;
          hidden_by?: string | null;
          id?: number;
          is_ai_suggestion?: boolean;
          moderation_reason?: string | null;
          parent_comment_id?: number | null;
          post_id: string;
          removed_at?: string | null;
          removed_by?: string | null;
          status?: string;
          thread_path: unknown;
          updated_at?: string;
        };
        Update: {
          author_avatar_url_snapshot?: string | null;
          author_id?: string | null;
          author_name_snapshot?: string;
          body?: string;
          campfire_id?: string | null;
          created_at?: string;
          deleted_at?: string | null;
          deleted_by?: string | null;
          depth?: number | null;
          hidden_at?: string | null;
          hidden_by?: string | null;
          id?: number;
          is_ai_suggestion?: boolean;
          moderation_reason?: string | null;
          parent_comment_id?: number | null;
          post_id?: string;
          removed_at?: string | null;
          removed_by?: string | null;
          status?: string;
          thread_path?: unknown;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "comments_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "comments_campfire_id_fkey";
            columns: ["campfire_id"];
            isOneToOne: false;
            referencedRelation: "campfires";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "comments_deleted_by_fkey";
            columns: ["deleted_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "comments_hidden_by_fkey";
            columns: ["hidden_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "comments_parent_comment_id_fkey";
            columns: ["parent_comment_id"];
            isOneToOne: false;
            referencedRelation: "comments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "comments_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "comments_removed_by_fkey";
            columns: ["removed_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      health_tip_categories: {
        Row: {
          created_at: string;
          display_name: string;
          id: string;
          is_active: boolean;
          key: string;
          sort_order: number;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          display_name: string;
          id?: string;
          is_active?: boolean;
          key: string;
          sort_order?: number;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          display_name?: string;
          id?: string;
          is_active?: boolean;
          key?: string;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      health_tip_sources: {
        Row: {
          created_at: string;
          health_tip_id: string;
          id: string;
          notes: string | null;
          published_year: number | null;
          publisher: string | null;
          source_type: Database["public"]["Enums"]["health_tip_source_type"];
          title: string | null;
          url: string | null;
        };
        Insert: {
          created_at?: string;
          health_tip_id: string;
          id?: string;
          notes?: string | null;
          published_year?: number | null;
          publisher?: string | null;
          source_type: Database["public"]["Enums"]["health_tip_source_type"];
          title?: string | null;
          url?: string | null;
        };
        Update: {
          created_at?: string;
          health_tip_id?: string;
          id?: string;
          notes?: string | null;
          published_year?: number | null;
          publisher?: string | null;
          source_type?: Database["public"]["Enums"]["health_tip_source_type"];
          title?: string | null;
          url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "health_tip_sources_health_tip_id_fkey";
            columns: ["health_tip_id"];
            isOneToOne: false;
            referencedRelation: "health_tips";
            referencedColumns: ["id"];
          },
        ];
      };
      health_tip_tags: {
        Row: {
          created_at: string;
          health_tip_id: string;
          tag_id: number;
        };
        Insert: {
          created_at?: string;
          health_tip_id: string;
          tag_id: number;
        };
        Update: {
          created_at?: string;
          health_tip_id?: string;
          tag_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "health_tip_tags_health_tip_id_fkey";
            columns: ["health_tip_id"];
            isOneToOne: false;
            referencedRelation: "health_tips";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "health_tip_tags_tag_id_fkey";
            columns: ["tag_id"];
            isOneToOne: false;
            referencedRelation: "tags";
            referencedColumns: ["id"];
          },
        ];
      };
      health_tips: {
        Row: {
          approved_by: string | null;
          category_id: string | null;
          content: string;
          content_format: string;
          created_at: string;
          created_by: string | null;
          excerpt: string | null;
          id: string;
          is_sponsored: boolean;
          language_code: string;
          published_at: string | null;
          read_time_minutes: number;
          rejected_reason: string | null;
          reviewed_at: string | null;
          sensitive_level: Database["public"]["Enums"]["health_tip_sensitivity"];
          slug: string;
          sponsor_label: string | null;
          status: Database["public"]["Enums"]["health_tip_status"];
          title: string;
          updated_at: string;
        };
        Insert: {
          approved_by?: string | null;
          category_id?: string | null;
          content: string;
          content_format?: string;
          created_at?: string;
          created_by?: string | null;
          excerpt?: string | null;
          id?: string;
          is_sponsored?: boolean;
          language_code?: string;
          published_at?: string | null;
          read_time_minutes?: number;
          rejected_reason?: string | null;
          reviewed_at?: string | null;
          sensitive_level?: Database["public"]["Enums"]["health_tip_sensitivity"];
          slug: string;
          sponsor_label?: string | null;
          status?: Database["public"]["Enums"]["health_tip_status"];
          title: string;
          updated_at?: string;
        };
        Update: {
          approved_by?: string | null;
          category_id?: string | null;
          content?: string;
          content_format?: string;
          created_at?: string;
          created_by?: string | null;
          excerpt?: string | null;
          id?: string;
          is_sponsored?: boolean;
          language_code?: string;
          published_at?: string | null;
          read_time_minutes?: number;
          rejected_reason?: string | null;
          reviewed_at?: string | null;
          sensitive_level?: Database["public"]["Enums"]["health_tip_sensitivity"];
          slug?: string;
          sponsor_label?: string | null;
          status?: Database["public"]["Enums"]["health_tip_status"];
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "health_tips_approved_by_fkey";
            columns: ["approved_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "health_tips_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "health_tip_categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "health_tips_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      post_media: {
        Row: {
          alt_text: string | null;
          blurhash: string | null;
          created_at: string;
          created_by: string;
          dominant_hex: string | null;
          file_size: number | null;
          height: number | null;
          id: string;
          mime_type: string;
          post_id: string;
          sort_order: number;
          storage_path: string;
          type: Database["public"]["Enums"]["post_media_type"];
          width: number | null;
        };
        Insert: {
          alt_text?: string | null;
          blurhash?: string | null;
          created_at?: string;
          created_by: string;
          dominant_hex?: string | null;
          file_size?: number | null;
          height?: number | null;
          id?: string;
          mime_type: string;
          post_id: string;
          sort_order?: number;
          storage_path: string;
          type?: Database["public"]["Enums"]["post_media_type"];
          width?: number | null;
        };
        Update: {
          alt_text?: string | null;
          blurhash?: string | null;
          created_at?: string;
          created_by?: string;
          dominant_hex?: string | null;
          file_size?: number | null;
          height?: number | null;
          id?: string;
          mime_type?: string;
          post_id?: string;
          sort_order?: number;
          storage_path?: string;
          type?: Database["public"]["Enums"]["post_media_type"];
          width?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "post_media_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "post_media_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
        ];
      };
      post_slides: {
        Row: {
          content: string;
          created_at: string;
          id: string;
          post_id: string;
          slide_index: number;
        };
        Insert: {
          content: string;
          created_at?: string;
          id?: string;
          post_id: string;
          slide_index: number;
        };
        Update: {
          content?: string;
          created_at?: string;
          id?: string;
          post_id?: string;
          slide_index?: number;
        };
        Relationships: [
          {
            foreignKeyName: "post_slides_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
        ];
      };
      post_tags: {
        Row: {
          created_at: string;
          post_id: string;
          tag_id: number;
        };
        Insert: {
          created_at?: string;
          post_id: string;
          tag_id: number;
        };
        Update: {
          created_at?: string;
          post_id?: string;
          tag_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "post_tags_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "post_tags_tag_id_fkey";
            columns: ["tag_id"];
            isOneToOne: false;
            referencedRelation: "tags";
            referencedColumns: ["id"];
          },
        ];
      };
      post_views: {
        Row: {
          created_at: string;
          post_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          post_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          post_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "post_views_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "post_views_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      post_votes: {
        Row: {
          created_at: string;
          post_id: string;
          updated_at: string;
          user_id: string;
          vote_type: Database["public"]["Enums"]["vote_type"];
        };
        Insert: {
          created_at?: string;
          post_id: string;
          updated_at?: string;
          user_id: string;
          vote_type: Database["public"]["Enums"]["vote_type"];
        };
        Update: {
          created_at?: string;
          post_id?: string;
          updated_at?: string;
          user_id?: string;
          vote_type?: Database["public"]["Enums"]["vote_type"];
        };
        Relationships: [
          {
            foreignKeyName: "post_votes_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "post_votes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      posts: {
        Row: {
          author_avatar_snapshot: string | null;
          author_display_mode: Database["public"]["Enums"]["author_display_mode"];
          author_id: string;
          author_name_snapshot: string;
          campfire_id: string | null;
          content_text: string;
          created_at: string;
          delete_reason: string | null;
          deleted_at: string | null;
          deleted_by: string | null;
          downvotes_count: number;
          expires_at: string | null;
          hero_media_id: string | null;
          id: string;
          is_sensitive: boolean;
          media_count: number;
          mood: Database["public"]["Enums"]["post_mood"];
          post_kind: Database["public"]["Enums"]["post_kind"];
          upvotes_count: number;
        };
        Insert: {
          author_avatar_snapshot?: string | null;
          author_display_mode?: Database["public"]["Enums"]["author_display_mode"];
          author_id: string;
          author_name_snapshot: string;
          campfire_id?: string | null;
          content_text: string;
          created_at?: string;
          delete_reason?: string | null;
          deleted_at?: string | null;
          deleted_by?: string | null;
          downvotes_count?: number;
          expires_at?: string | null;
          hero_media_id?: string | null;
          id?: string;
          is_sensitive?: boolean;
          media_count?: number;
          mood?: Database["public"]["Enums"]["post_mood"];
          post_kind?: Database["public"]["Enums"]["post_kind"];
          upvotes_count?: number;
        };
        Update: {
          author_avatar_snapshot?: string | null;
          author_display_mode?: Database["public"]["Enums"]["author_display_mode"];
          author_id?: string;
          author_name_snapshot?: string;
          campfire_id?: string | null;
          content_text?: string;
          created_at?: string;
          delete_reason?: string | null;
          deleted_at?: string | null;
          deleted_by?: string | null;
          downvotes_count?: number;
          expires_at?: string | null;
          hero_media_id?: string | null;
          id?: string;
          is_sensitive?: boolean;
          media_count?: number;
          mood?: Database["public"]["Enums"]["post_mood"];
          post_kind?: Database["public"]["Enums"]["post_kind"];
          upvotes_count?: number;
        };
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "posts_campfire_id_fkey";
            columns: ["campfire_id"];
            isOneToOne: false;
            referencedRelation: "campfires";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "posts_deleted_by_fkey";
            columns: ["deleted_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "posts_hero_media_id_fkey";
            columns: ["hero_media_id"];
            isOneToOne: false;
            referencedRelation: "post_media";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          config: string | null;
          created_at: string;
          id: string;
          is_anonymous: boolean;
          is_verified_badge: boolean;
          reputation_score: number;
          theme: string | null;
          updated_at: string;
          username: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          config?: string | null;
          created_at?: string;
          id: string;
          is_anonymous?: boolean;
          is_verified_badge?: boolean;
          reputation_score?: number;
          theme?: string | null;
          updated_at?: string;
          username?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          config?: string | null;
          created_at?: string;
          id?: string;
          is_anonymous?: boolean;
          is_verified_badge?: boolean;
          reputation_score?: number;
          theme?: string | null;
          updated_at?: string;
          username?: string | null;
        };
        Relationships: [];
      };
      roles: {
        Row: {
          created_at: string;
          description: string;
          role: string;
        };
        Insert: {
          created_at?: string;
          description: string;
          role: string;
        };
        Update: {
          created_at?: string;
          description?: string;
          role?: string;
        };
        Relationships: [];
      };
      tags: {
        Row: {
          count: number;
          created_at: string;
          id: number;
          name: string;
        };
        Insert: {
          count?: number;
          created_at?: string;
          id?: number;
          name: string;
        };
        Update: {
          count?: number;
          created_at?: string;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      user_preferences: {
        Row: {
          allow_anonymous_replies: boolean;
          auto_save_drafts: boolean;
          created_at: string;
          daily_prompt_enabled: boolean;
          guided_tour_enabled: boolean;
          loading_experience: Database["public"]["Enums"]["loading_experience_types"];
          mark_sensitive_by_default: boolean;
          notifications_enabled: boolean;
          preferred_language: string;
          push_enabled: boolean;
          sensitive_content_mode: Database["public"]["Enums"]["sensitive_content_mode"];
          theme: Database["public"]["Enums"]["theme_options"];
          updated_at: string;
          user_id: string;
        };
        Insert: {
          allow_anonymous_replies?: boolean;
          auto_save_drafts?: boolean;
          created_at?: string;
          daily_prompt_enabled?: boolean;
          guided_tour_enabled?: boolean;
          loading_experience?: Database["public"]["Enums"]["loading_experience_types"];
          mark_sensitive_by_default?: boolean;
          notifications_enabled?: boolean;
          preferred_language?: string;
          push_enabled?: boolean;
          sensitive_content_mode?: Database["public"]["Enums"]["sensitive_content_mode"];
          theme?: Database["public"]["Enums"]["theme_options"];
          updated_at?: string;
          user_id: string;
        };
        Update: {
          allow_anonymous_replies?: boolean;
          auto_save_drafts?: boolean;
          created_at?: string;
          daily_prompt_enabled?: boolean;
          guided_tour_enabled?: boolean;
          loading_experience?: Database["public"]["Enums"]["loading_experience_types"];
          mark_sensitive_by_default?: boolean;
          notifications_enabled?: boolean;
          preferred_language?: string;
          push_enabled?: boolean;
          sensitive_content_mode?: Database["public"]["Enums"]["sensitive_content_mode"];
          theme?: Database["public"]["Enums"]["theme_options"];
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      user_role_assignments: {
        Row: {
          assigned_at: string;
          assigned_by: string | null;
          id: string;
          reason: string | null;
          revoked_at: string | null;
          revoked_by: string | null;
          role: string;
          user_id: string;
        };
        Insert: {
          assigned_at?: string;
          assigned_by?: string | null;
          id?: string;
          reason?: string | null;
          revoked_at?: string | null;
          revoked_by?: string | null;
          role: string;
          user_id: string;
        };
        Update: {
          assigned_at?: string;
          assigned_by?: string | null;
          id?: string;
          reason?: string | null;
          revoked_at?: string | null;
          revoked_by?: string | null;
          role?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_role_assignments_assigned_by_fkey";
            columns: ["assigned_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_role_assignments_revoked_by_fkey";
            columns: ["revoked_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_role_assignments_role_fkey";
            columns: ["role"];
            isOneToOne: false;
            referencedRelation: "roles";
            referencedColumns: ["role"];
          },
          {
            foreignKeyName: "user_role_assignments_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      video_likes: {
        Row: {
          created_at: string;
          id: number;
          user_profile_id: string;
          video_id: string;
        };
        Insert: {
          created_at?: string;
          id?: never;
          user_profile_id: string;
          video_id: string;
        };
        Update: {
          created_at?: string;
          id?: never;
          user_profile_id?: string;
          video_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "video_likes_user_profile_id_fkey";
            columns: ["user_profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "video_likes_video_id_fkey";
            columns: ["video_id"];
            isOneToOne: false;
            referencedRelation: "videos";
            referencedColumns: ["id"];
          },
        ];
      };
      video_tags: {
        Row: {
          created_at: string;
          tag_id: number;
          video_id: string;
        };
        Insert: {
          created_at?: string;
          tag_id: number;
          video_id: string;
        };
        Update: {
          created_at?: string;
          tag_id?: number;
          video_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "video_tags_tag_id_fkey";
            columns: ["tag_id"];
            isOneToOne: false;
            referencedRelation: "tags";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "video_tags_video_id_fkey";
            columns: ["video_id"];
            isOneToOne: false;
            referencedRelation: "videos";
            referencedColumns: ["id"];
          },
        ];
      };
      videos: {
        Row: {
          author_avatar_url: string;
          author_display_name: string;
          author_profile_id: string;
          bunny_video_id: string;
          created_at: string;
          deleted_at: string | null;
          description: string | null;
          duration_seconds: number;
          id: string;
          is_deleted: boolean;
          is_featured: boolean;
          is_recommended: boolean;
          likes_count: number;
          playback_url: string;
          published_at: string | null;
          saves_count: number;
          thumbnail_url: string;
          title: string | null;
          updated_at: string;
          views_count: number;
          visibility: string;
        };
        Insert: {
          author_avatar_url: string;
          author_display_name: string;
          author_profile_id: string;
          bunny_video_id: string;
          created_at?: string;
          deleted_at?: string | null;
          description?: string | null;
          duration_seconds: number;
          id?: string;
          is_deleted?: boolean;
          is_featured?: boolean;
          is_recommended?: boolean;
          likes_count?: number;
          playback_url: string;
          published_at?: string | null;
          saves_count?: number;
          thumbnail_url: string;
          title?: string | null;
          updated_at?: string;
          views_count?: number;
          visibility?: string;
        };
        Update: {
          author_avatar_url?: string;
          author_display_name?: string;
          author_profile_id?: string;
          bunny_video_id?: string;
          created_at?: string;
          deleted_at?: string | null;
          description?: string | null;
          duration_seconds?: number;
          id?: string;
          is_deleted?: boolean;
          is_featured?: boolean;
          is_recommended?: boolean;
          likes_count?: number;
          playback_url?: string;
          published_at?: string | null;
          saves_count?: number;
          thumbnail_url?: string;
          title?: string | null;
          updated_at?: string;
          views_count?: number;
          visibility?: string;
        };
        Relationships: [
          {
            foreignKeyName: "videos_author_profile_id_fkey";
            columns: ["author_profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      recount_campfire_members: {
        Args: { p_campfire_id: string };
        Returns: undefined;
      };
      text2ltree: { Args: { "": string }; Returns: unknown };
    };
    Enums: {
      author_display_mode: "attributed" | "anonymous";
      campfire_member_status: "pending" | "approved" | "rejected";
      campfire_role: "camper" | "firekeeper" | "firestarter";
      campfire_visibility: "public" | "private";
      health_tip_sensitivity: "general" | "mild" | "sensitive";
      health_tip_source_type: "url" | "paper" | "book" | "organization";
      health_tip_status:
        | "draft"
        | "in_review"
        | "published"
        | "rejected"
        | "archived";
      interaction_style_enum: "support" | "discussion" | "guided" | "creative";
      loading_experience_types: "none" | "breathing" | "affirmation";
      post_kind: "text" | "text_with_media" | "carousel" | "voice";
      post_media_type: "image";
      post_mood:
        | "neutral"
        | "happy"
        | "sad"
        | "angry"
        | "grateful"
        | "melancholy"
        | "peaceful"
        | "excited"
        | "confused"
        | "thoughtful"
        | "nostalgic"
        | "reflecting"
        | "processing"
        | "chill"
        | "energetic"
        | "motivated"
        | "venting"
        | "ranting"
        | "sharing"
        | "seeking_advice"
        | "creative"
        | "inspired"
        | "laughing";
      sensitive_content_mode: "show" | "blur" | "hide";
      theme_options: "system" | "light" | "dark";
      vote_type: "upvote" | "downvote";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      author_display_mode: ["attributed", "anonymous"],
      campfire_member_status: ["pending", "approved", "rejected"],
      campfire_role: ["camper", "firekeeper", "firestarter"],
      campfire_visibility: ["public", "private"],
      health_tip_sensitivity: ["general", "mild", "sensitive"],
      health_tip_source_type: ["url", "paper", "book", "organization"],
      health_tip_status: [
        "draft",
        "in_review",
        "published",
        "rejected",
        "archived",
      ],
      interaction_style_enum: ["support", "discussion", "guided", "creative"],
      loading_experience_types: ["none", "breathing", "affirmation"],
      post_kind: ["text", "text_with_media", "carousel", "voice"],
      post_media_type: ["image"],
      post_mood: [
        "neutral",
        "happy",
        "sad",
        "angry",
        "grateful",
        "melancholy",
        "peaceful",
        "excited",
        "confused",
        "thoughtful",
        "nostalgic",
        "reflecting",
        "processing",
        "chill",
        "energetic",
        "motivated",
        "venting",
        "ranting",
        "sharing",
        "seeking_advice",
        "creative",
        "inspired",
        "laughing",
      ],
      sensitive_content_mode: ["show", "blur", "hide"],
      theme_options: ["system", "light", "dark"],
      vote_type: ["upvote", "downvote"],
    },
  },
} as const;
