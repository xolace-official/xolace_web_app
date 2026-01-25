"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Globe, Users, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CampfireHighlight } from "@/features/campfires/campfire-details/campfire-highlight";
import { CampfireInterface } from "@/features/campfires";
import CampfireAbout from "@/features/campfires/campfire-details/campfire-about";
import { Badge } from "@/components/ui/badge";
import { formatNumber } from "@/utils";
import { getInteractionConfig } from "@/features/campfires";

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
      <div className="mt-1 flex w-full max-w-4xl flex-col items-center justify-center mx-auto">
        <div
          className="relative flex h-[128px] w-full"
          style={{ backgroundImage: `url('${campfire?.banner_path}')` }}
        >
          {/* Overlay for better text readability */}
          {/*<div className="absolute inset-0 rounded-none bg-black/20 lg:rounded-lg"/>*/}

          {/* Profile logo overlap */}
          <div className="absolute bottom-[-40px] left-4 z-20 h-20 w-20 lg:left-8">
            <div className="relative h-full w-full">
              <Avatar className="hidden h-20 w-20 rounded-full border-3 border-white lg:flex dark:border-black/80">
                <AvatarImage
                  className="rounded-full object-contain"
                  src={campfire.icon_path || undefined}
                  alt={campfire.name}
                />
                <AvatarFallback className="flex items-center justify-center rounded-full border font-semibold">
                  <span
                    className={`flex h-20 w-20 items-center justify-center rounded-full text-3xl font-semibold`}
                  >
                    x/
                  </span>
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Purpose badge */}
          <div className="absolute top-2 right-2 md:top-4 md:right-4">
            <Badge
              className={`${configColor.iconColor} flex gap-1 rounded-full capitalize`}
            >
              <span>
                <Info size={14} />
              </span>
              {campfire.interaction_style.replace("_", " ")}
            </Badge>
          </div>
        </div>

        {/* Name and CTA buttons */}
        <div className="mt-4 ml-0 flex w-full flex-col items-start justify-between gap-4 px-4 lg:mt-2 lg:flex-row lg:items-center lg:gap-0 lg:pl-15">
          {/* Name and logo */}
          <div className="flex w-[70%] flex-row items-center justify-start gap-4 lg:justify-start lg:gap-0 lg:pl-15 lg:text-left">
            <div className="lg:hidden">
              <Avatar>
                <AvatarImage
                  className="rounded-full border object-contain"
                  src={campfire.icon_path || undefined}
                  alt={campfire.name}
                />
                <AvatarFallback className="border-lavender-500 flex h-8 w-8 items-center justify-center rounded-full border font-semibold text-white">
                  <span
                    className={`bg-lavender-500 flex h-7 w-7 items-center justify-center rounded-full font-semibold text-white`}
                  >
                    x/
                  </span>
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col items-start gap-1 lg:items-center">
              <div className="flex items-center gap-2 lg:gap-2">
                <h1 className="text-xl font-semibold lg:text-2xl">
                  {`x/${campfire.name}`}
                </h1>
                <Globe size={16} className="text-green-500" />
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500 lg:hidden">
                <span className="flex items-center gap-1">
                  <Users size={14} />
                  {formatNumber(campfire.member_count)} Members
                </span>
                <span className="flex items-center gap-1">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                  Online
                </span>
              </div>
            </div>
          </div>

          {/* Right CTA buttons */}
          <div className="flex w-full max-w-full items-start justify-start space-x-4 lg:mt-0 lg:items-end lg:justify-end">
            <Button
              className={"flex flex-row items-center gap-1 rounded-full"}
              size="sm"
              variant="outline"
              onClick={handleCreatePost}
            >
              <Plus size={16} /> <span> Create Post</span>
            </Button>

            <Button
              size="sm"
              variant={campfire.member_count ? "default" : "outline"}
              onClick={handleJoinToggle}
              disabled={isProcessingMembership}
              className="min-w-[70px] rounded-full border border-neutral-400"
            >
              {isProcessingMembership ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-transparent" />
              ) : campfire.isMember ? (
                "Joined"
              ) : (
                "Join"
              )}
            </Button>

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

            {/*<CampfireActionsPopover*/}
            {/*  campfire={{*/}
            {/*    name: campfire.name,*/}
            {/*    description: campfire.description,*/}
            {/*    slug: campfire.slug,*/}
            {/*    isMember: campfire.isMember,*/}
            {/*    isFavorite: campfire.isFavorite,*/}
            {/*  }}*/}
            {/*  onAddToFavorites={handleFavoriteToggle}*/}
            {/*  isProcessingFavorite={*/}
            {/*    addFavoriteMutation.isPending || removeFavoriteMutation.isPending*/}
            {/*  }*/}
            {/*/>*/}
          </div>
        </div>

        {/* Desktop layout */}
        <div className="mt-4 hidden w-full grid-cols-12 gap-4 p-4 lg:grid">
          <div className="col-span-8">
            <CampfireHighlight campfire={campfire} />
          </div>
          <div className="sm:top-[calc(var(--header-height) + 1rem)] col-span-4 scroll-smooth sm:sticky sm:max-h-[calc(100vh-var(--header-height)-2rem)] sm:overflow-x-hidden sm:overflow-y-auto">
            <CampfireAbout
              campfire={campfire}
              setDrawerOpen={setOpenGuideModal}
            />
          </div>
        </div>

        {/* Mobile layout */}
        <div className="mt-4 flex w-full flex-col gap-4 lg:hidden">
          <div className="flex flex-row items-start gap-4 px-4">
            {tabOptions.map((campfire) => {
              const activeTab = selectedTab === campfire.key;
              return (
                <Button
                  key={campfire.key}
                  onClick={() => setSelectedTab(campfire.key)}
                  size={"sm"}
                  variant="ghost"
                  className={`rounded-full ${activeTab ? "border border-neutral-400 bg-neutral-200 dark:bg-neutral-800" : ""}`}
                >
                  {" "}
                  {campfire.label}
                </Button>
              );
            })}
          </div>
          {/* Content based on selection */}
          <div className="">
            {tabOptions.map(
              (campfire) =>
                campfire.key === selectedTab && (
                  <div key={campfire.key}>{campfire.children}</div>
                ),
            )}
          </div>
        </div>
      </div>

      {/*{ openGuideModal && (*/}
      {/*  <CampfireGuideModal*/}
      {/*    welcomeMsg={campfire.guideWelcomeMessage || 'You are welcome !'}*/}
      {/*    campfireName={campfire.name}*/}
      {/*    resource={uiResources}*/}
      {/*    icon={campfire.iconURL || null}*/}
      {/*    drawerOpen={openGuideModal}*/}
      {/*    setDrawerOpen={setOpenGuideModal}*/}
      {/*  />*/}
      {/*)}*/}
    </>
  );
};
export default CampfireDetails;
