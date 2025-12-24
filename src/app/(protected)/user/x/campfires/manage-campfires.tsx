import { PageContainer } from "@/components/app/page-container";
import { ManageCampfireCardDemo } from "@/components/cards/campfires/manage-card-demo";
import { PageHeading } from "@/components/shared/layout/page-heading";
import { ThemeSwitcher } from "@/components/shared/theme-switcher";
import { ManageCampfireList } from "@/features/campfires/manage/manage-list";
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
        <ManageCampfireList />
      </div>
    </PageContainer>
  );
};
