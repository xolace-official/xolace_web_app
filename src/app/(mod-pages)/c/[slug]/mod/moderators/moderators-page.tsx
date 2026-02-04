import { PageContainer } from "@/components/app/page-container";
import { ThemeSwitcher } from "@/components/shared/theme-switcher";

import React from "react";
import ModsAndMembersTab from "@/features/mods/features/moderators/mods-and-members-tab";

export const ModeratorsPage = ({ moderators }: { moderators: string }) => {
  return (
    <PageContainer
      title="Mods & Memebers"
      actions={<ThemeSwitcher key={"theme-switcher"} />}
      className={"w-full"}
      containerClassName={"w-full flex-1"}
      contentClassName={"w-full max-w-none flex flex-col"}
    >
      <div className="flex flex-col gap-6">
        {/*<ModsAndMembersTab slug={moderators}/>*/}
        Mods page
      </div>
    </PageContainer>
  );
};
