"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/settings/confirm-dialog";

export function DeleteSection() {
  // TODO: Add mutation hook for deleting account
  // const { deleteProfileMutation } = useProfileMutations();

  // Placeholder values - replace with actual state
  const isPending = false;

  const [open, setOpen] = React.useState(false);

  const handleDelete = () => {
    // TODO: Call mutation to delete account
    // deleteProfileMutation.mutate();
    console.log("Deleting account...");
    setOpen(false);
  };

  return (
    <ConfirmDialog
      destructive
      open={open}
      onOpenChange={setOpen}
      title="Delete account"
      description={
        <>
          Are you sure you want to delete your account? This action cannot be
          undone.
          <br />
          <br />
          All your data, including posts, comments, and profile information will
          be permanently removed.
        </>
      }
      confirmLabel="Delete account"
      onConfirm={handleDelete}
      disabled={isPending}
    >
      <Button variant="destructive" size="sm">
        Delete account
      </Button>
    </ConfirmDialog>
  );
}
