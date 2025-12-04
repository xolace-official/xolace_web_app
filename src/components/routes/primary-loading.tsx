import { cn } from "@/lib/utils";
import { PrimarySpinner } from "../shared/loaders/primary-loader";

export function PrimaryFullPageLoading() {
  return (
    <div className="size-full min-h-screen py-12 flex flex-col items-center justify-center">
      <PrimarySpinner className="size-8" />
    </div>
  );
}

export function PrimaryPageLoading({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "size-full w-full py-12 flex flex-col items-center justify-center",
        className,
      )}
    >
      <PrimarySpinner className="size-6" />
    </div>
  );
}
