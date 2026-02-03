"use client";

import { PageContainer } from "@/components/app/page-container";
import { PageSection } from "@/components/app/page-section";
import { PageHeading } from "@/components/shared/layout/page-heading";
import { ContactSection, FaqSection, QuickLinksSection } from "./_components";

export function HelpCenterPage() {
  return (
    <PageContainer title="Help Center" contentClassName="px-2 md:px-0">
      <PageHeading
        title="Help Center"
        description="Find answers to common questions and get support."
      />

      {/* FAQ Section */}
      <PageSection title="Frequently Asked Questions">
        <FaqSection />
      </PageSection>

      {/* Contact Section */}
      <ContactSection />

      {/* Quick Links */}
      <QuickLinksSection />
    </PageContainer>
  );
}
