"use client";

import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { ModsNavMain } from "@/features/mods/layout/mods-main-nav";
import { DesktopSidebarToggler } from "@/components/app/desktop-sidebar-toggler";

export function ModsSidebarLeft({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const sidebarVariant: "default" | "inset" = "default";

  return (
    <Sidebar
      className="print:hidden top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      collapsible={"icon"}
      variant={sidebarVariant === "default" ? "sidebar" : sidebarVariant}
      {...props}
    >
      <SidebarHeader className="relative">
        <DesktopSidebarToggler />
      </SidebarHeader>

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
    </Sidebar>
  );
}
