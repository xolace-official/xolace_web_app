import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

/**
 * Render a confirmation alert warning that only public communities appear in search and that changing visibility later requires a request.
 *
 * @returns A JSX element containing a destructive Alert with the title "Important Notice" and a description about public community visibility and change requests.
 */
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

/**
 * Renders a small, muted paragraph that states agreement to the Mod Code of Conduct and acknowledges the Xolace Rules with a link to the policies page.
 *
 * @returns A JSX element containing the styled paragraph and an external link to `/policies`
 */
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
