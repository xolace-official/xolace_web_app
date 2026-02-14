"use client";

import { SettingsPanel, SettingsPanelSection } from "@/components/settings";
import { Checkbox } from "@/components/ui/checkbox";
import { usePreferenceMutations } from "@/features/user/hooks/use-preference-mutations";
import { useAppStore } from "@/providers/app-store-provider";
import type {
  PreferenceBooleanKey,
  PreferenceToggleOption,
} from "./preference-types";

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
  const preferences = useAppStore((s) => s.preferences);
  const { mutate, isPending } = usePreferenceMutations();

  const handleToggle = (key: PreferenceBooleanKey, value: boolean) => {
    mutate({ [key]: value });
  };

  return (
    <SettingsPanel>
      {experienceOptions.map((option) => (
        <SettingsPanelSection
          key={option.key}
          title={option.label}
          description={option.description}
        >
          <Checkbox
            checked={!!preferences[option.key]}
            onCheckedChange={(checked) => handleToggle(option.key, !!checked)}
            disabled={isPending}
          />
        </SettingsPanelSection>
      ))}
    </SettingsPanel>
  );
}
