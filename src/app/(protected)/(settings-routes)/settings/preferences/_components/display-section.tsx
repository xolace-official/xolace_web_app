"use client";

import { SettingsPanel, SettingsPanelSection } from "@/components/settings";
import { LanguageSelect } from "./language-select";
import type { ThemeOption } from "./preference-types";
import { ThemeSelect } from "./theme-select";

export function DisplaySection() {
  // TODO: Get preferences from your preferences store
  // const { preferences, updatePreference, isLoading } = usePreferencesStore();

  // Placeholder values - replace with actual state
  const preferences = {
    theme: "system" as ThemeOption,
    preferred_language: "en",
  };
  const isLoading = false;

  const handleThemeChange = (value: ThemeOption) => {
    // TODO: Call mutation to update theme
    // updatePreference('theme', value);
    console.log("Update theme:", value);
  };

  const handleLanguageChange = (value: string) => {
    // TODO: Call mutation to update language
    // updatePreference('preferred_language', value);
    console.log("Update preferred_language:", value);
  };

  return (
    <SettingsPanel>
      <SettingsPanelSection
        title="Theme"
        description="Choose your preferred color scheme"
      >
        <ThemeSelect
          value={preferences.theme}
          onValueChange={handleThemeChange}
          disabled={isLoading}
        />
      </SettingsPanelSection>

      <SettingsPanelSection
        title="Language"
        description="Choose your preferred language"
      >
        <LanguageSelect
          value={preferences.preferred_language}
          onValueChange={handleLanguageChange}
          disabled={isLoading}
        />
      </SettingsPanelSection>
    </SettingsPanel>
  );
}
