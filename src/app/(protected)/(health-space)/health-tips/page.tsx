import type { Metadata } from "next";
import { HealthTipsPage } from "./health-tips-page";

export const metadata: Metadata = {
  title: "Health Tips",
  description:
    "Discover daily health tips and expert-backed advice to boost your wellness, fitness, and mental health—trusted by millions worldwide.",
};

const HealthTips = () => {
  return <HealthTipsPage />;
};

export default HealthTips;
