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
import { useAppStore } from "@/providers/app-store-provider";

export function EmailSection() {
  const session = useAppStore((s) => s.session);

  const currentEmail = session.user.email ?? "";
  const isPending = false;

  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState(currentEmail);

  const handleSubmit = () => {
    if (!email.trim()) return;

    // TODO: Email updates go through Supabase Auth, not profile API
    // This will need a dedicated server action (e.g. updateUserEmailAction)
    console.log("Update email:", email);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Update email
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Email</DialogTitle>
          <DialogDescription>
            Update your email for this account. This will be used to sign in to
            your account. Note, you will need to verify your new email address
            after updating.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Input
            type="email"
            value={email}
            placeholder={currentEmail || "Your email address"}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isPending}
          />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" size="sm" disabled={isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            disabled={!email.trim() || isPending}
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
