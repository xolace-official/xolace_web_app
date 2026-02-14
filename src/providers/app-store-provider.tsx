"use client";

import type { Session } from "@supabase/supabase-js";
import equal from "fast-deep-equal";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
} from "react";
import { useStore as useZustandStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import {
  type GetApiV1AuthPreferences200,
  type GetApiV1AuthProfileMe200,
  useGetApiV1AuthPreferences,
  useGetApiV1AuthProfileMe,
} from "@/api-client";
import { PrimaryFullPageLoading } from "@/components/routes/primary-loading";
import {
  type AppState,
  type AppStore,
  createAppStore,
} from "@/stores/app-store";

// ============================================================================
// Context
// ============================================================================

const AppStoreContext = createContext<AppStore | null>(null);

// ============================================================================
// Provider
// ============================================================================

interface AppStoreProviderProps {
  children: ReactNode;
  initialState: {
    session: Session;
  };
}

export function AppStoreProvider({
  children,
  initialState,
}: AppStoreProviderProps) {
  const storeRef = useRef<AppStore | null>(null);

  const profileQuery = useGetApiV1AuthProfileMe({
    fetch: {
      headers: {
        Authorization: `Bearer ${initialState.session.access_token}`,
      },
    },
  });

  const preferencesQuery = useGetApiV1AuthPreferences({
    fetch: {
      headers: {
        Authorization: `Bearer ${initialState.session.access_token}`,
      },
    },
  });

  const isLoading = profileQuery.isLoading || preferencesQuery.isLoading;
  const isError = profileQuery.isError || preferencesQuery.isError;

  // Extract success data from discriminated union responses
  const profileData =
    profileQuery.data?.status === 200
      ? (profileQuery.data.data as GetApiV1AuthProfileMe200)
      : undefined;
  const preferencesData =
    preferencesQuery.data?.status === 200
      ? (preferencesQuery.data.data as GetApiV1AuthPreferences200)
      : undefined;

  // Create or access store
  if (!storeRef.current && profileData && preferencesData) {
    storeRef.current = createAppStore({
      session: initialState.session,
      profile: profileData,
      preferences: preferencesData,
    });
  }

  // Sync React Query updates → Zustand
  useEffect(() => {
    if (!storeRef.current || !profileData) return;
    const store = storeRef.current;
    const currentProfile = store.getState().profile;

    if (!equal(currentProfile, profileData)) {
      store.getState().updateProfile(profileData);
    }
  }, [profileData]);

  useEffect(() => {
    if (!storeRef.current || !preferencesData) return;
    const store = storeRef.current;
    const currentPrefs = store.getState().preferences;

    if (!equal(currentPrefs, preferencesData)) {
      store.getState().updatePreferences(preferencesData);
    }
  }, [preferencesData]);

  if (isLoading || !storeRef.current) {
    return <PrimaryFullPageLoading />;
  }

  if (isError) {
    return <PrimaryFullPageLoading />;
  }

  return (
    <AppStoreContext.Provider value={storeRef.current}>
      {children}
    </AppStoreContext.Provider>
  );
}

// ============================================================================
// Hook
// ============================================================================

export function useAppStore<T>(selector: (store: AppState) => T): T {
  const ctx = useContext(AppStoreContext);
  if (!ctx) {
    throw new Error("useAppStore must be used within AppStoreProvider");
  }
  return useZustandStore(ctx, useShallow(selector));
}
