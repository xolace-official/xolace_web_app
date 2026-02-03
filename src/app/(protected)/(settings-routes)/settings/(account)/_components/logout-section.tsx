"use client";

import { Button } from "@/components/ui/button";

export function LogoutSection() {
  // TODO: Add signOut action
  // import { signOutAction } from "@/actions/auth";

  const handleLogout = async () => {
    // TODO: Call sign out action
    // const res = await signOutAction();
    // if (res.success) {
    //   window.open("/sign-in", "_self");
    // }
    console.log("Logging out...");
  };

  return (
    <Button variant="outline" size="sm" onClick={handleLogout}>
      Log out
    </Button>
  );
}
