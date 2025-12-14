import type { Metadata } from "next";
import { GlimpsePage } from "./glimpse-page";

export const metadata: Metadata = {
  title: "Glimpse",
  description:
    "Mentor-led video reflections offering perspective, support, and guidance.",
};

const Glimpse = () => {
  return <GlimpsePage />;
};

export default Glimpse;
