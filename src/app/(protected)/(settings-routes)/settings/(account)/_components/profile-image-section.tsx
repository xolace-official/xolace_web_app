"use client";

import {
  MASCOT_OPTIONS,
  MascotPicker,
} from "@/components/shared/settings/mascot-picker";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProfileMutations } from "@/features/user/hooks/use-profile-mutations";
import { useAppStore } from "@/providers/app-store-provider";

const DEFAULT_PROFILE_IMAGE = "/mascots/default.png";

export function ProfileImageSection() {
  const profile = useAppStore((s) => s.profile);
  const { mutate } = useProfileMutations();

  const profileImage = profile.avatar_url ?? null;
  const username = profile.username ?? "User";

  const selectedMascot = profileImage
    ? MASCOT_OPTIONS.find((m) => m.id === profileImage)
    : undefined;
  const displayImage = selectedMascot?.src ?? DEFAULT_PROFILE_IMAGE;

  const handleValueChange = (value: string | null) => {
    mutate({ avatar_url: value });
  };

  return (
    <MascotPicker value={profileImage} onValueChange={handleValueChange}>
      <button type="button" className="group relative">
        <Avatar className="size-10 rounded-lg transition-opacity group-hover:opacity-80">
          <AvatarImage src={displayImage} alt="Profile image" />
          <AvatarFallback className="rounded-lg">
            {username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </button>
    </MascotPicker>
  );
}
