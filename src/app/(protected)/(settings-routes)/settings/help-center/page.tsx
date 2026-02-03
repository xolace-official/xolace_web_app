import type { Metadata } from "next";
import { HelpCenterPage } from "./help-center-page";

export const metadata: Metadata = {
  title: "Help Center",
};

const HelpCenter = () => {
  return <HelpCenterPage />;
};

export default HelpCenter;
