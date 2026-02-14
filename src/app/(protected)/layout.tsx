import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AppSidebar } from "@/components/app/app-sidebar";
import { MainContainer } from "@/components/app/main-container";
import { PrimaryFullPageLoading } from "@/components/routes/primary-loading";
import { SidebarProvider } from "@/components/ui/sidebar";
import {
  SaveToCollectionDrawer,
  SaveToCollectionProvider,
} from "@/features/collections";
import { createClient } from "@/lib/supabase/server";
import { AppStoreProvider } from "@/providers/app-store-provider";
import { QueryProvider } from "@/providers/query-provider";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<PrimaryFullPageLoading />}>
      <AuthGatedContent>{children}</AuthGatedContent>
    </Suspense>
  );
}

async function AuthGatedContent({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return redirect("/auth/sign-in");
  }

  return (
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
  );
}
