"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type {
  EntityActionDescriptor,
  EntityActionsContext,
  EntityActionsUiHandlers,
  EntityTarget,
} from "./entity-actions.types";

type EntityActionsMenuProps = {
  target: EntityTarget;
  context: EntityActionsContext;
  ui: EntityActionsUiHandlers;

  // Important: in later steps this comes from "buildActions(...)"
  actions: EntityActionDescriptor[];

  onOpenChange?: (open: boolean) => void;
};

export function EntityActionsMenu({
  target,
  context,
  ui,
  actions,
  onOpenChange,
}: EntityActionsMenuProps) {
  return (
    <DropdownMenu modal={false} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger aria-label="Open actions menu">
        {/* keep your existing trigger icon for now */}
        {/** biome-ignore lint/a11y/noSvgWithoutTitle: Well props not available */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-gray-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
        </svg>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {actions.map((action) => (
          <DropdownMenuItem
            key={action.key}
            disabled={action.disabled}
            className={
              action.destructive
                ? "text-red-400 hover:cursor-pointer hover:text-red-500"
                : "hover:cursor-pointer"
            }
            onSelect={async () => {
              // Dumb renderer: just run what it receives
              await action.run({ target, context, ui });
            }}
          >
            {action.icon ? <span className="mr-2">{action.icon}</span> : null}
            <span>{action.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
