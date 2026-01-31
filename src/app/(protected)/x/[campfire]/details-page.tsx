import { notFound } from "next/navigation";
import { PageContainer } from "@/components/app/page-container";
import { ThemeSwitcher } from "@/components/shared/theme-switcher";
import { dummy_campfires } from "@/features/campfires";
import { CampfireDetails } from "@/features/campfires/campfire-details/campfire-details";

const DetailsPage = ({ campfireId }: { campfireId: string }) => {
  const campfire = dummy_campfires.find((c) => c.slug === campfireId);

  if (!campfire) {
    notFound();
  }

  return (
    <PageContainer
      title={`${campfire.name}`}
      actions={<ThemeSwitcher key={"theme-switcher"} />}
      className={"w-full"}
      containerClassName={"w-full flex-1"}
      contentClassName={"w-full max-w-none flex flex-col"}
    >
      <div className={"px-0 lg:px-8"}>
        <CampfireDetails campfire={campfire} />
      </div>
    </PageContainer>
  );
};
export default DetailsPage;
