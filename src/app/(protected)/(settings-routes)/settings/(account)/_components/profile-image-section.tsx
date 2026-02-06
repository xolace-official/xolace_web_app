"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MascotPicker,
  MASCOT_OPTIONS,
} from "@/components/shared/settings/mascot-picker";

// TODO: Replace with actual default profile image
const DEFAULT_PROFILE_IMAGE = "/mascots/default.png";

export function ProfileImageSection() {
  // TODO: Get profile data from your auth/user context or store
  // const { profile } = useUserStore();
  // TODO: Add mutation hook for updating profile
  // const { updateProfileMutation } = useProfileMutations();

  // Placeholder values - replace with actual state
  const profileImage: string | null = null;
  const username = "User";

  const selectedMascot = profileImage
    ? MASCOT_OPTIONS.find((m) => m.id === profileImage)
    : undefined;
  const displayImage = selectedMascot?.src ?? DEFAULT_PROFILE_IMAGE;

  const handleValueChange = (value: string | null) => {
    // TODO: Call mutation to update profile image
    // updateProfileMutation.mutate({ profile_image: value });
    console.log("Update profile image:", value);
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
