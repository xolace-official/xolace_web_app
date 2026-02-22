import { ThemeSwitcher } from "@/components/shared/theme-switcher";
import { PageHeading } from "@/components/shared/layout/page-heading";
import { PageContainer } from "@/components/app/page-container";
import { HealthTipsList } from "@/features/health-space/health-tips/health-tips-list";

export const HealthTipsPage = () => {
  return (
    <PageContainer
      title="Health Tips"
      actions={<ThemeSwitcher key={"theme-switcher"} />}
    >
      <PageHeading
        title="Expert-backed articles and guides for your mental health journey"
        className="px-2 md:px-0"
      />
      <div className="flex flex-col gap-4 px-2 md:px-0">
        <HealthTipsList />
      </div>
    </PageContainer>
  );
};
