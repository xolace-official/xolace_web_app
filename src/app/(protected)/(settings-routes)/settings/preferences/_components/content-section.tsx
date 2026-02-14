"use client";

import { SettingsPanel, SettingsPanelSection } from "@/components/settings";
import { Checkbox } from "@/components/ui/checkbox";
import { usePreferenceMutations } from "@/features/user/hooks/use-preference-mutations";
import { useAppStore } from "@/providers/app-store-provider";
import type {
  PreferenceBooleanKey,
  PreferenceToggleOption,
  SensitiveContentMode,
} from "./preference-types";
import { SensitiveContentSelect } from "./sensitive-content-select";

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
  const preferences = useAppStore((s) => s.preferences);
  const { mutate, isPending } = usePreferenceMutations();

  const handleToggle = (key: PreferenceBooleanKey, value: boolean) => {
    mutate({ [key]: value });
  };

  const handleSensitiveContentChange = (value: SensitiveContentMode) => {
    mutate({ sensitive_content_mode: value });
  };

  return (
    <SettingsPanel>
      <SettingsPanelSection
        title="Sensitive Content"
        description="How to display posts marked as sensitive"
      >
        <SensitiveContentSelect
          value={
            (preferences.sensitive_content_mode as SensitiveContentMode) ??
            "show"
          }
          onValueChange={handleSensitiveContentChange}
          disabled={isPending}
        />
      </SettingsPanelSection>

      {contentToggleOptions.map((option) => (
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
