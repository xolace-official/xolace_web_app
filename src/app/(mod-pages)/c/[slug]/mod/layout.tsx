import React, { Suspense } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import type { Metadata } from "next";
import { ModsSidebarLeft } from "@/features/mods/layout/mod-siderbar-left";
import { MainContainer } from "@/components/app/main-container";

export const metadata: Metadata = {
  title: {
    template: "%s • Mod Tools | Xolace",
    default: "Mod Tools | Xolace",
  },
  description: "Mod tools for your campfire",
};

interface ModLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function ModLayout({ children, params }: ModLayoutProps) {
  const { slug } = await params;
  // const supabase = await createClient();
  //
  // // Check authentication
  // const supabase_user_id: string | null =
  //   (await supabase.auth.getClaims()).data?.claims?.sub ?? null;
  //
  // if (!supabase_user_id) {
  //   redirect('/sign-in');
  // }
  //
  // // Get user profile
  // const { data: profileUser } = await supabase
  //   .from('profiles')
  //   .select('*')
  //   .eq('supabase_user', supabase_user_id)
  //   .single();
  //
  // if (!profileUser) {
  //   redirect('/sign-in');
  // }
  //
  // // Check moderator access
  // const accessCheck = await checkModeratorAccess(slug, profileUser.id);
  //
  // // If no access, show access denied page
  // if (!accessCheck.hasAccess) {
  //   return (
  //     <div className="[--header-height:calc(--spacing(14))]">
  //       <SidebarProvider
  //         className="flex flex-col"
  //         style={{ '--header-height': '60px' } as React.CSSProperties}
  //       >
  //         <SiteHeader />
  //         <div className="flex flex-1">
  //           <SidebarInset>
  //             <ModAccessDenied error={accessCheck.error} slug={slug} />
  //             <Bottombar />
  //           </SidebarInset>
  //         </div>
  //         <InitUser user={profileUser} />
  //       </SidebarProvider>
  //     </div>
  //   );
  // }

  // User has access, render mod layout
  return (
    <div className="bg-background tracking-normal">
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
          } as React.CSSProperties
        }
      >
        <Suspense
          fallback={<div className="text-sm animate-pulse">Loading ...</div>}
        >
          <ModsSidebarLeft />
        </Suspense>
        <MainContainer>{children}</MainContainer>
      </SidebarProvider>
    </div>
  );
}
