"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function UsernameSection() {
  // TODO: Get profile data from your auth/user context or store
  // const { profile } = useUserStore();
  // TODO: Add mutation hook for updating profile
  // const { updateProfileMutation } = useProfileMutations();

  // Placeholder values - replace with actual state
  const currentUsername = "";
  const isPending = false;

  const [open, setOpen] = React.useState(false);
  const [username, setUsername] = React.useState(currentUsername);

  const handleSubmit = () => {
    if (!username.trim()) return;

    // TODO: Call mutation to update username
    // updateProfileMutation.mutate(
    //   { username },
    //   {
    //     onSuccess: () => {
    //       toast.success("Username updated");
    //       setOpen(false);
    //     },
    //   }
    // );
    console.log("Update username:", username);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Update username
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Username</DialogTitle>
          <DialogDescription>
            Update your username for this account. This will be used to refer to
            you in the app.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Input
            value={username}
            placeholder={currentUsername || "What would you like to be called?"}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isPending}
            maxLength={32}
          />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" size="sm" disabled={isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            disabled={!username.trim() || isPending}
            size="sm"
            onClick={handleSubmit}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
