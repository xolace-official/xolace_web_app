"use client";

import { SidebarInset } from "../ui/sidebar";

export const MainContainer = ({ children }: { children: React.ReactNode }) => {
  const sidebarVariant = "default";

  if (sidebarVariant !== "default") {
    return (
      <SidebarInset>
        <div className="absolute inset-0 isolate @container">{children}</div>
      </SidebarInset>
    );
  }

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden transition-all ease-in-out">
      <div className="absolute inset-0 isolate @container">{children}</div>
    </div>
  );
};
