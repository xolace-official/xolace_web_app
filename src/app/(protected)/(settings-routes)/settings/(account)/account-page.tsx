"use client";

import { PageContainer } from "@/components/app/page-container";
import { PageSection } from "@/components/app/page-section";
import { SettingsPanel, SettingsPanelSection } from "@/components/settings";
import { PageHeading } from "@/components/shared/layout/page-heading";
import {
  DeleteSection,
  EmailSection,
  LogoutSection,
  PasswordSection,
  ProfileImageSection,
  UsernameSection,
} from "./_components";

export function AccountPage() {
  return (
    <PageContainer title="Account" contentClassName="px-2 md:px-0">
      <PageHeading
        title="Account"
        description="Manage your account settings and preferences."
      />

      <SettingsPanel>
        <SettingsPanelSection
          title="Profile Image"
          description="Your profile image. Click to choose from our mascots."
        >
          <ProfileImageSection />
        </SettingsPanelSection>

        <SettingsPanelSection
          title="Username"
          description="How you'll be referred to in the app."
        >
          <UsernameSection />
        </SettingsPanelSection>

        <SettingsPanelSection
          title="Email"
          description="Your email address for signing in and notifications."
        >
          <EmailSection />
        </SettingsPanelSection>

        <SettingsPanelSection
          title="Password"
          description="Your password for signing in to your account."
        >
          <PasswordSection />
        </SettingsPanelSection>
      </SettingsPanel>

      <PageSection title="Actions">
        <SettingsPanel>
          <SettingsPanelSection
            title="Log out"
            description="Log out of your account. You'll need to sign in again."
          >
            <LogoutSection />
          </SettingsPanelSection>

          <SettingsPanelSection
            title="Delete Account"
            description="Permanently delete your account and all associated data."
          >
            <DeleteSection />
          </SettingsPanelSection>
        </SettingsPanel>
      </PageSection>
    </PageContainer>
  );
}
