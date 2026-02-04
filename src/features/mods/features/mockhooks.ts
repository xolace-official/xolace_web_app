import { useState, useEffect } from "react";
import { UserSearchResult } from "@/features/mods/features/moderators/add-camper-modal";
import { CampfireInterface, dummy_campfires } from "@/features/campfires";

// Mock user database
const MOCK_USERS: UserSearchResult[] = [
  {
    id: "1",
    username: "forestexplorer",
    avatar_url:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=forestexplorer",
    created_at: new Date(2023, 5, 15).toISOString(),
    reputation: 1250,
  },
  {
    id: "2",
    username: "campmaster99",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=campmaster99",
    created_at: new Date(2024, 1, 20).toISOString(),
    reputation: 890,
  },
  {
    id: "3",
    username: "trailblazer",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=trailblazer",
    created_at: new Date(2023, 8, 10).toISOString(),
    reputation: 2340,
  },
  {
    id: "4",
    username: "wildernesswarrior",
    avatar_url:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=wildernesswarrior",
    created_at: new Date(2024, 0, 5).toISOString(),
    reputation: 567,
  },
  {
    id: "5",
    username: "natureninja",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=natureninja",
    created_at: new Date(2023, 11, 25).toISOString(),
    reputation: 3450,
  },
  {
    id: "6",
    username: "hikerhero",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=hikerhero",
    created_at: new Date(2024, 2, 12).toISOString(),
    reputation: 1890,
  },
  {
    id: "7",
    username: "outdooradventurer",
    avatar_url:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=outdooradventurer",
    created_at: new Date(2023, 7, 30).toISOString(),
    reputation: 4120,
  },
  {
    id: "8",
    username: "campfirechief",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=campfirechief",
    created_at: new Date(2024, 3, 8).toISOString(),
    reputation: 678,
  },
  {
    id: "9",
    username: "mountainman",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=mountainman",
    created_at: new Date(2023, 4, 18).toISOString(),
    reputation: 2890,
  },
  {
    id: "10",
    username: "forestfriend",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=forestfriend",
    created_at: new Date(2024, 4, 1).toISOString(),
    reputation: 445,
  },
];

// 1. useDebounce Hook
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// 2. useSearchUsers Hook
export function useSearchUsers(searchTerm: string) {
  const [data, setData] = useState<UserSearchResult[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!searchTerm || searchTerm.length < 3) {
      setData(null);
      setIsLoading(false);
      setIsError(false);
      return;
    }

    setIsLoading(true);
    setIsError(false);

    // Simulate API call delay
    const timer = setTimeout(() => {
      try {
        // Filter users based on search term
        const filteredUsers = MOCK_USERS.filter((user) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase()),
        );

        // Randomly simulate error (10% chance)
        if (Math.random() < 0.1) {
          setIsError(true);
          setData(null);
        } else {
          setData(filteredUsers);
          setIsError(false);
        }
      } catch (error) {
        setIsError(true);
        setData(null);
      } finally {
        setIsLoading(false);
      }
    }, 800); // Simulate network delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  return { data, isLoading, isError };
}

// 3. useAddApprovedUser Hook
export function useAddApprovedUser(campfireId: string) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutateAsync = async ({ userId }: { userId: string }) => {
    setIsPending(true);
    setError(null);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Randomly simulate error (15% chance)
    if (Math.random() < 0.15) {
      const errorMessage = "Failed to approve user. Please try again.";
      setError(new Error(errorMessage));
      setIsPending(false);
      throw new Error(errorMessage);
    }

    // Simulate successful approval
    console.log(`User ${userId} approved for campfire ${campfireId}`);
    setIsPending(false);

    return { success: true, userId, campfireId };
  };

  return {
    mutateAsync,
    isPending,
    error,
  };
}

// 4. getApprovedUsers Hook
export interface ApprovedUser {
  id: string;
  username: string;
  avatar_url: string;
  reputation: number;
  joined_at: string;
}

// Mock approved users database - organized by campfire ID
const MOCK_APPROVED_USERS_BY_CAMPFIRE: Record<string, ApprovedUser[]> = {
  // Tech Innovators Hub
  "a1b2c3d4-e5f6-7890-abcd-ef1234567890": [
    {
      id: "3",
      username: "trailblazer",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=trailblazer",
      reputation: 2340,
      joined_at: new Date(2023, 8, 10).toISOString(),
    },
    {
      id: "7",
      username: "outdooradventurer",
      avatar_url:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=outdooradventurer",
      reputation: 4120,
      joined_at: new Date(2023, 7, 30).toISOString(),
    },
  ],
  // Creative Writers Circle
  "b2c3d4e5-f6a7-8901-bcde-f12345678901": [
    {
      id: "5",
      username: "natureninja",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=natureninja",
      reputation: 3450,
      joined_at: new Date(2023, 11, 25).toISOString(),
    },
    {
      id: "9",
      username: "mountainman",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=mountainman",
      reputation: 2890,
      joined_at: new Date(2023, 4, 18).toISOString(),
    },
  ],
  // Fitness Wellness Warriors
  "c3d4e5f6-a7b8-9012-cdef-123456789012": [
    {
      id: "1",
      username: "forestexplorer",
      avatar_url:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=forestexplorer",
      reputation: 1250,
      joined_at: new Date(2023, 5, 15).toISOString(),
    },
    {
      id: "6",
      username: "hikerhero",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=hikerhero",
      reputation: 1890,
      joined_at: new Date(2024, 2, 12).toISOString(),
    },
  ],
  // Game Developers Network
  "d4e5f6a7-b8c9-0123-def4-234567890123": [
    {
      id: "2",
      username: "campmaster99",
      avatar_url:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=campmaster99",
      reputation: 890,
      joined_at: new Date(2024, 1, 20).toISOString(),
    },
  ],
  // Sustainable Living Collective
  "e5f6a7b8-c9d0-1234-ef56-345678901234": [
    {
      id: "4",
      username: "wildernesswarrior",
      avatar_url:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=wildernesswarrior",
      reputation: 567,
      joined_at: new Date(2024, 0, 5).toISOString(),
    },
    {
      id: "8",
      username: "campfirechief",
      avatar_url:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=campfirechief",
      reputation: 678,
      joined_at: new Date(2024, 3, 8).toISOString(),
    },
    {
      id: "10",
      username: "forestfriend",
      avatar_url:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=forestfriend",
      reputation: 445,
      joined_at: new Date(2024, 4, 1).toISOString(),
    },
  ],
};

export function getApprovedUsers(campfireId: string) {
  const [data, setData] = useState<ApprovedUser[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Simulate initial API call
    const fetchApprovedUsers = async () => {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Randomly simulate error (5% chance)
      if (Math.random() < 0.05) {
        const errorMessage = "Failed to fetch approved users";
        setIsError(true);
        setError(new Error(errorMessage));
        setIsLoading(false);
        return;
      }

      // Get approved users for this specific campfire
      const campfireApprovedUsers =
        MOCK_APPROVED_USERS_BY_CAMPFIRE[campfireId] || [];

      console.log(
        `Fetching approved users for campfire: ${campfireId}`,
        campfireApprovedUsers,
      );
      setData(campfireApprovedUsers);
      setIsLoading(false);
    };

    fetchApprovedUsers();
  }, [campfireId]);

  return {
    data,
    isLoading,
    isError,
    error,
  };
}

// 5. Permission Groups
export interface Permission {
  id: number;
  name: string;
  display_name: string;
  description: string;
}

export interface PermissionGroup {
  group: string;
  label: string;
  description: string;
  permissions: Permission[];
}

const MOCK_PERMISSION_GROUPS: PermissionGroup[] = [
  {
    group: "manage_content",
    label: "Manage Content",
    description: "Control posts, comments, and user-generated content",
    permissions: [
      {
        id: 1,
        name: "delete_posts",
        display_name: "Delete Posts",
        description: "Remove inappropriate or rule-breaking posts",
      },
      {
        id: 2,
        name: "edit_posts",
        display_name: "Edit Posts",
        description: "Modify post content and titles",
      },
      {
        id: 3,
        name: "pin_posts",
        display_name: "Pin Posts",
        description: "Pin important posts to the top",
      },
      {
        id: 4,
        name: "delete_comments",
        display_name: "Delete Comments",
        description: "Remove inappropriate comments",
      },
    ],
  },
  {
    group: "manage_users",
    label: "Manage Users",
    description: "Moderate user behavior and access",
    permissions: [
      {
        id: 5,
        name: "ban_users",
        display_name: "Ban Users",
        description: "Temporarily or permanently ban users",
      },
      {
        id: 6,
        name: "mute_users",
        display_name: "Mute Users",
        description: "Prevent users from posting or commenting",
      },
      {
        id: 7,
        name: "warn_users",
        display_name: "Warn Users",
        description: "Issue warnings to users",
      },
      {
        id: 8,
        name: "view_user_reports",
        display_name: "View User Reports",
        description: "Access user report history",
      },
    ],
  },
  {
    group: "manage_settings",
    label: "Manage Settings",
    description: "Configure campfire settings and rules",
    permissions: [
      {
        id: 9,
        name: "edit_campfire_settings",
        display_name: "Edit Campfire Settings",
        description: "Modify campfire description, rules, and settings",
      },
      {
        id: 10,
        name: "manage_tags",
        display_name: "Manage Tags",
        description: "Create and manage post tags",
      },
      {
        id: 11,
        name: "manage_flairs",
        display_name: "Manage Flairs",
        description: "Create and assign user flairs",
      },
    ],
  },
  {
    group: "manage_firekeepers",
    label: "Manage Firekeepers",
    description: "Control moderator team and permissions",
    permissions: [
      {
        id: 12,
        name: "invite_firekeepers",
        display_name: "Invite Firekeepers",
        description: "Send moderator invitations",
      },
      {
        id: 13,
        name: "remove_firekeepers",
        display_name: "Remove Firekeepers",
        description: "Remove moderators from the team",
      },
      {
        id: 14,
        name: "edit_firekeeper_permissions",
        display_name: "Edit Firekeeper Permissions",
        description: "Modify other moderators' permissions",
      },
    ],
  },
];

export function getPermissionGroups() {
  const [data, setData] = useState<PermissionGroup[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPermissions = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 600));
      console.log("Fetching permission groups");
      setData(MOCK_PERMISSION_GROUPS);
      setIsLoading(false);
    };
    fetchPermissions();
  }, []);

  return { data, isLoading };
}

// 6. useCreateFirekeeperInviteV2
export interface CreateInviteParams {
  inviteeId: string;
  permissionIds: number[];
  invitationMessage?: string;
}

export function useCreateFirekeeperInviteV2(campfireId: string) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutateAsync = async (params: CreateInviteParams) => {
    setIsPending(true);
    setError(null);

    await new Promise((resolve) => setTimeout(resolve, 1200));

    if (Math.random() < 0.12) {
      const errorMessage = "Failed to send invitation. Please try again.";
      setError(new Error(errorMessage));
      setIsPending(false);
      throw new Error(errorMessage);
    }

    console.log("Firekeeper invitation sent:", {
      campfireId,
      inviteeId: params.inviteeId,
      permissionIds: params.permissionIds,
      message: params.invitationMessage,
    });

    setIsPending(false);
    return {
      success: true,
      inviteeId: params.inviteeId,
      permissionCount: params.permissionIds.length,
      campfireId,
    };
  };

  return { mutateAsync, isPending, error };
}

// 7. getCampfireModerators
export interface Moderator {
  id: string;
  username: string;
  avatar_url: string;
  role: "creator" | "moderator";
  permission_summary: string;
  permission_count: number;
  can_edit: boolean;
  joined_at: string;
}

// Mock moderators database - organized by campfire ID
const MOCK_MODERATORS_BY_CAMPFIRE: Record<string, Moderator[]> = {
  // Tech Innovators Hub
  "a1b2c3d4-e5f6-7890-abcd-ef1234567890": [
    {
      id: "u1s2e3r4-5678-90ab-cdef-123456789012",
      username: "techFounder",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=techFounder",
      role: "creator",
      permission_summary: "Everything",
      permission_count: 14,
      can_edit: false,
      joined_at: "2025-11-15T08:30:00.000Z",
    },
    {
      id: "2",
      username: "trailblazer",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=trailblazer",
      role: "moderator",
      permission_summary: "Manage Content, Manage Users",
      permission_count: 8,
      can_edit: true,
      joined_at: new Date(2023, 8, 10).toISOString(),
    },
    {
      id: "5",
      username: "natureninja",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=natureninja",
      role: "moderator",
      permission_summary: "Manage Content",
      permission_count: 4,
      can_edit: true,
      joined_at: new Date(2023, 11, 25).toISOString(),
    },
  ],
  // Creative Writers Circle
  "b2c3d4e5-f6a7-8901-bcde-f12345678901": [
    {
      id: "u2s3e4r5-6789-01ab-cdef-234567890123",
      username: "writerFounder",
      avatar_url:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=writerFounder",
      role: "creator",
      permission_summary: "Everything",
      permission_count: 14,
      can_edit: false,
      joined_at: "2025-12-01T14:20:00.000Z",
    },
    {
      id: "6",
      username: "hikerhero",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=hikerhero",
      role: "moderator",
      permission_summary: "Manage Users, Manage Settings",
      permission_count: 7,
      can_edit: true,
      joined_at: new Date(2024, 2, 12).toISOString(),
    },
  ],
  // Fitness Wellness Warriors
  "c3d4e5f6-a7b8-9012-cdef-123456789012": [
    {
      id: "u3s4e5r6-7890-12ab-cdef-345678901234",
      username: "fitnessFounder",
      avatar_url:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=fitnessFounder",
      role: "creator",
      permission_summary: "Everything",
      permission_count: 14,
      can_edit: false,
      joined_at: "2025-10-22T10:15:00.000Z",
    },
    {
      id: "9",
      username: "mountainman",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=mountainman",
      role: "moderator",
      permission_summary: "Manage Content, Manage Settings",
      permission_count: 7,
      can_edit: false,
      joined_at: new Date(2023, 4, 18).toISOString(),
    },
  ],
  // Game Developers Network
  "d4e5f6a7-b8c9-0123-def4-234567890123": [
    {
      id: "u4s5e6r7-8901-23ab-cdef-456789012345",
      username: "gameDevFounder",
      avatar_url:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=gameDevFounder",
      role: "creator",
      permission_summary: "Everything",
      permission_count: 14,
      can_edit: false,
      joined_at: "2026-01-05T16:45:00.000Z",
    },
    {
      id: "1",
      username: "forestexplorer",
      avatar_url:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=forestexplorer",
      role: "moderator",
      permission_summary: "Manage Content",
      permission_count: 4,
      can_edit: true,
      joined_at: new Date(2023, 5, 15).toISOString(),
    },
  ],
  // Sustainable Living Collective
  "e5f6a7b8-c9d0-1234-ef56-345678901234": [
    {
      id: "u5s6e7r8-9012-34ab-cdef-567890123456",
      username: "ecoFounder",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=ecoFounder",
      role: "creator",
      permission_summary: "Everything",
      permission_count: 14,
      can_edit: false,
      joined_at: "2025-09-18T09:00:00.000Z",
    },
    {
      id: "7",
      username: "outdooradventurer",
      avatar_url:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=outdooradventurer",
      role: "moderator",
      permission_summary: "Manage Content, Manage Users",
      permission_count: 8,
      can_edit: true,
      joined_at: new Date(2023, 7, 30).toISOString(),
    },
  ],
};

export function getCampfireModerators(campfireId: string) {
  const [data, setData] = useState<Moderator[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchModerators = async () => {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      await new Promise((resolve) => setTimeout(resolve, 900));

      if (Math.random() < 0.05) {
        const errorMessage = "Failed to fetch moderators";
        setIsError(true);
        setError(new Error(errorMessage));
        setIsLoading(false);
        return;
      }

      const campfireModerators = MOCK_MODERATORS_BY_CAMPFIRE[campfireId] || [];
      console.log(
        `Fetching moderators for campfire: ${campfireId}`,
        campfireModerators,
      );
      setData(campfireModerators);
      setIsLoading(false);
    };

    fetchModerators();
  }, [campfireId]);

  return { data, isLoading, isError, error };
}

// ============================================
// HOOK: getCampfireWithSlug
// ============================================

export function useCampfireWithSlug(slug: string, userId?: string) {
  const [data, setData] = useState<CampfireInterface | null>(null);
  const [isPending, setIsPending] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchCampfire = async () => {
    setIsPending(true);
    setIsError(false);
    setError(null);

    await new Promise((resolve) => setTimeout(resolve, 700));

    const campfire = dummy_campfires.find((c) => c.slug === slug);

    if (!campfire) {
      setIsError(true);
      setError(new Error(`Campfire with slug "${slug}" not found`));
      setIsPending(false);
      return;
    }

    setData(campfire);
    setIsPending(false);
  };

  useEffect(() => {
    fetchCampfire();
  }, [slug, userId]);

  return {
    data,
    isPending,
    isError,
    error,
    refetch: fetchCampfire,
  };
}

export interface UpdateCampfireParams {
  campfireId: string;
  slug: string;
  updates: {
    name?: string;
    slug?: string;
    description?: string;
    welcomeMessage?: string;
    visibility?: string;
    interaction_style?: string;
    [key: string]: any; // Allow other fields
  };
}

export interface MutationCallbacks {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export function useUpdateCampfireMutation() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = (
    params: UpdateCampfireParams,
    callbacks?: MutationCallbacks,
  ) => {
    const executeUpdate = async () => {
      setIsPending(true);
      setError(null);

      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Randomly simulate error (10% chance)
        if (Math.random() < 0.1) {
          throw new Error("Failed to update campfire settings");
        }

        // Simulate successful update
        console.log("Campfire updated:", {
          campfireId: params.campfireId,
          slug: params.slug,
          updates: params.updates,
        });

        // Update the dummy_campfires array (for local testing)
        const campfireIndex = dummy_campfires.findIndex(
          (c) => c.id === params.campfireId,
        );

        if (campfireIndex !== -1) {
          dummy_campfires[campfireIndex] = <CampfireInterface>{
            ...dummy_campfires[campfireIndex],
            ...params.updates,
          };
        }

        const result = {
          success: true,
          campfireId: params.campfireId,
          updates: params.updates,
        };

        setIsPending(false);

        // Call success callback
        if (callbacks?.onSuccess) {
          callbacks.onSuccess(result);
        }

        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error");
        setError(error);
        setIsPending(false);

        // Call error callback
        if (callbacks?.onError) {
          callbacks.onError(error);
        }

        throw error;
      }
    };

    executeUpdate();
  };

  const mutateAsync = async (params: UpdateCampfireParams) => {
    setIsPending(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Randomly simulate error (10% chance)
      if (Math.random() < 0.1) {
        throw new Error("Failed to update campfire settings");
      }

      // Simulate successful update
      console.log("Campfire updated:", {
        campfireId: params.campfireId,
        slug: params.slug,
        updates: params.updates,
      });

      // Update the dummy_campfires array (for local testing)
      const campfireIndex = dummy_campfires.findIndex(
        (c) => c.id === params.campfireId,
      );

      if (campfireIndex !== -1) {
        dummy_campfires[campfireIndex] = <CampfireInterface>{
          ...dummy_campfires[campfireIndex],
          ...params.updates,
        };
      }

      const result = {
        success: true,
        campfireId: params.campfireId,
        updates: params.updates,
      };

      setIsPending(false);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      setError(error);
      setIsPending(false);
      throw error;
    }
  };

  return {
    mutate,
    mutateAsync,
    isPending,
    error,
  };
}
