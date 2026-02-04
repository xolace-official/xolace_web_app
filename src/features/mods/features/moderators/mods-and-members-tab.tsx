"use client";

import React, { useState } from "react";
import Moderators from "@/features/mods/features/moderators/moderators";
import ApprovedCampers from "@/features/mods/features/moderators/approved-campers";
import InvitesMod from "@/features/mods/features/moderators/invites-mod";
import ModeratorRecruiting from "@/features/mods/features/moderators/recruiting";
import ModMemberTabSkeleton from "@/features/mods/features/moderators/ModMemberTabSkeleton";
import { getCampfireIdWithSlug } from "@/features/mods/features/mockhooks";

function ModMembersTabError(props: { refetch: any; error: any; slug: string }) {
  return null;
}

const ModsAndMemberTab = ({ slug }: { slug: string }) => {
  const [activeTab, setActiveTab] = useState("moderators");
  const {
    data: campfireData,
    isPending,
    isError,
    error,
    refetch,
  } = getCampfireIdWithSlug(slug);

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
      <h3 className="font-semibold text-2xl">Mods & Members</h3>

      <div className="flex flex-col w-full gap-4">
        <div className="flex gap-4">
          {tabOptions.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-1 text-sm md:text-base font-medium border-b-3 transition-colors ${
                activeTab === tab.key
                  ? "border-ocean-500 text-ocean-500 dark:text-ocean-300 dark:border-ocean-300"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
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
