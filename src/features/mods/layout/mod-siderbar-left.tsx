"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ModsNavMain } from "@/features/mods/layout/mods-main-nav";

export function ModsSidebarLeft({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { toggleSidebar, open } = useSidebar();

  return (
    <>
      <Sidebar
        className="top-(--header-height) h-[calc(100svh-var(--header-height))]!  border-r-0"
        {...props}
      >
        <SidebarHeader className="relative px-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="bg-muted border absolute top-0 -right-5 hidden h-10 w-10 cursor-pointer items-center justify-center rounded-full border-r-[1px] border-b-[0px] md:flex"
                onClick={toggleSidebar}
              >
                {open ? (
                  <ChevronLeft className="size-5" />
                ) : (
                  <ChevronRight className="size-5" />
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" align="center" className="">
              <p>{open ? "Collapse Navigation" : "Expand Navigation"}</p>
            </TooltipContent>
          </Tooltip>
        </SidebarHeader>
        <SidebarContent className={""}>
          <ModsNavMain />
        </SidebarContent>
      </Sidebar>
    </>
  );
}
