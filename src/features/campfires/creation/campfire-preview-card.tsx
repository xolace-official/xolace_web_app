"use client";

import Image from "next/image";
import { type Control, useWatch } from "react-hook-form";
import { cn } from "@/lib/utils";
import { truncateText } from "@/utils";
import { CampfireRealm, type FullFormType } from "@/validation/create-campfire";
import TagCard from "./tag-card";

const REALM_DISPLAY_MAP: Record<CampfireRealm, string> = {
  [CampfireRealm.Collaborative]: "Collaborative",
  [CampfireRealm.Supportive]: "Supportive",
  [CampfireRealm.Educational]: "Educational",
  [CampfireRealm.Expressive]: "Expressive",
  [CampfireRealm.Motivational]: "Motivational",
};

interface CampfirePreviewCardProps {
  step: number;
  control: Control<FullFormType>;
}

/**
 * Render a live preview card for a campfire using the current form values.
 *
 * @param step - The current creation step; controls which preview elements (banner, icon, realm tag) are shown.
 * @returns A JSX element displaying the campfire's name, truncated description, optional banner and icon, and a realm tag.
 */
export default function CampfirePreviewCard({
  step,
  control,
}: CampfirePreviewCardProps) {
  const name = useWatch({ control, name: "name" });
  const description = useWatch({ control, name: "description" });
  const realm = useWatch({ control, name: "realm" });
  const iconUrl = useWatch({ control, name: "icon_url" });
  const bannerUrl = useWatch({ control, name: "banner_url" });

  const displayName = name?.trim() ? `x/${name.trim()}` : "x/campfire name";
  const displayDescription = description?.trim() || "Your campfire description";
  const realmDisplayName = REALM_DISPLAY_MAP[realm] || "Expressive";
  const hasIcon = iconUrl?.trim();
  const hasBanner = bannerUrl?.trim();

  return (
    <div
      className={cn(
        "order-1 col-span-1 rounded-2xl shadow-lg md:order-2 md:col-span-5",
        step < 3 && "border pt-2",
      )}
    >
      <div className="flex flex-col items-start justify-start gap-2 pb-2">
        {step >= 3 ? (
          hasBanner ? (
            <div className="relative h-8 w-full overflow-hidden rounded-t-2xl">
              <Image
                src={bannerUrl!}
                alt="Campfire banner"
                fill
                className="object-cover object-center"
              />
            </div>
          ) : (
            <div className="bg-muted flex h-8 w-full rounded-t-2xl" />
          )
        ) : null}
        <div className="flex flex-row gap-2 px-4">
          {step >= 3 ? (
            hasIcon ? (
              <Image
                src={iconUrl!}
                height={20}
                width={20}
                alt="Campfire icon"
                className="h-10 w-10 rounded-full border object-cover"
              />
            ) : (
              <p className="flex h-10 w-10 items-center justify-center rounded-full border font-semibold text-foreground">
                <span className="bg-foreground flex h-9 w-9 items-center justify-center rounded-full font-semibold text-muted-foreground">
                  x/
                </span>
              </p>
            )
          ) : null}
          <div className="flex flex-col items-start">
            {displayName}
            <p className="flex flex-row gap-4 text-xs text-muted-foreground">
              <span>1 member</span>
              <span>1 online</span>
            </p>
          </div>
        </div>
        <p className="text-sm flex px-4 text-foreground">
          {truncateText(displayDescription, 20)}
        </p>
        {step !== 1 ? (
          <p className="flex w-full items-end justify-end px-4 text-sm">
            <TagCard _id="realm" name={realmDisplayName} />
          </p>
        ) : null}
      </div>
    </div>
  );
}