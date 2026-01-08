import { DISCOVERY_DUMMY } from "@/features/campfires/discovery/index";
import { DiscoveryCard } from "@/features/campfires/discovery/discovery-card";
import { DiscoveryFiltering } from "@/features/campfires/discovery/discovery-filtering";

export const CampfireDiscoveryList = () => {
  return (
    <div className={"grid grid-cols-1 items-start gap-4"}>
      <DiscoveryFiltering />
      <div
        className={
          "grid grid-cols-1 items-center  md:grid md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8"
        }
      >
        {DISCOVERY_DUMMY.map((discovery) => (
          <DiscoveryCard key={discovery.id} discovery={discovery} />
        ))}
      </div>
    </div>
  );
};
