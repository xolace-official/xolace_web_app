"use client";

import { SidebarInset } from "../ui/sidebar";

export const MainContainer = ({ children }: { children: React.ReactNode }) => {
  const sidebarVariant = "default";

  if (sidebarVariant !== "default") {
    return (
      <SidebarInset>
        <div className="lg:absolute lg:inset-0 isolate @container">
          {children}
        </div>
      </SidebarInset>
    );
  }

  return (
    <div className="relative flex flex-1 flex-col lg:overflow-hidden transition-all ease-in-out">
      <div className="lg:absolute lg:inset-0 isolate @container px-0 md:px-2">
        {children}
      </div>
    </div>
  );
};
