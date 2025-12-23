import { PageContainer } from "@/components/app/page-container";
import { PageHeading } from "@/components/shared/layout/page-heading";
import { ThemeSwitcher } from "@/components/shared/theme-switcher";
import { RightSideSection } from "@/features/campfires/manage/right-side-section";

export const ManageCampfires = () => {
  return (
    <PageContainer
      title="Manage your Campfires"
      externalContent={<RightSideSection />}
      actions={<ThemeSwitcher key={"theme-switcher"} />}
    >
      <PageHeading
        title="Manage your Campfires"
        description="Manage your campfires"
        actions={<p className="text-sm text-muted-foreground">10 joined</p>}
      />
      <div>
        <p>Manage your campfires</p>
      </div>
    </PageContainer>
  );
};
