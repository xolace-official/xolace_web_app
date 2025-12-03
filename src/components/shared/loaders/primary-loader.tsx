import { Loader } from "lucide-react"

import { cn } from "@/lib/utils"

function PrimarySpinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <Loader
      role="img"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  )
}

export { PrimarySpinner }
