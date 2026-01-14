"use client";

import { GlimpseInterface } from "@/features/health-space/glimpse/index";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatNumber, formatRelativeTime } from "@/utils";
import VideoPlayer from "@/features/health-space/glimpse/video-player";
import {
  PostMetrics,
  PostMetricsAction,
  PostMetricsVote,
} from "@/components/shared/post-metrics";
import { IconBookmark } from "@tabler/icons-react";
import type * as React from "react";

export const GlimpseDetails = ({ glimpse }: { glimpse: GlimpseInterface }) => {
  return (
    <div className="flex flex-col w-full gap-1">
      <VideoPlayer videoId={glimpse.id} />

      <div className="">
        <h1 className="mb-2 text-lg font-semibold">{glimpse.title}</h1>
        <div className="flex w-full flex-col items-start justify-between gap-2 md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={glimpse.author_display_name || "/placeholder.svg"}
                alt={glimpse.author_display_name}
              />
              <AvatarFallback className="bg-muted">
                {glimpse.author_display_name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">
                {glimpse.author_display_name}
              </p>
            </div>
          </div>
          <div className="flex">
            <PostMetrics className="w-full flex flex-row gap-2 md:gap-4">
              <PostMetricsVote
                score={glimpse.likes_count}
                vote={"up"}
                onVoteChange={() => ""}
              />
              <PostMetricsAction
                icon={<IconBookmark className="size-4.5" />}
                label="Save"
                srLabel="Save"
                onClick={() => ""}
              />
            </PostMetrics>
          </div>
        </div>
        <div className="text-sm space-y-1 mt-2">
          <p className={"flex flex-row gap-2 text-muted-foreground"}>
            <span>Uploaded {formatRelativeTime(glimpse.published_at)}</span>
            <span>•</span>
            <span>{formatNumber(glimpse.views_count)} views</span>
          </p>
          {glimpse.description && (
            <p className="text-foreground mt-1 leading-relaxed">
              {glimpse.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
