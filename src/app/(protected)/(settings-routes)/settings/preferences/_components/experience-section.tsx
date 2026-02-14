import type { PreferenceToggleOption } from "./preference-types";
import { TogglePreferencesSection } from "./toggle-preferences-section";

const experienceOptions: PreferenceToggleOption[] = [
  {
    key: "guided_tour_enabled",
    label: "Guided Tour",
    description: "Enable a guided tour to help you understand the platform",
  },
  {
    key: "auto_save_drafts",
    label: "Auto-save Drafts",
    description: "Automatically save your thoughts while you type",
  },
  {
    key: "daily_prompt_enabled",
    label: "Daily Prompt",
    description: "Receive a daily nudge to help you express yourself",
  },
];

export function ExperienceSection() {
  return <TogglePreferencesSection options={experienceOptions} />;
}
