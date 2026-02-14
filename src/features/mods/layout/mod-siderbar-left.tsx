"use client";

import { SidebarContent, SidebarMenu } from "@/components/ui/sidebar";
import { ModsNavMain } from "@/features/mods/layout/mods-main-nav";

/**
 * Render the left-side sidebar that contains the mods navigation.
 *
 * @returns The sidebar element containing the `ModsNavMain` navigation.
 */
export function ModsSidebarLeft() {
  return (
    <SidebarContent>
      <SidebarMenu>
        <ModsNavMain />
      </SidebarMenu>
    </SidebarContent>
  );
}
