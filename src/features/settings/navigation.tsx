import {
  BrainIcon,
  Cuboid,
  ImageIcon,
  PaletteIcon,
  TagIcon,
  UserIcon,
} from "lucide-react";

export const settingsNavigation = [
  {
    pathname: "/settings",
    label: "Account",
    icon: <UserIcon size={8} />,
  },
  {
    pathname: "/settings/config",
    label: "Config",
    icon: <BrainIcon size={8} />,
  },
  {
    pathname: "/settings/theme",
    label: "Theme",
    icon: <PaletteIcon size={8} />,
  },
  {
    pathname: "/settings/tags",
    label: "Tags",
    icon: <TagIcon size={8} />,
  },
  {
    pathname: "/settings/assets",
    label: "Assets",
    icon: <ImageIcon size={8} />,
  },
  {
    pathname: "/settings/data",
    label: "Data",
    icon: <Cuboid size={8} />,
  },
];
