import { PageContainer } from "@/components/app/page-container";
import { PageHeading } from "@/components/shared/layout/page-heading";
import { SearchBar } from "@/components/shared/search-bar";
import { ThemeSwitcher } from "@/components/shared/theme-switcher";
import { Separator } from "@/components/ui/separator";
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
        actions={
          <p className="text-sm hidden md:block text-muted-foreground">
            10 joined
          </p>
        }
      />
      <div className="flex flex-col gap-4 px-2 md:px-0">
        <SearchBar />
        <Separator />
        <ManageCampfireList />
      </div>
    </PageContainer>
  );
};
