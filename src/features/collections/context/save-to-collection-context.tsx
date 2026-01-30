"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
  createContext<SaveToCollectionContextValue | null>(null);

// ============================================================================
// Hook
// ============================================================================

export function useSaveToCollection() {
  const context = useContext(SaveToCollectionContext);

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
  children: ReactNode;
}

export function SaveToCollectionProvider({
  children,
}: SaveToCollectionProviderProps) {
  const [target, setTarget] = useState<SaveTarget | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const clearTargetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const openSaveDrawer = useCallback(
    (entityType: CollectionEntityType, entityId: string) => {
      if (clearTargetTimeoutRef.current) {
        clearTimeout(clearTargetTimeoutRef.current);
        clearTargetTimeoutRef.current = null;
      }
      setTarget({ entityType, entityId });
      setIsOpen(true);
    },
    [],
  );

  const closeSaveDrawer = useCallback(() => {
    setIsOpen(false);
    // Delay clearing target to allow close animation
    clearTargetTimeoutRef.current = setTimeout(() => {
      setTarget(null);
      clearTargetTimeoutRef.current = null;
    }, 300);
  }, []);

  useEffect(() => {
    return () => {
      if (clearTargetTimeoutRef.current) {
        clearTimeout(clearTargetTimeoutRef.current);
      }
    };
  }, []);

  const value = useMemo<SaveToCollectionContextValue>(
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
