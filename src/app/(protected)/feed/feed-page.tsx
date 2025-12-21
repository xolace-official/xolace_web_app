"use client";

import { PageContainer } from "@/components/app/page-container";
import { ThemeSwitcher } from "@/components/shared/theme-switcher";
import { FeedList } from "@/features/feed/feed-list";
import { RightSideContent } from "@/features/feed/right-side-content";

export const FeedPage = () => {
  return (
    <PageContainer
      title="Fireside 🔥"
      contentClassName="max-sm:px-2"
      externalContent={<RightSideContent />}
      actions={<ThemeSwitcher />}
    >
      <FeedList />
    </PageContainer>
  );
};
