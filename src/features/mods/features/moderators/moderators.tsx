"use client";

import { formatDistanceToNow } from "date-fns";
import { Loader2, Plus } from "lucide-react";
import dynamic from "next/dynamic";
import React, { useState, useTransition } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ModeratorActionsPopover from "@/features/mods/features/moderators/action-popover";

const InviteModModal = dynamic(
  () => import("@/features/mods/features/moderators/invites-mod-modal"),
  { ssr: false },
);

import { debounce } from "nuqs";
import { ParamsSearchBar } from "@/components/shared/params-search-bar";
import { useModsFiltersServer } from "@/features/mods/features/moderators/mods-filter";

interface ModeratorsProps {
  campfireId: string;
}

const DUMMY_MODERATORS = [
  {
    id: "1",
    username: "fedejnr",
    avatar_url: "/avatars/1.png",
    role: "creator",
    permission_summary: "Everything",
    permission_count: 12,
    can_edit: true,
    joined_at: new Date("2024-01-10").toISOString(),
  },
  {
    id: "2",
    username: "john_doe",
    avatar_url: "/avatars/2.png",
    role: "moderator",
    permission_summary: "Posts, Comments",
    permission_count: 3,
    can_edit: false,
    joined_at: new Date("2024-05-22").toISOString(),
  },
  {
    id: "3",
    username: "mary_mod",
    avatar_url: "",
    role: "moderator",
    permission_summary: "Reports",
    permission_count: 1,
    can_edit: true,
    joined_at: new Date("2024-08-01").toISOString(),
  },
];

function useMockCampfireModerators() {
  return {
    data: DUMMY_MODERATORS,
    isLoading: false,
    isError: false,
    error: null,
  };
}

const Moderators: React.FC<ModeratorsProps> = ({ campfireId }) => {
  const [showInviteModal, setShowInviteModal] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const [{ query }, setSearchParams] = useModsFiltersServer({
    limitUrlUpdates: debounce(250),
    shallow: false,
  });

  const { data: moderators, isLoading, isError } = useMockCampfireModerators();

  // Filter moderators based on search term
  const filteredModerators = React.useMemo(() => {
    if (!moderators) return [];

    if (query.trim() === "") {
      return moderators;
    }

    const term = query.toLowerCase();
    return moderators.filter(
      (moderator) =>
        moderator.username.toLowerCase().includes(term) ||
        moderator.id.toString().includes(term),
    );
  }, [moderators, query]);

  const handleTeamOrder = () => {
    // TODO: Implement team order functionality
    toast("Cannot order team at this time");
  };

  const handleLeaveModTeam = () => {
    // TODO: Implement leave mod team functionality
    toast("Cannot leave mod team at this time");
  };

  if (isLoading) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-ocean-500" />
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
          Loading moderators...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-8">
        <p className="text-sm text-red-500 mb-4">Failed to load moderators</p>
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          className="rounded-lg"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="w-full flex flex-col space-y-4">
        {/* Header Actions */}
        <div className="flex gap-2 justify-end">
          <Button
            className="flex items-center gap-1 rounded-full  py-2 text-sm transition-colors"
            onClick={() => setShowInviteModal(true)}
          >
            <Plus className="h-4 w-4" />
            Invite Firekeeper
          </Button>
          <ModeratorActionsPopover
            onLeaveModTeam={handleLeaveModTeam}
            onTeamOrder={handleTeamOrder}
          />
        </div>

        {/* Search */}
        <div className={"w-full flex gap-4 items-center"}>
          <ParamsSearchBar
            value={query}
            onChange={(value) => {
              startTransition(async () => {
                await setSearchParams(
                  { query: value },
                  {
                    limitUrlUpdates: value ? debounce(250) : undefined,
                  },
                );
              });
            }}
            onClear={() => {
              startTransition(async () => {
                await setSearchParams({ query: "" });
              });
            }}
            isLoading={isPending}
          />
        </div>

        {/* Moderators Table */}
        <div className="overflow-x-auto rounded-lg border ">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead className="font-semibold">USERNAME</TableHead>
                <TableHead className="font-semibold">PERMISSIONS</TableHead>
                <TableHead className="font-semibold">YOU CAN EDIT</TableHead>
                <TableHead className="font-semibold">JOINED</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredModerators.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <div className="flex flex-col items-center space-y-2">
                      <p className="">
                        {query.trim()
                          ? "No moderators found matching your search."
                          : "No moderators found."}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredModerators.map((mod) => (
                  <TableRow
                    key={mod.id}
                    className="hover:bg-muted transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border">
                          <AvatarImage
                            src={mod.avatar_url}
                            alt={mod.username}
                          />
                          <AvatarFallback className="text-sm font-medium">
                            {mod.username.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium ">{mod.username}</span>
                          {mod.role === "creator" && (
                            <span className="text-xs text-muted-foreground font-medium">
                              Founder
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                          {mod.permission_summary || "Everything"}
                        </span>
                        {mod.permission_count > 0 ? (
                          <span className="text-xs text-muted-foreground">
                            {mod.permission_count} permission
                            {mod.permission_count !== 1 ? "s" : ""}
                          </span>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-sm font-medium ${
                          mod.can_edit ? "text-accent" : "text-foreground"
                        }`}
                      >
                        {mod.can_edit ? "Yes" : "No"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm text-neutral-900 dark:text-neutral-100">
                          {formatDistanceToNow(new Date(mod.joined_at))} ago
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(mod.joined_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Stats Footer */}
        {moderators && moderators.length > 0 && (
          <div className="text-xs text-muted-foreground text-center">
            Showing {filteredModerators.length} of {moderators.length}{" "}
            firekeeper{moderators.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      {showInviteModal && (
        <InviteModModal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          campfireId={campfireId}
        />
      )}
    </>
  );
};

export default Moderators;
