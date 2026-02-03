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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function PreferencesPage() {
  return (
    <PageContainer title="Preferences" contentClassName="px-2 md:px-0">
      <PageHeading
        title="Preferences"
        description="Customize your experience on the platform."
      />
      <div className="flex items-center space-x-2">
        <Switch id="airplane-mode" />
        <Label htmlFor="airplane-mode">Airplane Mode</Label>
      </div>

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
