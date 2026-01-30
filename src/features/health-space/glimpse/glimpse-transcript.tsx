"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import type { GlimpseInterface } from "@/features/health-space/glimpse/index";
import { formatDuration } from "@/utils";

interface GlimpseTranscriptProps {
  glimpse: GlimpseInterface;
}

export const GlimpseTranscript = ({ glimpse }: GlimpseTranscriptProps) => {
  const [activeTab, setActiveTab] = useState<"transcript" | "metadata">(
    "transcript",
  );

  return (
    <div className=" rounded-lg">
      <div className="pt-4 pb-10 lg:p-6">
        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value as "transcript" | "metadata")
          }
        >
          <TabsList className="grid w-full grid-cols-2 bg-muted">
            <TabsTrigger
              value="transcript"
              className="data-[state=active]:bg-card data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted data-[state=inactive]:text-muted-foreground"
            >
              Transcript
            </TabsTrigger>
            <TabsTrigger
              value="metadata"
              className="data-[state=active]:bg-card data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted data-[state=inactive]:text-muted-foreground"
            >
              Metadata
            </TabsTrigger>
          </TabsList>

          <TabsContent value="transcript" className="mt-6">
            <div className="space-y-4 px-4">
              <p className="text-muted-foreground">No transcript available.</p>
              {/* Uncomment when transcript data is available */}
              {/* {glimpse.transcript ? (
                <div className="text-foreground leading-relaxed space-y-2">
                  {glimpse.transcript.split("\n").map((line, index) => (
                    <p key={index} className="text-sm">
                      {line}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No transcript available.</p>
              )} */}
            </div>
          </TabsContent>

          <TabsContent value="metadata" className="mt-6 px-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="flex gap-x-2">
                  <p className="text-muted-foreground">Duration :</p>
                  <p className="ml-1 text-foreground font-semibold">
                    {formatDuration(glimpse.duration_seconds)}
                  </p>
                </div>

                <div className="flex gap-x-2">
                  <p className="text-muted-foreground">Upload Date :</p>
                  <p className="text-foreground font-semibold">
                    {glimpse.published_at
                      ? new Date(glimpse.published_at).toLocaleDateString()
                      : "Not published"}
                  </p>
                </div>

                <div className="flex gap-x-2">
                  <p className="text-muted-foreground">Views :</p>
                  <p className="ml-1 text-foreground font-semibold">
                    {glimpse.views_count.toLocaleString()}
                  </p>
                </div>

                <div className="flex gap-x-2">
                  <p className="text-muted-foreground">Likes :</p>
                  <p className="ml-1 text-foreground font-semibold">
                    {glimpse.likes_count.toLocaleString()}
                  </p>
                </div>

                <div className="flex gap-x-2">
                  <p className="text-muted-foreground">Author :</p>
                  <p className="ml-1 text-foreground font-semibold">
                    {glimpse.author_display_name}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
