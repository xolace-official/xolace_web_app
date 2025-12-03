import { Loader2Icon } from "lucide-react";

import { cn } from "@/lib/utils";

function SecondarySpinner({
  className,
  ...props
}: React.ComponentProps<"svg">) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: role:status complaining about semantic elements
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  );
}

export { SecondarySpinner };
