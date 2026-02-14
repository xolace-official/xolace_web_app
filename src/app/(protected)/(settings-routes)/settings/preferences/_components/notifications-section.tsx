"use client";

import { SettingsPanel, SettingsPanelSection } from "@/components/settings";
import { Checkbox } from "@/components/ui/checkbox";
import { usePreferenceMutations } from "@/features/user/hooks/use-preference-mutations";
import { useAppStore } from "@/providers/app-store-provider";
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
  const preferences = useAppStore((s) => s.preferences);
  const { mutate, isPending } = usePreferenceMutations();

  const handleToggle = (key: string, value: boolean) => {
    mutate({ [key]: value });
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
            checked={
              preferences[option.key as keyof typeof preferences] as boolean
            }
            onCheckedChange={(checked) => handleToggle(option.key, !!checked)}
            disabled={isPending}
          />
        </SettingsPanelSection>
      ))}
    </SettingsPanel>
  );
}
