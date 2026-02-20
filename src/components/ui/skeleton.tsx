import { cn } from "@/lib/utils";

/**
 * Renders a rounded, pulsing placeholder div used as a UI skeleton.
 *
 * Merges any provided `className` with the component's default skeleton classes and forwards remaining props to the root `div`.
 *
 * @param className - Additional CSS classes to apply to the root `div`
 * @returns A `div` element representing a skeleton placeholder
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent/40 animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

export { Skeleton };