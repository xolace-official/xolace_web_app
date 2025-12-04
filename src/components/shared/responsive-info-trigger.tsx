"use client";

import { IconInfoCircle } from "@tabler/icons-react";
import type { ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/animate-ui/components/animate/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMediaQuery } from "@/hooks/use-media-query";

type ResponsiveInfoTriggerProps = {
  content: ReactNode;
  triggerClassName?: string;
};

/**
 * A responsive component that shows a tooltip on desktop (md+) and a popover on mobile/tablet.
 * This provides better UX since tooltips don't work well on touch devices.
 */
export function ResponsiveInfoTrigger({
  content,
  triggerClassName = "cursor-help",
}: ResponsiveInfoTriggerProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const trigger = (
    <button type="button" className={triggerClassName}>
      <IconInfoCircle className="size-4 text-muted-foreground" />
    </button>
  );

  if (isDesktop) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{trigger}</TooltipTrigger>
        <TooltipContent>{content}</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className="w-auto max-w-xs text-sm">
        {content}
      </PopoverContent>
    </Popover>
  );
}
