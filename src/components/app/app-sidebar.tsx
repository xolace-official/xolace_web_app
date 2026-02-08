"use client";

import {
  ArrowUpNarrowWide,
  ChevronLeft,
  CommandIcon,
  GemIcon,
  PenIcon,
  ShrubIcon,
  SignalIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  COLLAPSIBLE_CAMPFIRE_NAV_LINKS,
  COLLAPSIBLE_HEALTH_SPACE_NAV_LINKS,
  DEFAULT_PROFILE_IMAGE,
} from "@/constants";
import { settingsNavigation } from "@/features/settings/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separators } from "../ui/separators";
import { CollapsibleNav } from "./collapsible-nav";
import { DesktopSidebarToggler } from "./desktop-sidebar-toggler";
import { NavMain } from "./nav-main";
import { ModsSidebarLeft } from "@/features/mods/layout/mod-siderbar-left";
import React, { useState } from "react";
import CreateCampfireModal from "@/features/campfires/creation/create-campfire-modal";

/**
 * Render the application's main sidebar containing navigation, settings, and user controls.
 *
 * Displays one of three content modes based on the current route:
 * - Settings view when the pathname starts with "/settings"
 * - Moderation view when the pathname matches the mod route pattern
 * - Default navigation otherwise
 *
 * The sidebar includes header controls, collapsible navigation sections, and a footer user menu with settings and logout actions.
 *
 * @returns A React element representing the application's sidebar UI
 */
export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [createCampfireModal, setCreateCampfireModal] =
    useState<boolean>(false);

  const sidebarVariant: "default" | "inset" = "default";
  //const search = true;

  const modPathRegex = /^\/c\/[^\/]+\/mod/;
  const isModPath = modPathRegex.test(pathname);

  return (
    <>
      <Sidebar
        className="print:hidden"
        collapsible={"icon"}
        variant={sidebarVariant === "default" ? "sidebar" : sidebarVariant}
      >
        <SidebarHeader className="relative">
          <DesktopSidebarToggler />
          <div className="flex items-center gap-2 text-primary">
            <div className="h-8 w-8 flex items-center justify-center shrink-0">
              <PenIcon className="h-5 w-5" />
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          {pathname.startsWith("/settings") ? (
            <>
              <SidebarGroup className="mt-2">
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton tooltip="Back to app" asChild>
                        <Link href="/feed">
                          <ChevronLeft size={16} />
                          <span>Back to app</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              <SidebarGroup>
                <SidebarGroupLabel>Settings</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {settingsNavigation.map((link) => (
                      <SidebarMenuItem key={link.pathname}>
                        <SidebarMenuButton
                          tooltip={link.label}
                          isActive={pathname === link.pathname}
                          asChild
                        >
                          <Link href={link.pathname}>
                            {link.icon}
                            <span>{link.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </>
          ) : isModPath ? (
            <>
              <SidebarGroup>
                <SidebarContent>
                  <ModsSidebarLeft />
                </SidebarContent>
              </SidebarGroup>
            </>
          ) : (
            <>
              <SidebarGroup>
                <NavMain />
              </SidebarGroup>

              <Separators />
              <CollapsibleNav
                items={COLLAPSIBLE_CAMPFIRE_NAV_LINKS}
                onOpenCreateModal={() => setCreateCampfireModal(true)}
              />

              <Separators />
              <CollapsibleNav items={COLLAPSIBLE_HEALTH_SPACE_NAV_LINKS} />
            </>
          )}
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={DEFAULT_PROFILE_IMAGE}
                        alt="profile image"
                      />
                      <AvatarFallback className="rounded-lg">
                        "User"
                      </AvatarFallback>
                    </Avatar>

                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{"User"}</span>

                      <span className="truncate text-xs">
                        Open Source Edition
                      </span>
                    </div>

                    <ArrowUpNarrowWide className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium opacity-90">
                          {"email"}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => {}}>
                      <CommandIcon />
                      Open Commands
                      <span className="ml-auto">
                        <ShrubIcon />
                      </span>
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => router.push("/settings")}>
                      <GemIcon />
                      Settings
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={async () => {
                      // const res = await signOutAction();
                      // if (res.success) {
                      // 	// we don't want to use router because we want a full page navigation
                      // 	window.open("/sign-in", "_self");
                      // }
                    }}
                  >
                    <SignalIcon />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>
      {createCampfireModal && (
        <CreateCampfireModal
          open={createCampfireModal}
          onOpenChange={setCreateCampfireModal}
        />
      )}
    </>
  );
}

export function SidebarToggle() {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      tooltip="Toggle Sidebar"
      variant="ghost"
      size="iconSm"
      onClick={toggleSidebar}
      className=" sm:hidden "
    >
      <ChevronLeft size={16} />
    </Button>
  );
}
