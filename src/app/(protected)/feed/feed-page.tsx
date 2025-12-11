import { PageContainer } from "@/components/app/page-container";
import DummyCard from "@/components/extras/dummy-card";

export const FeedPage = () => {
  return (
    <PageContainer title="Fireside 🔥" contentClassName="max-sm:px-2">
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-3 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs">
        <DummyCard />
        <DummyCard />
        <DummyCard />
        <DummyCard />
        <DummyCard />
        <DummyCard />
        <DummyCard />
        <DummyCard />
        <DummyCard />
        <DummyCard />
        <DummyCard />
      </div>
    </PageContainer>
  );
};
