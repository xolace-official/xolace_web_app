import { LegalFooter } from "@/components/shared/legal-footer";

export const RightSideContent = () => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-(--spacing(32)))]">
      <div className="space-y-4">
        <div className="bg-card border p-4 rounded-xl shadow-xs">
          <h3 className="font-semibold mb-2">Trending</h3>
          <div className="space-y-2">
            <div className="h-2 bg-muted rounded w-3/4" />
            <div className="h-2 bg-muted rounded w-1/2" />
          </div>
        </div>
        <div className="bg-card border p-4 rounded-xl shadow-xs h-64" />
        <div className="bg-card border p-4 rounded-xl shadow-xs h-64" />
      </div>

      <LegalFooter className="mt-8" />
    </div>
  );
};
