import Head from "next/head";
import { Suspense } from "react";
import { AppSidebar } from "@/components/app/app-sidebar";
import { MainContainer } from "@/components/app/main-container";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryProvider } from "@/providers/query-provider";
import {
  SaveToCollectionProvider,
  SaveToCollectionDrawer,
} from "@/features/collections";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

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
      </QueryProvider>
    </Suspense>
  );
}
