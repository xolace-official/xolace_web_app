import { PageContainer } from "@/components/app/page-container";
import { ThemeSwitcher } from "@/components/shared/theme-switcher";
import { PageHeading } from "@/components/shared/layout/page-heading";
import { GlimpseListings } from "@/features/health-space/glimpse/glimpse-listings";

export const GlimpsePage = () => {
  return (
    <PageContainer
      title="Glimpse: Real stories. Real voices."
      actions={<ThemeSwitcher key={"theme-switcher"} />}
      className={"w-full flex justify-start"}
      containerClassName={"flex flex-row items-start justify-start"}
      contentClassName={"w-full flex flex-row"}
    >
      <PageHeading className="px-2 md:px-0" />
      <div className="flex px-2 md:px-0">
        <GlimpseListings />
      </div>
    </PageContainer>
  );
};
