"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Globe, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CampfireHighlight } from "@/features/campfires/campfire-details/campfire-highlight";
import { CampfireInterface } from "@/features/campfires";
import CampfireAbout from "@/features/campfires/campfire-details/campfire-about";
import { Badge } from "@/components/ui/badge";
import { getInteractionConfig } from "@/features/campfires";
import CampfireActionsPopover from "@/features/campfires/campfire-details/campfire-actions-popover";
import CampfireGuideModal from "@/features/campfires/campfire-details/campfire-guided-modal";

export const CampfireDetails = ({
  campfire,
}: {
  campfire: CampfireInterface;
}) => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("feed");
  const [isProcessingMembership, setIsProcessingMembership] = useState(false);
  const [openGuideModal, setOpenGuideModal] = useState(false);

  const configColor = getInteractionConfig(campfire.interaction_style);

  const handleCreatePost = () => {
    router.push(`/create-post?submit=${campfire.name}`);
  };

  //Dummy ui resource
  const uiResources: { label: string; value: string }[] = [
    { label: "New Post", value: "new-post" },
    { label: "New Post", value: "new-post" },
  ];

  //Helper for join action
  const handleJoinToggle = async () => {};

  const tabOptions: {
    key: string;
    label: string;
    children: React.ReactNode;
  }[] = [
    {
      key: "feed",
      label: "Feed",
      children: <CampfireHighlight campfire={campfire} />,
    },
    {
      key: "about",
      label: "About",
      children: (
        <CampfireAbout campfire={campfire} setDrawerOpen={setOpenGuideModal} />
      ),
    },
  ];

  return (
    <>
      <div className="flex w-full max-w-5xl flex-col items-center justify-center mx-auto">
        <div
          className="relative flex h-32 w-full rounded-none border lg:rounded-lg"
          style={{
            backgroundImage: `url(${campfire.banner_path})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute -bottom-12 md:-bottom-8 left-2 z-20 h-20 w-20">
            <div className="relative h-full w-full">
              <Avatar className="flex h-16 md:h-20 w-16 md:w-20 rounded-full border-2 border-border">
                <AvatarImage
                  className="rounded-full object-contain"
                  src={campfire.icon_path || undefined}
                  alt={campfire.name}
                />
                <AvatarFallback className="border flex items-center justify-center rounded-full border font-semibold">
                  <span
                    className={`bg-muted flex h-20 w-20 items-center justify-center rounded-full text-3xl font-semibold`}
                  >
                    x/
                  </span>
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          <div className="absolute top-3 right-3">
            <Badge
              className={`${configColor.iconColor} flex gap-1 rounded-full capitalize text-foreground`}
            >
              <Info size={14} />
              {campfire.interaction_style.replace("_", " ")}
            </Badge>
          </div>
        </div>

        {/* Name and CTA buttons */}
        <div className="flex w-full px-2 lg:px-4">
          <div className="w-full pl-18 pt-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-4">
            <div className="flex items-center gap-1 md:gap-2">
              <h1 className="text-lg md:text-2xl font-bold">
                {`${campfire.name}`}
              </h1>
              <Globe size={18} className="text-green-500" />
            </div>

            <div className="flex items-center justify-end gap-2 ml-auto">
              <Button
                className="flex items-center gap-2 rounded-full"
                size="sm"
                variant="outline"
                onClick={handleCreatePost}
              >
                <Plus size={16} />
                <span className="">Create Post</span>
              </Button>

              <Button
                size="sm"
                variant={campfire.isMember ? "secondary" : "outline"}
                onClick={handleJoinToggle}
                disabled={isProcessingMembership}
                className="rounded-full min-w-[80px]"
              >
                {isProcessingMembership ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                ) : !campfire.isMember ? (
                  "Joined"
                ) : (
                  "Join"
                )}
              </Button>

              {(campfire.memberRole === "firekeeper" ||
                campfire.memberRole === "firestarter") && (
                <Button
                  className={"flex items-center gap-1 rounded-full"}
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    router.replace(`/c/${campfire.slug}/mod/moderators`)
                  }
                >
                  Mod Tools
                </Button>
              )}

              <CampfireActionsPopover campfire={campfire} />
            </div>
          </div>
        </div>

        {/* Desktop layout */}
        <div className="mt-4 hidden lg:grid w-full grid-cols-12 gap-6 px-4 pb-8">
          <div className="col-span-8">
            <CampfireHighlight campfire={campfire} />
          </div>
          <div className="col-span-4">
            <div className="sticky top-0 max-h-[calc(100vh-2rem)] overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <CampfireAbout
                campfire={campfire}
                setDrawerOpen={setOpenGuideModal}
              />
            </div>
          </div>
        </div>

        {/*mobile layout*/}
        <div className="mt-4 flex w-full flex-col gap-4 lg:hidden">
          <div className="flex flex-row items-start gap-4 px-4">
            {tabOptions.map((tab) => {
              const activeTab = selectedTab === tab.key;
              return (
                <Button
                  key={tab.key}
                  onClick={() => setSelectedTab(tab.key)}
                  size={"sm"}
                  variant="outline"
                  className={`rounded-full px-6 ${activeTab && "bg-accent text-black"}`}
                >
                  {tab.label}
                </Button>
              );
            })}
          </div>
          <div className="px-4">
            {tabOptions.map(
              (tab) =>
                tab.key === selectedTab && (
                  <div key={tab.key}>{tab.children}</div>
                ),
            )}
          </div>
        </div>
      </div>

      {openGuideModal && (
        <CampfireGuideModal
          welcomeMsg={"You are welcome !"}
          campfireName={campfire.name}
          resource={uiResources}
          icon={campfire.icon_path || null}
          drawerOpen={openGuideModal}
          setDrawerOpen={setOpenGuideModal}
        />
      )}
    </>
  );
};
