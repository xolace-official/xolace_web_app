import { PageContainer } from "@/components/app/page-container";
import DummyCard from "@/components/extras/dummy-card";

export const FeedPage = () => {
  return (
    <PageContainer
      title="Fireside 🔥"
      contentClassName="max-sm:px-2"
      externalContent={
        <div className="space-y-4">
          <div className="bg-card border p-4 rounded-xl shadow-xs">
            <h3 className="font-semibold mb-2">Trending</h3>
            <div className="space-y-2">
              <div className="h-2 bg-muted rounded w-3/4" />
              <div className="h-2 bg-muted rounded w-1/2" />
            </div>
          </div>
          <div className="bg-card border p-4 rounded-xl shadow-xs h-64" />
        </div>
      }
    >
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
