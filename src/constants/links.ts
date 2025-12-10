import {
  Bomb,
  FlameKindling,
  LibraryBig,
  Mailbox,
  MessageSquareDiff,
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
