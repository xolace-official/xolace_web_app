import { PageContainer } from "@/components/app/page-container";
import { PageHeading } from "@/components/shared/layout/page-heading";
import { ThemeSwitcher } from "@/components/shared/theme-switcher";
import { CollectionsGrid } from "@/features/collections/components/collections-grid";

export const CollectionsPage = () => {
  return (
    <PageContainer
      title="Collections"
      contentClassName="px-2 md:px-0"
      actions={<ThemeSwitcher key={"theme-switcher"} />}
    >
      <PageHeading
        title="Your Collections"
        description="This is your vast collection of saved items"
      />
      <CollectionsGrid />
    </PageContainer>
  );
};
