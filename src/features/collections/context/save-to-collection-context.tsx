"use client";

import * as React from "react";
import type { CollectionEntityType } from "../collections.types";

// ============================================================================
// Types
// ============================================================================

interface SaveTarget {
  entityType: CollectionEntityType;
  entityId: string;
}

interface SaveToCollectionContextValue {
  /** Current entity being saved */
  target: SaveTarget | null;
  /** Whether the drawer is open */
  isOpen: boolean;
  /** Open the save drawer for an entity */
  openSaveDrawer: (entityType: CollectionEntityType, entityId: string) => void;
  /** Close the save drawer */
  closeSaveDrawer: () => void;
}

// ============================================================================
// Context
// ============================================================================

const SaveToCollectionContext =
  React.createContext<SaveToCollectionContextValue | null>(null);

// ============================================================================
// Hook
// ============================================================================

export function useSaveToCollection() {
  const context = React.useContext(SaveToCollectionContext);

  if (!context) {
    throw new Error(
      "useSaveToCollection must be used within a SaveToCollectionProvider",
    );
  }

  return context;
}

// ============================================================================
// Provider
// ============================================================================

interface SaveToCollectionProviderProps {
  children: React.ReactNode;
}

export function SaveToCollectionProvider({
  children,
}: SaveToCollectionProviderProps) {
  const [target, setTarget] = React.useState<SaveTarget | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);

  const openSaveDrawer = React.useCallback(
    (entityType: CollectionEntityType, entityId: string) => {
      setTarget({ entityType, entityId });
      setIsOpen(true);
    },
    [],
  );

  const closeSaveDrawer = React.useCallback(() => {
    setIsOpen(false);
    // Delay clearing target to allow close animation
    setTimeout(() => {
      setTarget(null);
    }, 300);
  }, []);

  const value = React.useMemo<SaveToCollectionContextValue>(
    () => ({
      target,
      isOpen,
      openSaveDrawer,
      closeSaveDrawer,
    }),
    [target, isOpen, openSaveDrawer, closeSaveDrawer],
  );

  return (
    <SaveToCollectionContext.Provider value={value}>
      {children}
    </SaveToCollectionContext.Provider>
  );
}
