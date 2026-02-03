/**
 * Preference option configuration for toggle-based preferences
 */
export interface PreferenceToggleOption {
  key: PreferenceToggleKey;
  label: string;
  description: string;
}

/**
 * Keys for boolean toggle preferences
 */
export type PreferenceToggleKey =
  | "guided_tour_enabled"
  | "auto_save_drafts"
  | "daily_prompt_enabled"
  | "allow_anonymous_replies"
  | "mark_sensitive_by_default"
  | "notifications_enabled"
  | "push_enabled";

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
