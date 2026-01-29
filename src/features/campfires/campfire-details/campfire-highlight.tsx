"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Pin, ChevronUp, ChevronDown } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { CampfireInterface } from "@/features/campfires";
import { FeedList } from "@/features/feed/feed-list";

export const CampfireHighlight = ({
  campfire,
}: {
  campfire: CampfireInterface;
}) => {
  const [showHighlight, setShowHighlight] = React.useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full flex flex-col gap-1 items-center">
        <Button
          variant="ghost"
          size={"sm"}
          className={"rounded-full w-full items-center justify-between"}
          onClick={() => setShowHighlight(!showHighlight)}
        >
          <span className={"text-xs flex flex-row gap-1"}>
            <span className={"rotate-45"}>
              <Pin size={16} />
            </span>
            Community highlights
          </span>
          {showHighlight ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </Button>
        <div className={"flex flex-col items-center gap-2 w-full"}>
          {showHighlight && (
            <div className="border w-full h-16 rounded-lg text-sm px-4 flex items-center justify-center">
              <span className="text-center">Highlights coming soon...</span>
            </div>
          )}
          <Separator className="border" />
          {/*Hard coded feed list for testing*/}
          <FeedList />
        </div>
      </div>
    </div>
  );
};
