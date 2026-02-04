"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, X, AlertCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatDistanceToNow } from "date-fns";
import {
  useAddApprovedUser,
  useDebounce,
  useSearchUsers,
} from "@/features/mods/features/mockhooks";
import { SearchBar } from "@/components/shared/search-bar";

export interface UserSearchResult {
  id: string;
  username: string;
  avatar_url: string;
  created_at: string;
  reputation: number;
}

export interface AddApprovedCamperModalProps {
  isOpen: boolean;
  onClose: () => void;
  campfireId: string;
  onAdd: (userId: string) => void;
}

const AddApprovedCamperModal: React.FC<AddApprovedCamperModalProps> = ({
  isOpen,
  onClose,
  campfireId,
  onAdd,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserSearchResult | null>(
    null,
  );

  // Hooks
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const {
    data: foundUsers,
    isLoading: isSearching,
    isError,
  } = useSearchUsers(debouncedSearchTerm);
  const addApprovedUserMutation = useAddApprovedUser(campfireId);

  const handleUserSelect = (user: UserSearchResult) => {
    setSelectedUser(user);
    setSearchTerm("");
  };

  const handleCancelSelection = () => {
    setSelectedUser(null);
    setSearchTerm("");
  };

  const handleAdd = async () => {
    if (!selectedUser) {
      return;
    }

    try {
      await addApprovedUserMutation.mutateAsync({
        userId: selectedUser.id,
      });

      // Reset form and close modal
      handleReset();
      onClose();
      onAdd(selectedUser.id);
    } catch (error) {
      // Error handling is done in the mutation
      console.error("Add approved user error:", error);
    }
  };

  const handleReset = () => {
    setSelectedUser(null);
    setSearchTerm("");
  };

  const handleCancel = () => {
    handleReset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[98vw] sm:max-w-[500px] border-0 rounded-2xl!">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-1">
            <Plus className="h-5 w-5" />
            Add Approved Camper
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input or Selected User */}
          <div className="relative">
            {!selectedUser ? (
              <>
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
                  <div className="absolute z-10 w-full mt-1  border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {isSearching && (
                      <div className="flex items-center justify-center p-4 text-sm">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                        Searching...
                      </div>
                    )}
                    {isError && (
                      <div className="p-4 text-sm flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Could not search users. Please try again.
                      </div>
                    )}
                    {!isSearching && foundUsers && foundUsers.length === 0 && (
                      <div className="p-4 text-sm text-gray-500 text-center">
                        No users found matching &quot;{debouncedSearchTerm}
                        &quot;
                      </div>
                    )}
                    {foundUsers?.map((user) => (
                      <div
                        key={user.id}
                        className="z-50 flex items-center p-3 bg-muted hover:bg-muted-foreground cursor-pointer border-b border last:border-b-0"
                        onClick={() => handleUserSelect(user)}
                      >
                        <Avatar className="w-10 h-10 border-2 ">
                          <AvatarImage
                            src={user.avatar_url}
                            alt={user.username}
                          />
                          <AvatarFallback className="text-sm">
                            {user.username.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="ml-3 flex-1">
                          <div className="text-sm font-medium">
                            {user.username}
                          </div>
                          <div className="text-xs">
                            {formatDistanceToNow(new Date(user.created_at))} old
                            • {user.reputation.toLocaleString()} reputation
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              /* Selected User Display */
              <div className="flex items-center p-4  rounded-lg border">
                <Avatar className="w-10 h-10 border-2">
                  <AvatarImage
                    src={selectedUser.avatar_url}
                    alt={selectedUser.username}
                  />
                  <AvatarFallback className="text-sm">
                    {selectedUser.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-3 flex-1">
                  <div className="text-sm font-semibold">
                    {selectedUser.username}
                  </div>
                  <div className="text-xs">
                    {formatDistanceToNow(new Date(selectedUser.created_at))} old
                    • {selectedUser.reputation.toLocaleString()} reputation
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelSelection}
                  disabled={addApprovedUserMutation.isPending}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Info Alert */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              Only existing campfire members can be approved. Users must join
              the campfire first.
            </AlertDescription>
          </Alert>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={addApprovedUserMutation.isPending}
              className="rounded-lg"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={!selectedUser || addApprovedUserMutation.isPending}
              className="rounded-lg"
            >
              {addApprovedUserMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Approving...
                </>
              ) : (
                "Approve User"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddApprovedCamperModal;
