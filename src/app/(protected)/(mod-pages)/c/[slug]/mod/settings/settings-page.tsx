import { PageContainer } from "@/components/app/page-container";
import { ThemeSwitcher } from "@/components/shared/theme-switcher";
import SettingsTab from "@/features/mods/features/settings/settings-tab";

export const SettingsPage = ({ settings }: { settings: string }) => {
  return (
    <PageContainer
      title="General Settings"
      actions={<ThemeSwitcher key={"theme-switcher"} />}
      className={"w-full"}
      containerClassName={"w-full flex-1"}
      contentClassName={"w-full max-w-none flex flex-col"}
    >
      <div className="flex flex-col gap-6">
        <SettingsTab slug={settings} />
      </div>
    </PageContainer>
  );
};
