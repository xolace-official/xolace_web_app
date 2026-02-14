"use client";

import { useState, useTransition } from "react";
import { useCampfireWithSlug } from "@/features/mods/features/mockhooks";
import ApprovedCampers from "@/features/mods/features/moderators/approved-campers";
import InvitesMod from "@/features/mods/features/moderators/invites-mod";
import ModMemberTabSkeleton from "@/features/mods/features/moderators/ModMemberTabSkeleton";
import Moderators from "@/features/mods/features/moderators/moderators";
import { useModsFiltersServer } from "@/features/mods/features/moderators/mods-filter";
import ModeratorRecruiting from "@/features/mods/features/moderators/recruiting";

/**
 * Placeholder error component for the moderators/members tab shown when fetching data fails.
 *
 * @param refetch - Function to retry the failed fetch.
 * @param error - The error object returned from the fetch.
 * @param slug - The campfire slug associated with the fetch request.
 * @returns `null` — this component does not render any UI.
 */
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

  const tabs = [
    { key: "moderators", label: "Moderators" },
    { key: "approvedCampers", label: "Approved Campers" },
    { key: "invites", label: "Invites" },
    { key: "recruiting", label: "Recruiting" },
  ];

  return (
    <div className="flex flex-col items-start w-full justify-start gap-4">
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
          {activeTab === "moderators" && <Moderators campfireId={campfireId} />}
          {activeTab === "approvedCampers" && (
            <ApprovedCampers campfireId={campfireId} />
          )}
          {activeTab === "invites" && <InvitesMod />}
          {activeTab === "recruiting" && <ModeratorRecruiting />}
        </div>
      </div>
    </div>
  );
};

export default ModsAndMemberTab;
