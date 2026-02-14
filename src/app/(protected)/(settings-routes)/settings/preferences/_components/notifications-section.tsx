import type { PreferenceToggleOption } from "./preference-types";
import { TogglePreferencesSection } from "./toggle-preferences-section";

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
  return <TogglePreferencesSection options={notificationOptions} />;
}
