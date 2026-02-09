"use client";

import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function StepConfirm() {
  return (
    <div className="space-y-6">
      <Alert variant="destructive">
        <AlertTitle>Important Notice</AlertTitle>
        <AlertDescription>
          Only public communities appear in search. Changing this later requires
          a request.
        </AlertDescription>
      </Alert>
    </div>
  );
}

export function StepConfirmTerms() {
  return (
    <p className="text-muted-foreground text-xs">
      By continuing, you agree to our{" "}
      <span className="font-semibold">Mod Code of Conduct</span> and acknowledge
      that you understand the{" "}
      <Link
        href="/policies"
        target="_blank"
        className="text-muted-foreground font-semibold"
      >
        Xolace Rules
      </Link>
      .
    </p>
  );
}
