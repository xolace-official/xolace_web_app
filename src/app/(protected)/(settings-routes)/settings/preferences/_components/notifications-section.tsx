"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { SettingsPanel, SettingsPanelSection } from "@/components/settings";
import type { PreferenceToggleOption } from "./preference-types";

const notificationOptions: PreferenceToggleOption[] = [
  {
    key: "notifications_enabled",
    label: "Notifications",
    description: "Receive in-app notifications for activity",
  },
  {
    key: "push_enabled",
    label: "Push Notifications",
    description: "Receive push notifications on your device",
  },
];

export function NotificationsSection() {
  // TODO: Get preferences from your preferences store
  // const { preferences, updatePreference, isLoading } = usePreferencesStore();

  // Placeholder values - replace with actual state
  const preferences = {
    notifications_enabled: true,
    push_enabled: true,
  };
  const isLoading = false;

  const handleToggle = (key: string, value: boolean) => {
    // TODO: Call mutation to update preference
    // updatePreference(key, value);
    console.log(`Update ${key}:`, value);
  };

  return (
    <SettingsPanel>
      {notificationOptions.map((option) => (
        <SettingsPanelSection
          key={option.key}
          title={option.label}
          description={option.description}
        >
          <Checkbox
            checked={preferences[option.key as keyof typeof preferences]}
            onCheckedChange={(checked) => handleToggle(option.key, !!checked)}
            disabled={isLoading}
          />
        </SettingsPanelSection>
      ))}
    </SettingsPanel>
  );
}
