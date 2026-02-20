import { DiscoveryFiltering } from "@/features/campfires/discovery/discovery-filtering";
import { CampfireGrid } from "./campfire-grid";

export const CampfireDiscoveryList = () => {
  return (
    <div className={"w-full grid grid-cols-1 items-start gap-4"}>
      <DiscoveryFiltering />
      <CampfireGrid />
    </div>
  );
};
