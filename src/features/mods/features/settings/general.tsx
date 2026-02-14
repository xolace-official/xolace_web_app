"use client";

import React, { useState } from "react";
import SettingsItem, { type SettingsItemProps } from "./settings-items";
import { toast } from "sonner";
import { generateCampfireSlug } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import type { CampfireInterface } from "@/features/campfires";
import { useUpdateCampfireMutation } from "@/features/mods/features/mockhooks";

interface GeneralSettingsProps {
  campfire: CampfireInterface | null;
}

const GeneralSettings = ({ campfire }: GeneralSettingsProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // 1. Call the mutation hook
  const { mutate: updateCampfire, isPending } = useUpdateCampfireMutation();

  const generalSettingsOptions: SettingsItemProps[] = [
    {
      label: "Display name",
      description: "Campfire display name",
      type: "input",
      value: campfire?.name.replace(/^x\//, ""),
    },
    {
      label: "Description",
      description: "Campfire description",
      type: "textarea",
      value: campfire?.description,
    },
    // {
    //   label: "Welcome message",
    //   type: "input",
    // },
  ];

  const handleSave = (
    label: string,
    value: string | { label: string; value: string }[],
  ) => {
    if (!campfire) return;

    let updates = {};

    switch (label) {
      case "Display name":
        if (typeof value === "string") {
          const newSlug = generateCampfireSlug(value);
          updates = { name: value, slug: newSlug };
        } else {
          console.warn("Display name value should be a string");
          return;
        }
        break;
      case "Description":
        if (typeof value === "string") {
          updates = { description: value };
        } else {
          console.warn("Description value should be a string");
          return;
        }
        break;
      case "Welcome message":
        if (typeof value === "string") {
          updates = { welcomeMessage: value };
        } else {
          console.warn("Welcome message value should be a string");
          return;
        }
        break;
      default:
        console.warn(`No update handler for setting: ${label}`);
        return;
    }

    updateCampfire(
      {
        campfireId: campfire.id,
        slug: campfire.slug,
        updates,
      },
      {
        onSuccess: () => {
          toast.success(`${label} updated successfully!`);
          setOpenIndex(null);
        },
        onError: (error) => {
          toast.error(`Failed to update ${label}: ${error.message}`);
        },
      },
    );
  };

  return (
    <div className="flex w-full flex-col items-start gap-6">
      {generalSettingsOptions.map((option, index) => (
        <SettingsItem
          key={`${option.type}-${index}`}
          {...option}
          isOpen={openIndex === index}
          onClick={() => setOpenIndex(openIndex === index ? null : index)}
          onClose={() => setOpenIndex(null)}
          onSave={handleSave}
          isSaving={isPending}
        />
      ))}

      {isPending && openIndex !== null && (
        <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-muted/20 backdrop-blur-sm dark:bg-foreground/40">
          <div className="flex items-center gap-4 rounded-xl border  p-6 shadow-2xl">
            <Loader2 className="text-primary h-6 w-6 animate-spin" />
            <div>
              <p className="font-medium">Saving Changes</p>
              <p className="text-sm">Updating your campfire settings...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneralSettings;
