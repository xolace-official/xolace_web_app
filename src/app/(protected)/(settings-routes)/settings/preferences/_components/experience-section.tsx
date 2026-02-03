"use client";

import { SettingsPanel, SettingsPanelSection } from "@/components/settings";
import { Switch } from "@/components/ui/switch";
import type { PreferenceToggleOption } from "./preference-types";

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
  // TODO: Get preferences from your preferences store
  // const { preferences, updatePreference, isLoading } = usePreferencesStore();

  // Placeholder values - replace with actual state
  const preferences = {
    guided_tour_enabled: true,
    auto_save_drafts: false,
    daily_prompt_enabled: true,
  };
  const isLoading = false;

  const handleToggle = (key: string, value: boolean) => {
    // TODO: Call mutation to update preference
    // updatePreference(key, value);
    console.log(`Update ${key}:`, value);
  };

  return (
    <SettingsPanel>
      {experienceOptions.map((option) => (
        <SettingsPanelSection
          key={option.key}
          title={option.label}
          description={option.description}
        >
          <Switch
            checked={preferences[option.key as keyof typeof preferences]}
            onCheckedChange={(checked) => handleToggle(option.key, checked)}
            disabled={isLoading}
          />
        </SettingsPanelSection>
      ))}
    </SettingsPanel>
  );
}
