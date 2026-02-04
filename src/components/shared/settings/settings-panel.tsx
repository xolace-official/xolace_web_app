"use client";

import type * as React from "react";
import { cn } from "@/lib/utils";

interface SettingsPanelProps extends React.ComponentProps<"div"> {
  children: React.ReactNode;
}

export function SettingsPanel({
  children,
  className,
  ...props
}: SettingsPanelProps) {
  return (
    <div
      className={cn(
        "divide-y divide-border rounded-lg border bg-card",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface SettingsPanelSectionProps extends React.ComponentProps<"div"> {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function SettingsPanelSection({
  title,
  description,
  children,
  className,
  ...props
}: SettingsPanelSectionProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
      {...props}
    >
      <div className="space-y-1">
        <h3 className="text-sm font-medium leading-none">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}
