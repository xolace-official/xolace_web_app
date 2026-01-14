import { PageContainer } from "@/components/app/page-container";
import { ThemeSwitcher } from "@/components/shared/theme-switcher";
import { GlimpseListings } from "@/features/health-space/glimpse/glimpse-listings";
import { GlimpseFiltering } from "@/features/health-space/glimpse/glimpse-filtering";

export const GlimpsePage = () => {
  return (
    <PageContainer
      title={<GlimpseFiltering />}
      actions={<ThemeSwitcher key={"theme-switcher"} />}
      className={"w-full "}
      containerClassName={"w-full flex-1"}
      contentClassName={"w-full max-w-none flex flex-col"}
    >
      <div className={"px-0"}>
        <GlimpseListings />
      </div>
    </PageContainer>
  );
};
