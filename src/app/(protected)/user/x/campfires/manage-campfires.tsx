import { PageContainer } from "@/components/app/page-container";
import { PageHeading } from "@/components/shared/layout/page-heading";
import { ThemeSwitcher } from "@/components/shared/theme-switcher";
import { Separator } from "@/components/ui/separator";
import { FilterDrawer } from "@/features/campfires/manage/filter-drawer";
import { ManageCampfireList } from "@/features/campfires/manage/manage-list";
import { ManageCampfireSearchBar } from "@/features/campfires/manage/manage-search-bar";
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
      />
      <div className="flex flex-col gap-4 px-2 md:px-0">
        <div className="flex items-center gap-3">
          <ManageCampfireSearchBar />
          <FilterDrawer />
        </div>
        <Separator />
        <ManageCampfireList />
      </div>
    </PageContainer>
  );
};
