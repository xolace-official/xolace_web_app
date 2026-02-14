import Head from "next/head";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AppSidebar } from "@/components/app/app-sidebar";
import { MainContainer } from "@/components/app/main-container";
import { SidebarProvider } from "@/components/ui/sidebar";
import {
  SaveToCollectionDrawer,
  SaveToCollectionProvider,
} from "@/features/collections";
import { createClient } from "@/lib/supabase/server";
import { AppStoreProvider } from "@/providers/app-store-provider";
import { QueryProvider } from "@/providers/query-provider";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return redirect("/auth/login");
  }

  return (
    <Suspense>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Noto+Sans:ital,wght@0,100..900;1,100..900&family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <QueryProvider>
        <AppStoreProvider initialState={{ session }}>
          <SaveToCollectionProvider>
            <div className="bg-background tracking-normal">
              <SidebarProvider
                style={
                  {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                  } as React.CSSProperties
                }
              >
                <AppSidebar />
                <MainContainer>{children}</MainContainer>
              </SidebarProvider>
            </div>
            <SaveToCollectionDrawer />
          </SaveToCollectionProvider>
        </AppStoreProvider>
      </QueryProvider>
    </Suspense>
  );
}
