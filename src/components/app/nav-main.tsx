"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
// import LinkLoadingIndicator from './shared/loaders/LinkLoadingIndicator';
// import { NewBadge } from './shared/NewBadge';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { sidebarLinks } from "@/constants";

// const DotLottieReact = dynamic(
//   () => import('@lottiefiles/dotlottie-react').then(mod => mod.DotLottieReact),
//   {
//     ssr: false,
//     loading: () => (
//       <p className="h-3 w-3 animate-pulse rounded-full bg-gray-300 dark:bg-gray-600"></p>
//     ),
//   },
// );

interface SidebarLinkInterface {
  icon: LucideIcon;
  route: string;
  label: string;
  new?: boolean;
}

export function NavMain() {
  const pathName = usePathname();
  const { setOpenMobile } = useSidebar();
  return (
    <SidebarMenu className="gap-1 pt-5 md:gap-3">
      {sidebarLinks.map((item: SidebarLinkInterface) => {
        const isActive =
          (pathName.includes(item.route) && item.route.length > 1) ||
          pathName === item.route;

        return (
          <SidebarMenuItem key={item.label}>
            <SidebarMenuButton
              asChild
              isActive={isActive}
              onClick={() => setOpenMobile(false)}
              tooltip={item.label}
            >
              <Link
                href={item.route}
                key={item.label}
                className="relative flex items-center"
              >
                <item.icon />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
