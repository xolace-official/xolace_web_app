import type { Metadata } from "next";
import { DiscoveryPage } from "./discovery-page";

export const metadata: Metadata = {
  title: "Campfires",
  description:
    "Join purpose-driven Campfires on Xolace—safe, focused spaces where members share stories, support one another, and grow together through shared challenges, goals, and creativity.",
};

const Discovery = () => {
  return <DiscoveryPage />;
};

export default Discovery;
