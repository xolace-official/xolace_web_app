import type { Database } from "./types_db";

export type FullDatabase = {
  public: Database["public"];
  private: {
    Tables: {
      profile_private: {
        Row: {
          user_id: string;
          created_at: string;
          updated_at: string;
          email: string | null;
          consent_version: number;
          has_consented: boolean;
          account_state: string;
          restricted_reason: string | null;
          restricted_until: string | null;
          location_country_code: string | null;
          location_region: string | null;
          location_city: string | null;
        };
        Insert: {
          user_id: string;
          email?: string | null;
          consent_version?: number;
          has_consented?: boolean;
          account_state?: string;
          restricted_reason?: string | null;
          restricted_until?: string | null;
          location_country_code?: string | null;
          location_region?: string | null;
          location_city?: string | null;
        };
        Update: Partial<{
          user_id: string;
          email?: string | null;
          consent_version?: number;
          has_consented?: boolean;
          account_state?: string;
          restricted_reason?: string | null;
          restricted_until?: string | null;
          location_country_code?: string | null;
          location_region?: string | null;
          location_city?: string | null;
        }>;
        Relationships: [
          {
            foreignKeyName: "profile_private_user_id_fkey";
            columns: ["user_id"];
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
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
