import type { Metadata } from "next";
import { PreferencesPage } from "./preferences-page";

export const metadata: Metadata = {
  title: "Preferences",
};

const Preferences = () => {
  return <PreferencesPage />;
};

export default Preferences;
