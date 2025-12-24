"use client";

import { useState } from "react";
import ManageCampfireCard, {
  type UserCampfireFavoriteJoin,
} from "@/components/cards/campfires/manage-card";

/**
 * Dummy campfire data for demonstration
 */
const DUMMY_CAMPFIRES: UserCampfireFavoriteJoin[] = [
  {
    campfireId: "1",
    name: "Web Development",
    slug: "web-dev",
    description:
      "A community for web developers to share knowledge and collaborate on projects",
    iconURL: "https://api.dicebear.com/7.x/shapes/svg?seed=web-dev",
    isFavorite: true,
    isJoined: true,
  },
  {
    campfireId: "2",
    name: "React Enthusiasts",
    slug: "react-enthusiasts",
    description:
      "Everything React - hooks, components, state management, and more",
    iconURL: "https://api.dicebear.com/7.x/shapes/svg?seed=react",
    isFavorite: false,
    isJoined: true,
  },
  {
    campfireId: "3",
    name: "TypeScript Wizards",
    slug: "typescript-wizards",
    description: "Master TypeScript with fellow type-safe enthusiasts",
    iconURL: "https://api.dicebear.com/7.x/shapes/svg?seed=typescript",
    isFavorite: true,
    isJoined: false,
  },
  {
    campfireId: "4",
    name: "Design Systems",
    slug: "design-systems",
    description:
      "Building scalable, maintainable design systems for modern applications,  maintainable design systems for modern applications  maintainable design systems for modern applications  maintainable design systems for modern applications",
    isFavorite: false,
    isJoined: false,
  },
  {
    campfireId: "5",
    name: "Next.js Developers",
    slug: "nextjs-devs",
    description: "Server components, app router, and everything Next.js 14+",
    iconURL: "https://api.dicebear.com/7.x/shapes/svg?seed=nextjs",
    isFavorite: false,
    isJoined: true,
  },
  {
    campfireId: "6",
    name: "React Developers",
    slug: "react-devs",
    description: "Server components, app router, and everything Next.js 14+",
    iconURL: "https://api.dicebear.com/7.x/shapes/svg?seed=nextjs",
    isFavorite: false,
    isJoined: true,
  },
  {
    campfireId: "7",
    name: "React Developers",
    slug: "react-devs",
    description: "Server components, app router, and everything Next.js 14+",
    iconURL: "https://api.dicebear.com/7.x/shapes/svg?seed=nextjs",
    isFavorite: false,
    isJoined: true,
  },
  {
    campfireId: "8",
    name: "React Developers",
    slug: "react-devs",
    description: "Server components, app router, and everything Next.js 14+",
    iconURL: "https://api.dicebear.com/7.x/shapes/svg?seed=nextjs",
    isFavorite: false,
    isJoined: true,
  },
  {
    campfireId: "9",
    name: "React Developers",
    slug: "react-devs",
    description: "Server components, app router, and everything Next.js 14+",
    iconURL: "https://api.dicebear.com/7.x/shapes/svg?seed=nextjs",
    isFavorite: false,
    isJoined: true,
  },
  {
    campfireId: "10",
    name: "React Developers",
    slug: "react-devs",
    description: "Server components, app router, and everything Next.js 14+",
    iconURL: "https://api.dicebear.com/7.x/shapes/svg?seed=nextjs",
    isFavorite: false,
    isJoined: true,
  },
  {
    campfireId: "11",
    name: "React Developers",
    slug: "react-devs",
    description: "Server components, app router, and everything Next.js 14+",
    iconURL: "https://api.dicebear.com/7.x/shapes/svg?seed=nextjs",
    isFavorite: false,
    isJoined: true,
  },
  {
    campfireId: "12",
    name: "React Developers",
    slug: "react-devs",
    description: "Server components, app router, and everything Next.js 14+",
    iconURL: "https://api.dicebear.com/7.x/shapes/svg?seed=nextjs",
    isFavorite: false,
    isJoined: true,
  },
  {
    campfireId: "13",
    name: "React Developers",
    slug: "react-devs",
    description: "Server components, app router, and everything Next.js 14+",
    iconURL: "https://api.dicebear.com/7.x/shapes/svg?seed=nextjs",
    isFavorite: false,
    isJoined: true,
  },
  {
    campfireId: "14",
    name: "React Developers",
    slug: "react-devs",
    description: "Server components, app router, and everything Next.js 14+",
    iconURL: "https://api.dicebear.com/7.x/shapes/svg?seed=nextjs",
    isFavorite: false,
    isJoined: true,
  },
];

export function ManageCampfireList() {
  const [campfires, setCampfires] = useState(DUMMY_CAMPFIRES);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [joiningId, setJoiningId] = useState<string | null>(null);

  const handleToggleFavorite = async (
    campfireId: string,
    currentState: boolean,
  ) => {
    setTogglingId(campfireId);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    setCampfires((prev) =>
      prev.map((campfire) =>
        campfire.campfireId === campfireId
          ? { ...campfire, isFavorite: !currentState }
          : campfire,
      ),
    );

    setTogglingId(null);
  };

  const handleJoinCampfire = async (campfireId: string) => {
    setJoiningId(campfireId);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    setCampfires((prev) =>
      prev.map((campfire) =>
        campfire.campfireId === campfireId
          ? { ...campfire, isJoined: true }
          : campfire,
      ),
    );

    setJoiningId(null);
  };

  return (
    <div className="flex flex-col gap-4">
      {campfires.map((campfire) => (
        <ManageCampfireCard
          key={campfire.campfireId}
          {...campfire}
          onToggleFavorite={handleToggleFavorite}
          onJoinCampfire={handleJoinCampfire}
          isTogglingFavorite={togglingId === campfire.campfireId}
          isJoining={joiningId === campfire.campfireId}
        />
      ))}
    </div>
  );
}
