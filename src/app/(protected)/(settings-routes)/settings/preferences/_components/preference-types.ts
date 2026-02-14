import type { GetApiV1AuthPreferences200 } from "@/api-client";

/**
 * Extract keys from preferences whose values are boolean (including optional boolean).
 * This ensures compile-time safety: if a key is renamed or removed from the API type,
 * any toggle option referencing it will cause a type error.
 */
export type PreferenceBooleanKey = {
  [K in keyof GetApiV1AuthPreferences200]-?: NonNullable<
    GetApiV1AuthPreferences200[K]
  > extends boolean
    ? K
    : never;
}[keyof GetApiV1AuthPreferences200];

/**
 * Preference option configuration for toggle-based preferences
 */
export interface PreferenceToggleOption {
  key: PreferenceBooleanKey;
  label: string;
  description: string;
}

/**
 * Theme options enum matching database
 */
export type ThemeOption = "light" | "dark" | "system";

/**
 * Sensitive content mode enum matching database
 */
export type SensitiveContentMode = "show" | "blur" | "hide";

/**
 * Loading experience types enum matching database
 */
export type LoadingExperienceType = "none" | "skeleton" | "spinner";
