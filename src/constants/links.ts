import {
  Bomb,
  Cog,
  Flame,
  FlameKindling,
  HandHelping,
  HeartPulse,
  LibraryBig,
  Mailbox,
  MessageSquareDiff,
  Plus,
  Search,
  TvMinimalPlay,
} from "lucide-react";

export const sidebarLinks = [
  {
    icon: FlameKindling,
    route: "/feed",
    label: "Fireside",
  },
  {
    icon: MessageSquareDiff,
    route: "/create-post",
    label: "Create Post",
  },
  {
    icon: Bomb,
    route: "/explore",
    label: "Explore",
  },
  {
    icon: LibraryBig,
    route: "/collections",
    label: "Collections",
  },
  {
    icon: Mailbox,
    route: "https://messaging.xolace.app/dashboard",
    label: "Confide",
    new: true,
  },
];

export const COLLAPSIBLE_CAMPFIRE_NAV_LINKS = [
  {
    key: "campfire",
    title: "Campfire",
    url: "#",
    icon: Flame,
    isActive: true,
    isBeta: true,
    items: [
      {
        key: "createCampfire",
        title: "Create Campfire",
        onClick: () => {},
        icon: Plus,
        isNew: false,
        isBeta: false,
      },
      {
        key: "manageCampfire",
        title: "Manage Campfires",
        url: `/user/x/campfires`,
        icon: Cog,
        isNew: false,
        isBeta: false,
      },
      {
        key: "discoverCampfires",
        title: "Discover Campfires",
        url: "/campfires/discovery",
        icon: Search,
        isNew: false,
        isBeta: false,
      },
    ],
  },
];

export const COLLAPSIBLE_HEALTH_SPACE_NAV_LINKS = [
  {
    key: "healthSpace",
    title: "Health Space",
    url: "#",
    icon: HandHelping,
    isActive: true,
    items: [
      {
        key: "healthTips",
        title: "Health Tips",
        url: "/health-tips",
        icon: HeartPulse,
        isNew: true,
        isBeta: false,
      },
      {
        key: "glimpse",
        title: "Glimpse",
        url: "/glimpse",
        icon: TvMinimalPlay,
        isNew: true,
        isBeta: false,
      },
    ],
  },
];
