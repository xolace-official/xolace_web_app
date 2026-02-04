"use client";

import { GetInTouchDialog } from "./get-in-touch-dialog";

export function ContactSection() {
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-muted/50 to-muted p-6 text-center">
      <div className="mx-auto max-w-sm space-y-3">
        {/* Decorative circles */}
        <div className="relative mx-auto flex h-12 w-20 items-center justify-center">
          <span className="absolute left-0 size-8 rounded-full bg-green-200 dark:bg-green-900/50" />
          <span className="absolute z-10 size-9 rounded-full bg-purple-200 dark:bg-purple-900/50" />
          <span className="absolute right-0 size-8 rounded-full bg-pink-200 dark:bg-pink-900/50" />
        </div>

        <h3 className="text-lg font-semibold">Still have questions?</h3>
        <p className="text-sm text-muted-foreground">
          Can't find the answer you're looking for? Please chat to our friendly
          team.
        </p>

        <GetInTouchDialog />
      </div>
    </div>
  );
}
