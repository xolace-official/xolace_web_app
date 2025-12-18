import { IconBookmark, IconMessageCircle } from "@tabler/icons-react";
import { CheckCircleIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type * as React from "react";
import { Pill, PillIcon } from "@/components/kibo-ui/pill";
import { Demo } from "@/components/shared/entity-actions-menu/demo";
import {
  PostMetrics,
  PostMetricsAction,
  PostMetricsVote,
  type PostMetricsVoteState,
} from "@/components/shared/post-metrics";
import {
  MinimalCard,
  MinimalCardContent,
  MinimalCardFooter,
  MinimalCardTitle,
} from "@/components/ui/minimal-card";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/utils";
import { PostCardMedia } from "./components/post-card-media";

export type PostCardMediaType = {
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
  media?: PostCardMediaType[];
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
  onShareClick: _onShareClick,
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

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
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

              <div className="flex items-center gap-1">
                <Pill
                  variant="default"
                  className="py-0 px-1 text-[10px] text-foreground"
                >
                  camper🔥
                </Pill>

                <Pill
                  variant="default"
                  className="py-0 px-1 text-[10px] text-accent-foreground bg-accent"
                >
                  {/* <PillStatus>
                    <CheckCircleIcon className="text-emerald-500" size={10} />
                    professional
                  </PillStatus> */}
                  <PillIcon icon={CheckCircleIcon} size={10} />
                  professional
                </Pill>

                <Pill
                  variant="default"
                  className="py-0 px-1 text-[10px] text-black bg-chart-3"
                >
                  verified
                </Pill>

                <Pill
                  variant="default"
                  className="py-0 px-1 text-[10px] text-black bg-chart-5"
                >
                  mentor
                </Pill>
              </div>
            </div>
          </div>
        </div>

        {/* <Button
          variant="ghost"
          size="iconSm"
          className="rounded-full text-muted-foreground"
          tooltip="More"
        >
          <IconDots className="size-5" />
        </Button> */}
        <Demo />
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
