"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import GuidePreview from "@/features/mods/features/guide/guide-preview";
import SettingsItem, {
  type SettingsItemProps,
} from "@/features/mods/features/settings/settings-items";

const GuidePreviewDrawer = dynamic(
  () => import("@/features/mods/features/guide/guide-preview-drawer"),
  { ssr: false },
);

import CampfireGuideSkeleton from "@/features/mods/features/guide/guide-skeleton";
import { useDummyMutation } from "./useDummyMutation";

//Dummy ui resource
const initialGuideData: {
  name: string;
  icon_url: string;
  guide_enabled: boolean;
  guide_show_on_join?: boolean | null;
  guide_header_layout: string;
  guide_header_image: string;
  guide_welcome_message: string;
  resources: { label: string; value: string; url: string }[];
} = {
  name: "FedeJrn",
  icon_url: "",
  guide_enabled: true,
  guide_show_on_join: true,
  guide_header_layout: "New post",
  guide_header_image: "New",
  guide_welcome_message: "Welcome message",
  resources: [
    { label: "New Post", value: "new-post", url: "new-post" },
    { label: "New Post", value: "new-post", url: "new-post" },
  ],
};

const CampfireGuide = ({ slug }: { slug: string }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [guideData, setGuideData] = useState(initialGuideData);

  const updateSettingsMutation = useDummyMutation(
    slug,
    (payload: Partial<typeof guideData>) => {
      setGuideData((prev) => ({
        ...prev,
        ...payload,
      }));
    },
  );

  const updateResourcesMutation = useDummyMutation(
    slug,
    (resources: Partial<typeof guideData>) => {
      setGuideData((prev) => ({
        ...prev,
        ...resources,
      }));
    },
  );

  const isLoading =
    updateSettingsMutation.isPending || updateResourcesMutation.isPending;
  const isError =
    updateSettingsMutation.isError || updateResourcesMutation.isError;
  const guideError =
    updateResourcesMutation.error || updateSettingsMutation.error;

  // Transform resources for UI compatibility
  const uiResources =
    guideData?.resources.map((r) => ({
      label: r.label,
      value: r.url || r.label,
    })) || [];

  const guideSettings: SettingsItemProps[] = guideData
    ? [
        {
          label: "Enable campfire guide",
          description: "Appears in the sidebar and About section",
          toggle: true,
          toggleValue: guideData.guide_enabled,
          onToggle: (val) =>
            updateSettingsMutation.mutate({
              guide_enabled: val,
            }),
        },
        {
          label: "Show when someone joins this campfire",
          toggle: true,
          toggleValue: guideData.guide_show_on_join,
          onToggle: (val) =>
            updateSettingsMutation.mutate({
              guide_show_on_join: val,
            }),
        },
        {
          label: "Header layout",
          value: guideData.guide_header_layout,
          type: "select",
          options: ["Name and Banner", "Avatar and Banner", "Avatar and Name"],
          disabled: true,
        },
        {
          label: "Header image",
          value: guideData.guide_header_image,
          type: "select",
          options: ["Campfire banner", "Campfire icon"],
          disabled: true,
        },
        {
          label: "Welcome message",
          value: guideData.guide_welcome_message,
          type: "input",
        },
        {
          label: "Resources",
          value: `3`,
          type: "resources",
          resourcesList: uiResources,
        },
      ]
    : [];

  const handleSave = (
    label: string,
    value: string | { label: string; value: string }[],
  ) => {
    if (!guideData) return;

    switch (label) {
      case "Welcome message":
        if (typeof value === "string") {
          updateSettingsMutation.mutate({ guide_welcome_message: value });
        }
        break;
      case "Header layout":
        if (typeof value === "string") {
          updateSettingsMutation.mutate({ guide_header_layout: value });
        }
        break;
      case "Header image":
        if (typeof value === "string") {
          updateSettingsMutation.mutate({ guide_header_image: value });
        }
        break;
      case "Resources":
        if (Array.isArray(value)) {
          // First, perform validation
          const hasInvalidLink = value.some(
            (r) => r.value && !r.value.startsWith("https"),
          );
          const hasEmptyField = value.some((r) => !r.value);

          if (hasInvalidLink) {
            toast.error("Invalid link format. Please include https://");
            return;
          }

          if (hasEmptyField) {
            toast.error("Please fill in both fields in");
            return;
          }

          // If validation passes, map the data
          const apiResources = value.map((r) => ({
            label: r.label,
            url: r.value !== r.label ? r.value : undefined,
          }));

          updateResourcesMutation.mutate(apiResources);
        }

        break;
      default:
        break;
    }

    setOpenIndex(null);
  };

  if (isLoading) {
    return <CampfireGuideSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-sm text-red-500 mb-4">
          Failed to load campfire guide:{" "}
          {guideError?.message || "Unknown error"}
        </p>
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          className="rounded-lg"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (!guideData) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-sm">No guide data found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row items-start w-full gap-8 max-w-6xl">
      <div className="flex flex-col w-full lg:w-3/5 gap-6">
        {/* Mobile Preview Button */}
        <div className="block lg:hidden">
          <GuidePreviewDrawer
            welcomeMsg={guideData.guide_welcome_message || "You are welcome !"}
            campfireName={guideData.name}
            resources={uiResources}
            icon={guideData.icon_url}
          />
        </div>

        <div className="flex flex-col w-full gap-4">
          {guideSettings.map((item, index) => (
            <SettingsItem
              key={index}
              {...item}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              onClose={() => setOpenIndex(null)}
              onSave={handleSave}
              isLoading={
                updateSettingsMutation.isPending ||
                updateResourcesMutation.isPending
              }
            />
          ))}
        </div>
      </div>

      {/* Desktop Preview Card */}
      <Card className="hidden lg:block w-full lg:w-2/5 items-start rounded-2xl shadow-md p-8 lg:sticky lg:top-6">
        <GuidePreview
          welcomeMsg={guideData.guide_welcome_message || "You are welcome !"}
          campfireName={guideData.name}
          resource={uiResources}
          icon={guideData.icon_url}
        />
      </Card>
    </div>
  );
};

export default CampfireGuide;
