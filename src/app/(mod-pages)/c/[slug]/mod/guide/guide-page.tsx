import { PageContainer } from "@/components/app/page-container";
import { CompleteProfileCard } from "@/components/cards/complete-profile-card";
import { ThemeSwitcher } from "@/components/shared/theme-switcher";
import { FeedList } from "@/features/feed/feed-list";
import { RightSideContent } from "@/features/feed/right-side-content";
import CampfireGuide from "@/features/mods/features/guide/campfire-guide";
import React from "react";
import { PageHeading } from "@/components/shared/layout/page-heading";

export const GuidePage = ({ guide }: { guide: string }) => {
  return (
    <PageContainer
      title="Campfire Guide"
      actions={<ThemeSwitcher key={"theme-switcher"} />}
      className={"w-full"}
      containerClassName={"w-full flex-1"}
      contentClassName={"w-full max-w-none flex flex-col"}
    >
      <div className="flex flex-col gap-6">
        <CampfireGuide slug={guide} />
      </div>
    </PageContainer>
  );
};
