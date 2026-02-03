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

export function EmailSection() {
  // TODO: Get session/user data from your auth context or store
  // const { session } = useUserStore();
  // TODO: Add mutation hook for updating email
  // const updateEmailMutation = useMutation({
  //   mutationFn: updateUserEmailAction,
  //   onSuccess: () => {
  //     toast.success("Email updated");
  //     setOpen(false);
  //   },
  // });

  // Placeholder values - replace with actual state
  const currentEmail = "";
  const isPending = false;

  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState(currentEmail);

  const handleSubmit = () => {
    if (!email.trim()) return;

    // TODO: Call mutation to update email
    // updateEmailMutation.mutate({ email });
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
