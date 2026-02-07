"use client";

import React, { useState, useTransition } from "react";
import Moderators from "@/features/mods/features/moderators/moderators";
import ApprovedCampers from "@/features/mods/features/moderators/approved-campers";
import InvitesMod from "@/features/mods/features/moderators/invites-mod";
import ModeratorRecruiting from "@/features/mods/features/moderators/recruiting";
import ModMemberTabSkeleton from "@/features/mods/features/moderators/ModMemberTabSkeleton";
import { useCampfireWithSlug } from "@/features/mods/features/mockhooks";
import { useModsFiltersServer } from "@/features/mods/features/moderators/mods-filter";

function ModMembersTabError(props: { refetch: any; error: any; slug: string }) {
  return null;
}

const ModsAndMemberTab = ({ slug }: { slug: string }) => {
  const [_, startTransition] = useTransition();
  const [{ tab }, setSearchParams] = useModsFiltersServer({ startTransition });
  const [activeTab, setActiveTab] = useState(tab);

  const {
    data: campfireData,
    isPending,
    isError,
    error,
    refetch,
  } = useCampfireWithSlug(slug);

  if (isPending) {
    return <ModMemberTabSkeleton />;
  }

  if (isError) {
    return <ModMembersTabError error={error} slug={slug} refetch={refetch} />;
  }

  if (!campfireData?.id) {
    return <div>No available campfire</div>;
  }

  const campfireId = campfireData.id;

  const tabOptions: {
    key: string;
    label: string;
    children: React.ReactNode;
  }[] = [
    {
      key: "moderators",
      label: "Moderators",
      children: <Moderators campfireId={campfireId} />,
    },
    {
      key: "approvedCampers",
      label: "Approved Campers",
      children: <ApprovedCampers campfireId={campfireId} />,
    },
    {
      key: "invites",
      label: "Invites",
      children: <InvitesMod />,
    },
    {
      key: "recruiting",
      label: "Recruiting",
      children: <ModeratorRecruiting />,
    },
  ];

  return (
    <div className="flex flex-col items-start w-full justify-start gap-4">
      <div className="flex flex-col w-full gap-4">
        <div className="flex gap-4">
          {tabOptions.map((tab) => (
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
          {tabOptions.find((tab) => tab.key === activeTab)?.children}
        </div>
      </div>
    </div>
  );
};

export default ModsAndMemberTab;
