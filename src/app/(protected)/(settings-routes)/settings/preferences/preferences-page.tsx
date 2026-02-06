"use client";

import { PageContainer } from "@/components/app/page-container";
import { PageSection } from "@/components/app/page-section";
import { PageHeading } from "@/components/shared/layout/page-heading";
import {
  ContentSection,
  DisplaySection,
  ExperienceSection,
  NotificationsSection,
} from "./_components";

export function PreferencesPage() {
  return (
    <PageContainer title="Preferences" contentClassName="px-2 md:px-0">
      <PageHeading
        title="Preferences"
        description="Customize your experience on the platform."
      />

      <PageSection title="Display">
        <DisplaySection />
      </PageSection>

      <PageSection title="Experience">
        <ExperienceSection />
      </PageSection>

      <PageSection title="Content">
        <ContentSection />
      </PageSection>

      <PageSection title="Notifications">
        <NotificationsSection />
      </PageSection>
    </PageContainer>
  );
}
