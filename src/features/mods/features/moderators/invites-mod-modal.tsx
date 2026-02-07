"use client";

import { formatDistanceToNow } from "date-fns";
import { AlertCircle, Loader2, UserRoundPlusIcon, X } from "lucide-react";
import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import { SearchBar } from "@/components/shared/search-bar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  getPermissionGroups,
  useCreateFirekeeperInviteV2,
  useDebounce,
  useSearchUsers,
} from "@/features/mods/features/mockhooks";

export interface ModInviteProps {
  id: string;
  username: string;
  avatar_url: string;
  created_at: string;
  reputation: number;
}

export interface InviteModModalProps {
  isOpen: boolean;
  onClose: () => void;
  campfireId: string;
}

export interface SelectedPermissions {
  [groupKey: string]: {
    selected: boolean;
    permissions: number[];
  };
}

const InviteModModal: React.FC<InviteModModalProps> = ({
  isOpen,
  onClose,
  campfireId,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMod, setSelectedMod] = useState<ModInviteProps | null>(null);
  const [selectedPermissions, setSelectedPermissions] =
    useState<SelectedPermissions>({});
  const [invitationMessage, setInvitationMessage] = useState("");
  const [showMessageInput, setShowMessageInput] = useState(false);

  // Hooks
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const {
    data: foundUsers,
    isLoading: isSearching,
    isError,
  } = useSearchUsers(debouncedSearchTerm);
  const { data: permissionGroups, isLoading: isLoadingPermissions } =
    getPermissionGroups();
  const createInviteMutation = useCreateFirekeeperInviteV2(campfireId);

  // Initialize permissions when groups are loaded
  const hasPermissions = Object.keys(selectedPermissions).length > 0;
  React.useEffect(() => {
    if (permissionGroups && !hasPermissions) {
      const initialPermissions = permissionGroups.reduce((acc, group) => {
        acc[group.group] = {
          selected: group.group === "manage_content", // Default select content management
          permissions: group.permissions.map((p) => p.id),
        };
        return acc;
      }, {} as SelectedPermissions);
      setSelectedPermissions(initialPermissions);
    }
  }, [permissionGroups, hasPermissions]);

  // Calculate selected permission IDs
  const selectedPermissionIds = useMemo(() => {
    return Object.values(selectedPermissions)
      .filter((group) => group.selected)
      .flatMap((group) => group.permissions);
  }, [selectedPermissions]);

  const handleUserSelect = (mod: ModInviteProps) => {
    setSelectedMod(mod);
    setSearchTerm("");
  };

  const handleCancelSelection = () => {
    setSelectedMod(null);
    setSearchTerm("");
  };

  const handlePermissionGroupToggle = (groupKey: string) => {
    setSelectedPermissions((prev) => ({
      ...prev,
      [groupKey]: {
        ...prev[groupKey],
        selected: !prev[groupKey]?.selected,
      },
    }));
  };

  const handleInvite = async () => {
    if (!selectedMod) {
      toast.error("Please select a user to invite");
      return;
    }

    if (selectedPermissionIds.length === 0) {
      toast.error("Please select at least one permission group");
      return;
    }

    try {
      await createInviteMutation.mutateAsync({
        inviteeId: selectedMod.id,
        permissionIds: selectedPermissionIds,
        invitationMessage: invitationMessage.trim() || undefined,
      });

      // Reset form and close modal
      handleReset();
      onClose();
    } catch (error) {
      // Error handling is done in the mutation
      console.error("Invite error:", error);
    }
  };

  const handleReset = () => {
    setSelectedMod(null);
    setSearchTerm("");
    setInvitationMessage("");
    setShowMessageInput(false);
    // Reset to default permissions
    if (permissionGroups) {
      const defaultPermissions = permissionGroups.reduce((acc, group) => {
        acc[group.group] = {
          selected: group.group === "manage_content",
          permissions: group.permissions.map((p) => p.id),
        };
        return acc;
      }, {} as SelectedPermissions);
      setSelectedPermissions(defaultPermissions);
    }
  };

  const handleCancel = () => {
    handleReset();
    onClose();
  };

  if (isLoadingPermissions) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-full max-w-[98vw] sm:max-w-[500px] border-0 rounded-2xl!">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            Loading permissions...
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[98vw] sm:max-w-[500px] border-0 rounded-2xl! h-[90vh] max-h-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-1">
            <UserRoundPlusIcon className="h-5 w-5" />
            Invite Firekeeper
          </DialogTitle>
        </DialogHeader>

        <div className="no-scrollbar flex-1 overflow-y-auto px-4">
          <div className="space-y-4">
            {/* Search Input or Selected Mod */}
            <div className="relative">
              {!selectedMod ? (
                <>
                  {/* Search */}
                  <div className={"w-full flex gap-4 items-center"}>
                    <SearchBar
                      value={searchTerm}
                      onChange={(value) => {
                        setSearchTerm(value);
                      }}
                    />
                  </div>

                  {/* Search Results */}
                  {debouncedSearchTerm.length >= 3 && (
                    <div className="absolute z-10 w-full mt-1 bg-muted border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {isSearching && (
                        <div className="flex items-center justify-center p-4 text-sm text-gray-500">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                          Searching...
                        </div>
                      )}
                      {isError && (
                        <div className="p-4 text-sm text-red-500 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-2" />
                          Could not search users. Please try again.
                        </div>
                      )}
                      {!isSearching &&
                        foundUsers &&
                        foundUsers.length === 0 && (
                          <div className="p-4 text-sm text-muted-foreground text-center">
                            No users found matching &quot;{debouncedSearchTerm}
                            &quot;
                          </div>
                        )}
                      {foundUsers?.map((mod) => (
                        <button
                          type="button"
                          key={mod.id}
                          className="w-full text-left flex items-center p-3 hover:bg-muted-foreground cursor-pointer border-b border last:border-b-0 transition-colors"
                          onClick={() => handleUserSelect(mod)}
                        >
                          <Avatar className="w-10 h-10 border-2">
                            <AvatarImage
                              src={mod.avatar_url}
                              alt={mod.username}
                            />
                            <AvatarFallback className="text-xs">
                              {mod.username.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="ml-3 flex-1">
                            <div className="text-sm font-medium text-foregorund">
                              {mod.username}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(mod.created_at))}{" "}
                              old • {mod.reputation.toLocaleString()} reputation
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                /* Selected User Display */
                <div className="flex items-center p-4 bg-muted rounded-lg border">
                  <Avatar className="w-10 h-10 border">
                    <AvatarImage
                      src={selectedMod.avatar_url}
                      alt={selectedMod.username}
                    />
                    <AvatarFallback className="text-sm">
                      {selectedMod.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-3 flex-1">
                    <div className="text-sm font-semibold text-muted-foregorund">
                      {selectedMod.username}
                    </div>
                    <div className="text-xs text-muted-foregorund">
                      {formatDistanceToNow(new Date(selectedMod.created_at))}{" "}
                      old • {selectedMod.reputation.toLocaleString()} reputation
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancelSelection}
                    disabled={createInviteMutation.isPending}
                    className="h-8 w-8 p-0 hover:bg-muted"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Permissions */}
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold mb-2">
                  Firekeeper Permissions
                </h4>
                <p className="text-xs text-foreground mb-2">
                  Select the permission groups for this firekeeper. They will
                  have access to all permissions within the selected groups.
                </p>
              </div>

              {permissionGroups?.map((group) => (
                <div key={group.group} className="flex flex-col gap-2">
                  <div className="flex flex-row gap-2 items-start space-x-3 p-2 rounded-lg hover:bg-muted">
                    <Checkbox
                      id={group.group}
                      checked={
                        selectedPermissions[group.group]?.selected || false
                      }
                      onCheckedChange={() =>
                        handlePermissionGroupToggle(group.group)
                      }
                      disabled={createInviteMutation.isPending}
                      className="mt-1"
                    />
                    <div className="flex-1 space-y-1">
                      <label
                        htmlFor={group.group}
                        className="text-sm font-medium cursor-pointer "
                      >
                        {group.label}
                      </label>
                      <p className="text-xs text-foreground">
                        {group.description}
                      </p>
                      <div className="text-xs text-muted-foreground">
                        Includes:{" "}
                        {group.permissions
                          .map((p) => p.display_name)
                          .join(", ")}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {selectedPermissionIds.length === 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    Please select at least one permission group to proceed with
                    the invitation.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Optional Invitation Message */}
            <div className="space-y-2">
              {!showMessageInput ? (
                <Button
                  variant="outline"
                  onClick={() => setShowMessageInput(true)}
                  disabled={createInviteMutation.isPending}
                  className="text-sm"
                >
                  Add personal message (optional)
                </Button>
              ) : (
                <div className="space-y-2">
                  {/** biome-ignore lint/a11y/noLabelWithoutControl: still tied to a textarea */}
                  <label className="text-sm font-medium text-muted-foreground">
                    Personal Message (Optional)
                  </label>
                  <Textarea
                    placeholder="Add a personal message to the invitation..."
                    value={invitationMessage}
                    onChange={(e) => setInvitationMessage(e.target.value)}
                    disabled={createInviteMutation.isPending}
                    className="min-h-[80px] resize-none"
                    maxLength={500}
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-foreground">
                      {invitationMessage.length}/500 characters
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowMessageInput(false);
                        setInvitationMessage("");
                      }}
                      disabled={createInviteMutation.isPending}
                      className="text-xs"
                    >
                      Remove message
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <DialogFooter className="flex flex-row gap-2 md:gap-4 justify-end space-x-3">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={createInviteMutation.isPending}
            className="rounded-lg"
          >
            Cancel
          </Button>
          <Button
            onClick={handleInvite}
            disabled={
              !selectedMod ||
              selectedPermissionIds.length === 0 ||
              createInviteMutation.isPending
            }
            className="rounded-lg"
          >
            {createInviteMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Invitation"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InviteModModal;
