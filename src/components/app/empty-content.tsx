"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Render a centered, animated empty-state UI with an icon, title, description, and optional actions.
 *
 * @param title - Heading text shown prominently at the top
 * @param description - Content displayed below the title (can be any React node)
 * @param icon - Visual node rendered inside a scale animation above the title
 * @param actions - Optional action controls rendered below the description with spacing
 * @param className - Additional CSS classes appended to the container
 * @param options - Visual toggles for the container
 * @param options.disablePadding - When true, removes the container padding
 * @param options.disableBorder - When true, removes the container border
 * @returns The JSX element for the empty-state layout
 */
export function EmptyContent({
  title,
  description,
  icon,
  options,
  className,
  actions,
}: {
  title: string;
  description: React.ReactNode;
  icon: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  options?: {
    disablePadding?: boolean;
    disableBorder?: boolean;
  };
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        "flex justify-center items-center flex-col rounded-xl gap-y-3 @container",
        options?.disableBorder ? "" : "border",
        options?.disablePadding ? "" : "px-4 py-8",
        className,
      )}
    >
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
        {icon}
      </motion.div>

      <p className="font-semibold text-xl">{title}</p>

      <p className="text-sm w-3/4 @md:w-1/2 text-center text-muted-foreground">
        {description}
      </p>

      {actions && <div className="mt-4">{actions}</div>}
    </motion.div>
  );
}