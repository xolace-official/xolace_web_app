"use client";
import type React from "react";
import { createContext, type ReactNode, useContext, useState } from "react";
import type { RealmKey } from "@/features/campfires";

interface DiscoveryContextType {
  selectedRealm: RealmKey;
  setSelectedRealm: (key: RealmKey) => void;
  selectedLane: string | null;
  setSelectedLane: (lane: string | null) => void;
}

const DiscoveryContext = createContext<DiscoveryContextType | undefined>(
  undefined,
);

export const DiscoveryProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedRealm, setSelectedRealm] = useState<RealmKey>("all");
  const [selectedLane, setSelectedLane] = useState<string | null>(null);

  return (
    <DiscoveryContext.Provider
      value={{
        selectedRealm,
        setSelectedRealm,
        selectedLane,
        setSelectedLane,
      }}
    >
      {children}
    </DiscoveryContext.Provider>
  );
};

export const useDiscovery = () => {
  const context = useContext(DiscoveryContext);
  if (!context) {
    throw new Error("useDiscovery must be used within DiscoveryProvider");
  }
  return context;
};
