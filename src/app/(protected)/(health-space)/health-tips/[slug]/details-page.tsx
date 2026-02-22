"use client";

import { Suspense } from "react";
import { PageContainer } from "@/components/app/page-container";
import { ThemeSwitcher } from "@/components/shared/theme-switcher";
import { HealthTipDetailContent } from "@/features/health-space/health-tips/health-tip-detail-content";

export const HealthTipsDetailsPage = ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  return (
    <PageContainer
      title="Health Tip"
      actions={<ThemeSwitcher key={"theme-switcher"} />}
    >
      <Suspense fallback={null}>
        <HealthTipDetailContent params={params} />
      </Suspense>
    </PageContainer>
  );
};
