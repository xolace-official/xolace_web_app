"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { SettingsPanel, SettingsPanelSection } from "@/components/settings";
import { SensitiveContentSelect } from "./sensitive-content-select";
import type {
  PreferenceToggleOption,
  SensitiveContentMode,
} from "./preference-types";

const contentToggleOptions: PreferenceToggleOption[] = [
  {
    key: "allow_anonymous_replies",
    label: "Allow Anonymous Replies",
    description: "Let people reply without showing who they are",
  },
  {
    key: "mark_sensitive_by_default",
    label: "Mark Sensitive by Default",
    description: "Automatically mark your posts as sensitive content",
  },
];

export function ContentSection() {
  // TODO: Get preferences from your preferences store
  // const { preferences, updatePreference, isLoading } = usePreferencesStore();

  // Placeholder values - replace with actual state
  const preferences = {
    sensitive_content_mode: "show" as SensitiveContentMode,
    allow_anonymous_replies: false,
    mark_sensitive_by_default: false,
  };
  const isLoading = false;

  const handleToggle = (key: string, value: boolean) => {
    // TODO: Call mutation to update preference
    // updatePreference(key, value);
    console.log(`Update ${key}:`, value);
  };

  const handleSensitiveContentChange = (value: SensitiveContentMode) => {
    // TODO: Call mutation to update sensitive content mode
    // updatePreference('sensitive_content_mode', value);
    console.log("Update sensitive_content_mode:", value);
  };

  return (
    <SettingsPanel>
      <SettingsPanelSection
        title="Sensitive Content"
        description="How to display posts marked as sensitive"
      >
        <SensitiveContentSelect
          value={preferences.sensitive_content_mode}
          onValueChange={handleSensitiveContentChange}
          disabled={isLoading}
        />
      </SettingsPanelSection>

      {contentToggleOptions.map((option) => (
        <SettingsPanelSection
          key={option.key}
          title={option.label}
          description={option.description}
        >
          <Checkbox
            checked={
              preferences[option.key as keyof typeof preferences] as boolean
            }
            onCheckedChange={(checked) => handleToggle(option.key, !!checked)}
            disabled={isLoading}
          />
        </SettingsPanelSection>
      ))}
    </SettingsPanel>
  );
}
