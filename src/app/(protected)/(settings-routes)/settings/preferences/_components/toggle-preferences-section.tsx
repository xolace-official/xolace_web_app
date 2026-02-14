"use client";

import { SettingsPanel, SettingsPanelSection } from "@/components/settings";
import { Checkbox } from "@/components/ui/checkbox";
import { usePreferenceMutations } from "@/features/user/hooks/use-preference-mutations";
import { useAppStore } from "@/providers/app-store-provider";
import type {
  PreferenceBooleanKey,
  PreferenceToggleOption,
} from "./preference-types";

interface TogglePreferencesSectionProps {
  options: PreferenceToggleOption[];
}

export function TogglePreferencesSection({
  options,
}: TogglePreferencesSectionProps) {
  const preferences = useAppStore((s) => s.preferences);
  const { mutate, isPending } = usePreferenceMutations();

  const handleToggle = (key: PreferenceBooleanKey, value: boolean) => {
    mutate({ [key]: value });
  };

  return (
    <SettingsPanel>
      {options.map((option) => (
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
