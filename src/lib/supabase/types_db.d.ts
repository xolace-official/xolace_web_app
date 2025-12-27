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
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      recount_campfire_members: {
        Args: { p_campfire_id: string };
        Returns: undefined;
      };
    };
    Enums: {
      campfire_member_status: "pending" | "approved" | "rejected";
      campfire_role: "camper" | "firekeeper" | "firestarter";
      campfire_visibility: "public" | "private";
      interaction_style_enum: "support" | "discussion" | "guided" | "creative";
      loading_experience_types: "none" | "breathing" | "affirmation";
      sensitive_content_mode: "show" | "blur" | "hide";
      theme_options: "system" | "light" | "dark";
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
      campfire_member_status: ["pending", "approved", "rejected"],
      campfire_role: ["camper", "firekeeper", "firestarter"],
      campfire_visibility: ["public", "private"],
      interaction_style_enum: ["support", "discussion", "guided", "creative"],
      loading_experience_types: ["none", "breathing", "affirmation"],
      sensitive_content_mode: ["show", "blur", "hide"],
      theme_options: ["system", "light", "dark"],
    },
  },
} as const;
