"use client";

import { Star } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Type definition for campfire data with favorite and join status
 */
export interface UserCampfireFavoriteJoin {
  campfireId: string;
  name: string;
  slug: string;
  description?: string;
  iconURL?: string;
  isFavorite?: boolean;
  isJoined?: boolean;
}

/**
 * Props for the ManageCampfireCard component
 */
interface ManageCampfireCardProps extends UserCampfireFavoriteJoin {
  onToggleFavorite: (campfireId: string, currentState: boolean) => void;
  onJoinCampfire?: (campfireId: string) => void;
  isTogglingFavorite?: boolean;
  isJoining?: boolean;
  className?: string;
}

/**
 * A composable, production-grade campfire card component
 *
 * Features:
 * - Responsive layout with proper spacing
 * - Animated favorite toggle with scale effect
 * - Accessible button states and ARIA labels
 * - Optimistic UI updates with loading states
 * - Design system integration via globals.css
 * - Proper TypeScript typing
 */
const ManageCampfireCard = ({
  campfireId,
  name,
  slug,
  description,
  iconURL,
  isFavorite = false,
  isJoined = false,
  onToggleFavorite,
  onJoinCampfire,
  isTogglingFavorite = false,
  isJoining = false,
  className,
}: ManageCampfireCardProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleFavoriteClick = () => {
    if (isTogglingFavorite) return;

    setIsAnimating(true);
    onToggleFavorite(campfireId, isFavorite);

    // Reset animation state after animation completes
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleJoinClick = () => {
    if (isJoining || !onJoinCampfire) return;
    onJoinCampfire(campfireId);
  };

  return (
    <article
      className={cn(
        "flex w-full flex-wrap items-start justify-between gap-4 md:gap-8",
        className,
      )}
      data-campfire-id={campfireId}
    >
      {/* Left section: Avatar + Info */}
      <div className="flex min-w-0 flex-1 gap-3">
        <Avatar className="size-8 shrink-0">
          <AvatarImage src={iconURL || undefined} alt={`${name} icon`} />
          <AvatarFallback className="border border-primary/20 bg-primary/10 text-primary font-semibold">
            {name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex min-w-0 flex-col">
          <Link
            href={`/x/${slug}`}
            className="truncate text-sm font-semibold text-foreground hover:underline hover:text-primary active:text-primary/80 transition-colors"
          >
            {name}
          </Link>
          {description && (
            <p className="text-xs text-muted-foreground line-clamp-2 wrap-break-word">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Right section: Actions */}
      <div className="flex shrink-0 items-center gap-2">
        {/* Favorite Toggle Button */}
        <Button
          variant="ghost"
          size="iconSm"
          onClick={handleFavoriteClick}
          disabled={isTogglingFavorite}
          className={cn(
            "transition-all duration-300",
            isAnimating && "scale-125",
            !isTogglingFavorite && "hover:scale-110",
          )}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={isFavorite}
        >
          <Star
            className={cn(
              "size-5 transition-all duration-200",
              isFavorite
                ? "fill-yellow-400 text-yellow-400 drop-shadow-sm"
                : "text-muted-foreground hover:text-yellow-400",
            )}
          />
        </Button>

        {/* Join/Joined Button */}
        {isJoined ? (
          <Button
            size="sm"
            variant="outline"
            className="rounded-full text-sm"
            disabled
            aria-label="Already joined this campfire"
          >
            Joined
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={handleJoinClick}
            disabled={isJoining}
            className="rounded-full text-sm"
            aria-label={`Join ${name}`}
          >
            {isJoining ? "Joining..." : "Join"}
          </Button>
        )}
      </div>
    </article>
  );
};

ManageCampfireCard.displayName = "ManageCampfireCard";

export default ManageCampfireCard;
