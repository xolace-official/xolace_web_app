import React from "react";
import { ThemeSwitcher } from "@/components/shared/theme-switcher";
import { PageContainer } from "@/components/app/page-container";
import { CampfireDetails } from "@/features/campfires/campfire-details/campfire-details";

const DetailsPage = ({ campfire }: { campfire: string }) => {
  return (
    <PageContainer
      title={"Find your circle"}
      actions={<ThemeSwitcher key={"theme-switcher"} />}
      className={"w-full"}
      containerClassName={"w-full flex-1"}
      contentClassName={"w-full max-w-none flex flex-col"}
    >
      <div className={"px-0"}>
        <CampfireDetails campfireId={campfire} />
      </div>
    </PageContainer>
  );
};
export default DetailsPage;
