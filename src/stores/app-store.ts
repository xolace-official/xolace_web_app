import type { Session } from "@supabase/supabase-js";
import { createStore } from "zustand";
import type {
  GetApiV1AuthPreferences200,
  GetApiV1AuthProfileMe200,
} from "@/api-client";

export interface AppState {
  // Data
  session: Session;
  profile: GetApiV1AuthProfileMe200;
  preferences: GetApiV1AuthPreferences200;

  // Actions
  updateProfile: (profile: Partial<GetApiV1AuthProfileMe200>) => void;
  updatePreferences: (prefs: Partial<GetApiV1AuthPreferences200>) => void;
}

export type AppStore = ReturnType<typeof createAppStore>;

export const createAppStore = (
  initialState: Pick<AppState, "session" | "profile" | "preferences">,
) => {
  return createStore<AppState>((set) => ({
    ...initialState,
    updateProfile: (profile) => {
      set((state) => ({ profile: { ...state.profile, ...profile } }));
    },
    updatePreferences: (prefs) => {
      set((state) => ({
        preferences: { ...state.preferences, ...prefs },
      }));
    },
  }));
};
