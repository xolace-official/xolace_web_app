"use client";

import {
  Bookmark,
  Copy,
  EllipsisVertical,
  Eye,
  Flag,
  Heart,
  type LucideIcon,
  Share2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { GlimpseInterface } from "@/features/health-space/glimpse/index";
import { formatDuration, formatNumber, formatRelativeTime } from "@/utils";

interface StoriesCardProps {
  glimpse: GlimpseInterface;
  onSave: (value: string) => void;
  onShare: (value: string) => void;
  onReport: (value: string) => void;
  onCopy: (value: string) => void;
}

export const GlimpseCard = ({
  glimpse,
  onCopy,
  onShare,
  onReport,
  onSave,
}: StoriesCardProps) => {
  const actions: {
    key: string;
    label: string;
    icon: LucideIcon;
    onClick: (value: string) => void;
  }[] = [
    { key: "save", label: "Save", icon: Bookmark, onClick: onSave },
    { key: "share", label: "Share", icon: Share2, onClick: onShare },
    { key: "report", label: "Report", icon: Flag, onClick: onReport },
    { key: "copy", label: "Copy Link", icon: Copy, onClick: onCopy },
  ];

  return (
    <div className="group p-2 rounded-lg hover:bg-muted hover:shadow-sm">
      <div className="relative w-full aspect-video overflow-hidden rounded-lg border border-border">
        <Link href={`/glimpse/${glimpse.id}`}>
          <Image
            src={glimpse.thumbnail_url}
            alt={glimpse.title || "Glimpse video"}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        </Link>

        <div className="text-destructive absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-xs font-semibold">
          {formatDuration(glimpse.duration_seconds)}
        </div>
      </div>

      <div className={"flex items-start justify-between"}>
        <div className="flex gap-2 mt-2">
          <div className="relative w-9 h-9 rounded-full overflow-hidden bg-muted shrink-0 border-2 border-border">
            <Image
              src={glimpse.author_avatar_url}
              alt={glimpse.author_display_name}
              fill
              sizes="36px"
              className="object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className={"flex items-center justify-between"}>
              <h3 className="text-sm font-bold text-foreground line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                {glimpse.title || "Untitled Glimpse"}
              </h3>

              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" aria-label="Open menu">
                    <EllipsisVertical />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40" align="end">
                  {actions.map((action) => {
                    const IconComponent = action.icon;
                    return (
                      <DropdownMenuItem
                        key={action.key}
                        onSelect={() => action.onClick(glimpse.id)}
                        className={"flex flex-row items-center gap-2"}
                      >
                        <IconComponent className={"w-4 h-4"} /> {action.label}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <p className="text-xs text-muted-foreground font-semibold mb-0.5">
              {glimpse.author_display_name}
            </p>

            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span className="font-semibold">
                  {formatNumber(glimpse.views_count)}
                </span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                <span className="font-semibold">
                  {formatNumber(glimpse.likes_count)}
                </span>
              </div>
              {glimpse.published_at && (
                <>
                  <span>•</span>
                  <span className="font-semibold">
                    {formatRelativeTime(glimpse.published_at)}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
