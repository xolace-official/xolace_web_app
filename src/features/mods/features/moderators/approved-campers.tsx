"use client";

import { formatDistanceToNow } from "date-fns";
import { Loader2, Plus } from "lucide-react";
import dynamic from "next/dynamic";
import React, { useState, useTransition } from "react";
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

const AddApprovedCamperModal = dynamic(
  () => import("@/features/mods/features/moderators/add-camper-modal"),
  { ssr: false },
);

import { debounce } from "nuqs";
import { ParamsSearchBar } from "@/components/shared/params-search-bar";
import { useModsFiltersServer } from "@/features/mods/features/moderators/mods-filter";

interface ApprovedCampersProps {
  campfireId: string;
}

const DUMMY_MODERATORS = [
  {
    id: "1",
    username: "fedejnr",
    avatar_url: "/avatars/1.png",
    reputation: 23,
    joined_at: new Date("2024-01-10").toISOString(),
  },
  {
    id: "2",
    username: "john_doe",
    avatar_url: "/avatars/2.png",
    reputation: 23,
    joined_at: new Date("2024-05-22").toISOString(),
  },
  {
    id: "3",
    username: "mary_mod",
    avatar_url: "",
    reputation: 23,
    joined_at: new Date("2024-08-01").toISOString(),
  },
];

/**
 * Provides mock campfire moderator data and simple loading/error flags for development and testing.
 *
 * @returns An object with:
 * - `data`: an array of mock moderator records
 * - `isLoading`: `false`
 * - `isError`: `false`
 * - `error`: `null`
 */
function useMockCampfireModerators() {
  return {
    data: DUMMY_MODERATORS,
    isLoading: false,
    isError: false,
    error: null,
  };
}

const ApprovedCampers: React.FC<ApprovedCampersProps> = ({ campfireId }) => {
  const [showAddCamperModal, setShowAddCamperModal] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [{ query }, setSearchParams] = useModsFiltersServer({
    limitUrlUpdates: debounce(250),
    shallow: false,
  });

  // Fetch approved users data
  const {
    data: approvedUsers,
    isLoading,
    isError,
    error,
  } = useMockCampfireModerators();

  // Filter approved users based on search term
  const filteredUsers = React.useMemo(() => {
    if (!approvedUsers) return [];

    if (query.trim() === "") {
      return approvedUsers;
    }

    const term = query.toLowerCase();
    return approvedUsers.filter(
      (user) =>
        user.username.toLowerCase().includes(term) ||
        user.id.toString().includes(term),
    );
  }, [approvedUsers, query]);

  const handleAddCamper = (userId: string) => {
    console.log("Adding approved camper:", userId);
    // The actual approval logic is handled in the modal
  };

  if (isLoading) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-foreground" />
        <p className="text-sm text-muted-foreground mt-2">
          Loading approved users...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-8">
        <p className="text-sm text-red-500 mb-4">
          Failed to load approved users
        </p>
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
        <p className="text-foregorund text-sm">
          Think of approved users as campers with special access to the fire,
          they can gather without being held back by some of the usual limits.
        </p>

        {/* Header Actions */}
        <div className="flex gap-2 justify-end">
          <Button
            className="flex items-center gap-1 rounded-full px-4 py-2 text-sm  transition-colors"
            onClick={() => setShowAddCamperModal(true)}
          >
            <Plus className="h-4 w-4" />
            Add Approved Camper
          </Button>
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

        {/* Approved Users Table */}
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead className="font-semibold">USERNAME</TableHead>
                <TableHead className="font-semibold">REPUTATION</TableHead>
                <TableHead className="font-semibold">JOINED</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8">
                    <div className="flex flex-col items-center space-y-2">
                      <p className="text-foreground">
                        {query.trim()
                          ? "No approved users found matching your search."
                          : "No approved users found."}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    className="hover:bg-muted transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border">
                          <AvatarImage
                            src={user.avatar_url}
                            alt={user.username}
                          />
                          <AvatarFallback className="text-sm font-medium">
                            {user.username.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-foreground">
                          {user.username}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-foreground">
                        {user.reputation.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm text-foreground">
                          {formatDistanceToNow(new Date(user.joined_at))} ago
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(user.joined_at).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
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
        {approvedUsers && approvedUsers.length > 0 && (
          <div className="text-xs text-foreground text-center">
            Showing {filteredUsers.length} of {approvedUsers.length} approved
            user{approvedUsers.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      {showAddCamperModal && (
        <AddApprovedCamperModal
          isOpen={showAddCamperModal}
          onClose={() => setShowAddCamperModal(false)}
          campfireId={campfireId}
          onAdd={handleAddCamper}
        />
      )}
    </>
  );
};

export default ApprovedCampers;