"use client";

import { SettingsPanel, SettingsPanelSection } from "@/components/settings";
import { usePreferenceMutations } from "@/features/user/hooks/use-preference-mutations";
import { useAppStore } from "@/providers/app-store-provider";
import { LanguageSelect } from "./language-select";
import type { ThemeOption } from "./preference-types";
import { ThemeSelect } from "./theme-select";

export function DisplaySection() {
  const preferences = useAppStore((s) => s.preferences);
  const { mutate, isPending } = usePreferenceMutations();

  const handleThemeChange = (value: ThemeOption) => {
    mutate({ theme: value });
  };

  const handleLanguageChange = (value: string) => {
    mutate({ preferred_language: value });
  };

  return (
    <SettingsPanel>
      <SettingsPanelSection
        title="Theme"
        description="Choose your preferred color scheme"
      >
        <ThemeSelect
          value={(preferences.theme as ThemeOption) ?? "system"}
          onValueChange={handleThemeChange}
          disabled={isPending}
        />
      </SettingsPanelSection>

      <SettingsPanelSection
        title="Language"
        description="Choose your preferred language"
      >
        <LanguageSelect
          value={preferences.preferred_language ?? "en"}
          onValueChange={handleLanguageChange}
          disabled={isPending}
        />
      </SettingsPanelSection>
    </SettingsPanel>
  );
}
