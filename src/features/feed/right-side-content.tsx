import Link from "next/link";

export const RightSideContent = () => {
  return (
    <div className="space-y-4">
      <div className="bg-card border p-4 rounded-xl shadow-xs">
        <h3 className="font-semibold mb-2">Trending</h3>
        <div className="space-y-2">
          <div className="h-2 bg-muted rounded w-3/4" />
          <div className="h-2 bg-muted rounded w-1/2" />
        </div>
      </div>
      <div className="bg-card border p-4 rounded-xl shadow-xs h-64" />
      <div className="bg-card border p-4 rounded-xl shadow-xs h-64" />

      <div className="flex-1 max-sm:hidden">
        <div className="flex h-full flex-col justify-end">
          <div className="flex flex-wrap justify-center gap-2 p-2 text-xs text-slate-600/60 dark:text-slate-400/60">
            <span>
              <Link className="hover:text-slate-200 hover:underline" href="#">
                Xolace Rules
              </Link>
            </span>
            <span>
              <Link
                className="hover:text-slate-200 hover:underline"
                href="/policies"
              >
                Privacy Policy
              </Link>
            </span>
            <span>
              <Link
                className="hover:text-slate-200 hover:underline"
                href="/policy"
              >
                User Agreement
              </Link>
            </span>
            <span>
              <Link className="hover:text-slate-200 hover:underline" href="#">
                Xolace, Inc. © 2025. All rights reserved.
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
