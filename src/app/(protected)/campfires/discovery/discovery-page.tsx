import { PageContainer } from "@/components/app/page-container";
import { PageHeading } from "@/components/shared/layout/page-heading";
import { ThemeSwitcher } from "@/components/shared/theme-switcher";
import { CampfireDiscoveryList } from "@/features/campfires/discovery/discovery-list";
import { RealmOverview } from "@/features/campfires/discovery/realm-overview";

export const DiscoveryPage = () => {
  return (
    <PageContainer
      title="Campfire Discovery"
      externalContent={<RealmOverview />}
      actions={<ThemeSwitcher key={"theme-switcher"} />}
    >
      <PageHeading
        title="Find your circle. Join discussions that matter to you."
        className="px-2 md:px-0"
      />
      <div className="flex flex-col gap-4 px-2 md:px-0">
        <CampfireDiscoveryList />
      </div>
    </PageContainer>
  );
};
