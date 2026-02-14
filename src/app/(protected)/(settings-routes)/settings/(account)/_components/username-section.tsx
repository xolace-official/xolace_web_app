"use client";

import { useState } from "react";
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
import { useProfileMutations } from "@/features/user/hooks/use-profile-mutations";
import { useAppStore } from "@/providers/app-store-provider";

export function UsernameSection() {
  const profile = useAppStore((s) => s.profile);
  const { mutate, isPending } = useProfileMutations();

  const currentUsername = profile.username ?? "";

  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState(currentUsername);

  const handleSubmit = () => {
    if (!username.trim()) return;
    mutate({ username });
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
