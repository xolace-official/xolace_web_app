"use client";

import { useState, useTransition } from "react";
import { useCampfireWithSlug } from "@/features/mods/features/mockhooks";
import ModSettingsTabError from "@/features/mods/features/settings/mods-settings-tab-error";
import PrivacyAndDiscovery from "@/features/mods/features/settings/privacy-and-discovery";
import { useSettingsFiltersServer } from "@/features/mods/features/settings/settings-filter";
import SettingsTabSkeleton from "@/features/mods/features/settings/settings-tab-skeleton";
import GeneralSettings from "./general";

const SettingsTab = ({ slug }: { slug: string }) => {
  const user = {
    id: "",
    name: "",
  };

  const [_, startTransition] = useTransition();
  const [{ tab }, setSearchParams] = useSettingsFiltersServer({
    startTransition,
  });
  const [activeTab, setActiveTab] = useState(tab);

  // fetch campfire details
  const {
    data: campfire,
    isPending,
    isError,
    error,
    refetch,
  } = useCampfireWithSlug(slug, user?.id);

  const tabs = [
    { key: "general", label: "General" },
    { key: "privacyAndDiscovery", label: "Privacy & Discovery" },
  ];

  if (isPending) {
    return <SettingsTabSkeleton />;
  }

  if (isError) {
    return <ModSettingsTabError error={error} slug={slug} refetch={refetch} />;
  }

  return (
    <div className="flex flex-col items-start w-full justify-start gap-4 max-w-2xl">
      <div className="flex flex-col w-full gap-4">
        <div className="flex gap-4">
          {tabs.map((tab) => (
            <button
              type="button"
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                startTransition(async () => {
                  await setSearchParams({
                    tab: tab.key,
                    query: "",
                  });
                });
              }}
              className={`pb-1 text-sm md:text-base font-medium border-b-3 px-2 transition-colors ${
                activeTab === tab.key
                  ? "border-b border-destructive text-destructive"
                  : "border-transparent"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="w-full mt-4">
          {activeTab === "general" && <GeneralSettings campfire={campfire} />}
          {activeTab === "privacyAndDiscovery" && (
            <PrivacyAndDiscovery campfire={campfire} />
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
