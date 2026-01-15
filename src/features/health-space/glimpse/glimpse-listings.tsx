"use client";
import { GlimpseCard } from "@/features/health-space/glimpse/glimpse-card";
import { dummyGlimpses } from ".";
import { useGlimpseFiltersServer } from "@/features/health-space/glimpse/glimpse-filter";
import { useTransition } from "react";
import { debounce } from "nuqs";
import { EmptyContent } from "@/components/app/empty-content";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const GlimpseListings = () => {
  const [{ query }, setSearchParams] = useGlimpseFiltersServer({
    limitUrlUpdates: debounce(250),
    shallow: false,
  });
  const [isPending, startTransition] = useTransition();

  let filteredData = dummyGlimpses.data;

  filteredData = filteredData.filter((item) => {
    return (
      !query ||
      item.title?.toLowerCase().includes(query.toLowerCase()) ||
      item.description?.toLowerCase().includes(query.toLowerCase()) ||
      item.author_display_name?.toString().includes(query.toLowerCase()) ||
      item.tags?.toString().includes(query.toLowerCase())
    );
  });

  // Handler for resetting input filtering to default
  const handleResetFiltering = () => {
    startTransition(async () => {
      await setSearchParams({
        query: "",
        tab: "",
      });
    });
  };

  //Handle save video to
  const handleSaveVideo = (videoId: string) => {
    toast.success("Video saved!");
    console.log("Save video:", videoId);
  };

  // Handler for sharing video
  const handleShareVideo = (videoId: string) => {
    toast.success("Share options opened!");
    console.log("Share video:", videoId);
  };

  // Helper for reporting a video
  const handleReportVideo = (videoId: string) => {
    toast.success("Report submitted!");
    console.log("Report video:", videoId);
  };

  // Handler for copy to clipboard
  const handleCopyLink = (videoId: string) => {
    navigator.clipboard
      .writeText(`${window.location.origin}/glimpse/${videoId}`)
      .then(() => {
        toast.success("Link copied to clipboard");
      })
      .catch(() => {
        toast.error("Failed to copy link");
      });
  };

  return (
    <div className={"w-full grid grid-cols-1 items-start gap-4"}>
      {filteredData.length > 0 ? (
        <div
          className={
            "grid grid-cols-1 items-center md:grid md:grid-cols-3 gap-4"
          }
        >
          {filteredData.map((glimpse) => (
            <GlimpseCard
              key={glimpse.id}
              glimpse={glimpse}
              onSave={handleSaveVideo}
              onShare={handleShareVideo}
              onReport={handleReportVideo}
              onCopy={(videoId) => handleCopyLink(videoId)}
            />
          ))}
        </div>
      ) : (
        <div className="col-span-1 md:col-span-3 lg:col-span-3 xl:col-span-4">
          <EmptyContent
            title={"No Glimpse Here Yet"}
            description={
              "We couldn't find any glimpse matching what you're looking for. Try adjusting your filters or explore different realms."
            }
            icon={<SearchX className="w-12 h-12 text-muted-foreground" />}
            actions={
              <div>
                <Button
                  onClick={handleResetFiltering}
                  disabled={isPending}
                  variant={"outlineDestructive"}
                >
                  {isPending ? "Resetting..." : "Reset Filters"}
                </Button>
              </div>
            }
          />
        </div>
      )}
    </div>
  );
};
