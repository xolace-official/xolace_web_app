"use client";

import { Slot } from "@radix-ui/react-slot";
import { IconArrowBigDown, IconArrowBigUp } from "@tabler/icons-react";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

export type PostMetricsVoteState = "up" | "down" | null;

const compactNumberFormatter = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

function formatCompactNumber(value: number) {
  return compactNumberFormatter.format(value);
}

const pillVariants = cva(
  [
    "inline-flex items-center gap-2 whitespace-nowrap rounded-full border",
    "bg-background/50 text-foreground shadow-sm",
    "transition-colors",
    "hover:bg-muted/60",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
    "disabled:pointer-events-none disabled:opacity-60",
  ],
  {
    variants: {
      size: {
        sm: "h-8 px-2.5 text-xs",
        md: "h-9 px-3 text-sm",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export type PostMetricsProps = React.HTMLAttributes<HTMLDivElement>;

export function PostMetrics({ className, ...props }: PostMetricsProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export type PostMetricsActionProps = Omit<
  React.ComponentPropsWithoutRef<"button">,
  "children"
> &
  VariantProps<typeof pillVariants> & {
    asChild?: boolean;
    icon?: React.ReactNode;
    label?: React.ReactNode;
    count?: number;
    children?: React.ReactNode;
    srLabel?: string;
    formatCount?: (count: number) => string;
  };

export function PostMetricsAction({
  asChild,
  className,
  icon,
  label,
  count,
  children,
  srLabel,
  formatCount = formatCompactNumber,
  size,
  type = "button",
  ...props
}: PostMetricsActionProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(pillVariants({ size }), className)}
      type={asChild ? undefined : type}
      aria-label={srLabel}
      {...props}
    >
      {children ?? (
        <>
          {icon ? <span className="text-muted-foreground">{icon}</span> : null}
          {typeof count === "number" ? (
            <span className="tabular-nums font-medium">
              {formatCount(count)}
            </span>
          ) : null}
          {label ? (
            <span className="text-muted-foreground">{label}</span>
          ) : null}
        </>
      )}
    </Comp>
  );
}

export type PostMetricsVoteProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> &
  VariantProps<typeof pillVariants> & {
    score: number;
    vote?: PostMetricsVoteState;
    disabled?: boolean;
    onVoteChange?: (nextVote: PostMetricsVoteState) => void;
    formatScore?: (score: number) => React.ReactNode;
    upvoteLabel?: string;
    downvoteLabel?: string;
  };

export function PostMetricsVote({
  className,
  score,
  vote = null,
  disabled,
  onVoteChange,
  formatScore,
  upvoteLabel = "Upvote",
  downvoteLabel = "Downvote",
  size,
  ...props
}: PostMetricsVoteProps) {
  const isInteractive = typeof onVoteChange === "function" && !disabled;
  const displayScore = formatScore?.(score) ?? (
    <span>{formatCompactNumber(score)}</span>
  );

  const upActive = vote === "up";
  const downActive = vote === "down";

  return (
    <div
      className={cn(pillVariants({ size }), "gap-1 px-1", className)}
      {...props}
    >
      <button
        type="button"
        className={cn(
          "inline-flex size-7 items-center justify-center rounded-full transition-colors",
          "hover:bg-muted",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
          upActive ? "text-primary" : "text-muted-foreground",
        )}
        aria-pressed={upActive}
        aria-label={upvoteLabel}
        disabled={!isInteractive}
        onClick={() => onVoteChange?.(upActive ? null : "up")}
      >
        <IconArrowBigUp className="size-4.5" />
      </button>

      <span className="min-w-9 px-1 text-center tabular-nums font-medium">
        {displayScore}
      </span>

      <button
        type="button"
        className={cn(
          "inline-flex size-7 items-center justify-center rounded-full transition-colors",
          "hover:bg-muted",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
          downActive ? "text-destructive" : "text-muted-foreground",
        )}
        aria-pressed={downActive}
        aria-label={downvoteLabel}
        disabled={!isInteractive}
        onClick={() => onVoteChange?.(downActive ? null : "down")}
      >
        <IconArrowBigDown className="size-4.5" />
      </button>
    </div>
  );
}
