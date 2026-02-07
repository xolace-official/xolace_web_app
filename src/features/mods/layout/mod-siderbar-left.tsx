"use client";

import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { ModsNavMain } from "@/features/mods/layout/mods-main-nav";
import { DesktopSidebarToggler } from "@/components/app/desktop-sidebar-toggler";

/**
 * Render the left-side sidebar that contains the mods navigation.
 *
 * @param props - Additional props typed for the underlying `Sidebar`; these props are accepted by the component but are not forwarded to any child elements.
 * @returns The sidebar element containing the `ModsNavMain` navigation.
 */
export function ModsSidebarLeft({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <SidebarMenu>
      <SidebarContent>
        {/* <SidebarGroup className="mt-2">*/}
        {/*  <SidebarGroupContent>*/}
        {/*    <SidebarMenu>*/}
        {/*      <SidebarMenuItem>*/}
        {/*        <SidebarMenuButton tooltip="Back to app" onClick={() => ''}>*/}
        {/*          <ChevronLeft size={16} />*/}
        {/*          <span>Back to app</span>*/}
        {/*        </SidebarMenuButton>*/}
        {/*      </SidebarMenuItem>*/}
        {/*    </SidebarMenu>*/}
        {/*  </SidebarGroupContent>*/}
        {/*</SidebarGroup> **/}

        <ModsNavMain />
      </SidebarContent>
    </SidebarMenu>
  );
}