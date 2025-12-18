import { IconBookmark, IconDots, IconMessageCircle } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import type * as React from "react";

import {
  PostMetrics,
  PostMetricsAction,
  PostMetricsVote,
  type PostMetricsVoteState,
} from "@/components/shared/post-metrics";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  MinimalCard,
  MinimalCardContent,
  MinimalCardFooter,
  MinimalCardTitle,
} from "@/components/ui/minimal-card";
import { cn } from "@/lib/utils";

type PostCardMedia = {
  src: string;
  alt: string;
};

type PostCardCommunity = {
  name: string;
  href?: string;
  iconSrc?: string;
};

export type PostCardProps = {
  title: string;
  community?: PostCardCommunity;
  createdAt?: Date | string | number;
  createdAtLabel?: string;
  media?: PostCardMedia[];
  metrics?: {
    score: number;
    comments: number;
    shares?: number;
  };
  vote?: PostMetricsVoteState;
  onVoteChange?: (nextVote: PostMetricsVoteState) => void;
  onCommentsClick?: () => void;
  onShareClick?: () => void;
  onSaveClick?: () => void;
  footer?: React.ReactNode;
  className?: string;
};

function toDate(input: Date | string | number) {
  const date = input instanceof Date ? input : new Date(input);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatRelativeTime(input: Date | string | number) {
  const date = toDate(input);
  if (!date) return "";

  const deltaSeconds = Math.round((date.getTime() - Date.now()) / 1000);
  const abs = Math.abs(deltaSeconds);

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (abs < 60) return rtf.format(deltaSeconds, "second");
  const minutes = Math.round(deltaSeconds / 60);
  if (Math.abs(minutes) < 60) return rtf.format(minutes, "minute");
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return rtf.format(hours, "hour");
  const days = Math.round(hours / 24);
  if (Math.abs(days) < 7) return rtf.format(days, "day");
  const weeks = Math.round(days / 7);
  if (Math.abs(weeks) < 5) return rtf.format(weeks, "week");
  const months = Math.round(days / 30);
  if (Math.abs(months) < 12) return rtf.format(months, "month");
  const years = Math.round(days / 365);
  return rtf.format(years, "year");
}

function PostCardMedia({ media }: { media: PostCardMedia[] }) {
  if (media.length === 0) return null;

  if (media.length === 1) {
    const item = media[0];
    return (
      <div className="relative mt-4 overflow-hidden rounded-[20px] bg-muted">
        <div className="relative aspect-[16/10] w-full">
          <Image
            src={item.src}
            alt={item.alt}
            fill
            sizes="(min-width: 768px) 640px, 100vw"
            className="object-contain"
            priority={false}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <Carousel className="relative">
        <CarouselContent className="ml-0">
          {media.map((item) => (
            <CarouselItem key={item.src} className="pl-0">
              <div className="relative overflow-hidden rounded-[20px] bg-muted">
                <div className="relative aspect-[16/10] w-full">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(min-width: 768px) 640px, 100vw"
                    className="object-cover"
                    priority={false}
                  />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 top-1/2 -translate-y-1/2 bg-background/70 backdrop-blur" />
        <CarouselNext className="right-2 top-1/2 -translate-y-1/2 bg-background/70 backdrop-blur" />
      </Carousel>
    </div>
  );
}

export function PostCard({
  title,
  community,
  createdAt,
  createdAtLabel,
  media = [],
  metrics,
  vote,
  onVoteChange,
  onCommentsClick,
  onShareClick,
  onSaveClick,
  footer,
  className,
}: PostCardProps) {
  const renderedCreatedAtLabel =
    createdAtLabel ?? (createdAt ? formatRelativeTime(createdAt) : "");

  return (
    <MinimalCard className={cn("p-3 sm:p-4 bg-card! shadow-md!", className)}>
      <div className="flex items-start justify-between gap-3 px-1">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {community?.iconSrc ? (
              <span className="relative size-6 overflow-hidden rounded-full bg-muted">
                <Image
                  src={community.iconSrc}
                  alt=""
                  fill
                  sizes="24px"
                  className="object-cover"
                />
              </span>
            ) : null}

            {community?.href ? (
              <Link
                href={community.href}
                className="truncate font-semibold text-foreground hover:underline"
              >
                {community.name}
              </Link>
            ) : community?.name ? (
              <span className="truncate font-semibold text-foreground">
                {community.name}
              </span>
            ) : null}

            {renderedCreatedAtLabel ? (
              <>
                <span aria-hidden="true">·</span>
                <time className="truncate">{renderedCreatedAtLabel}</time>
              </>
            ) : null}
          </div>
        </div>

        <Button
          variant="ghost"
          size="iconSm"
          className="rounded-full text-muted-foreground"
          tooltip="More"
        >
          <IconDots className="size-5" />
        </Button>
      </div>

      <MinimalCardContent className="px-1 pb-2 pt-3">
        <MinimalCardTitle className="mt-0 px-1 text-xl leading-snug sm:text-2xl">
          {title}
        </MinimalCardTitle>

        <PostCardMedia media={media} />
      </MinimalCardContent>

      <MinimalCardFooter className="flex flex-wrap gap-2 px-1 pb-1 pt-0">
        {footer ?? (
          <PostMetrics className="w-full">
            {metrics ? (
              <PostMetricsVote
                score={metrics.score}
                vote={vote}
                onVoteChange={onVoteChange}
              />
            ) : null}

            {metrics ? (
              <PostMetricsAction
                icon={<IconMessageCircle className="size-4.5" />}
                count={metrics.comments}
                srLabel="Comments"
                onClick={onCommentsClick}
                // disabled={!onCommentsClick}
              />
            ) : null}

            {/* <PostMetricsAction
              icon={<IconShare3 className="size-4.5" />}
              label="Share"
              srLabel="Share"
              onClick={onShareClick}
              disabled={!onShareClick}
            /> */}

            <PostMetricsAction
              icon={<IconBookmark className="size-4.5" />}
              label="Save"
              srLabel="Save"
              onClick={onSaveClick}
              //   disabled={!onSaveClick}
            />
          </PostMetrics>
        )}
      </MinimalCardFooter>
    </MinimalCard>
  );
}

export default PostCard;
