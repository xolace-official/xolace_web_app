import { PageContainer } from "@/components/app/page-container";
import { ThemeSwitcher } from "@/components/shared/theme-switcher";
import { PageHeading } from "@/components/shared/layout/page-heading";
import { GlimpseDetails } from "@/features/health-space/glimpse/glimpse-details";
import { notFound } from "next/navigation";
import { dummyGlimpses } from "@/features/health-space/glimpse";
import { GlimpseTranscript } from "@/features/health-space/glimpse/glimpse-transcript";

export const GlimpseVideo = ({ videoId }: { videoId: string }) => {
  const video = dummyGlimpses.data.find((video) => video.id === videoId);

  if (!video) {
    notFound();
  }

  return (
    <PageContainer
      title={video.title}
      actions={<ThemeSwitcher key={"theme-switcher"} />}
      externalContent={<GlimpseTranscript />}
    >
      <PageHeading className="px-2 md:px-0" />
      <div className="flex flex-col gap-4 px-2 md:px-0">
        <GlimpseDetails glimpse={video} />
      </div>
    </PageContainer>
  );
};
