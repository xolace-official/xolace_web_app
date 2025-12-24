import Link from "next/link";
import { LEGAL_LINKS } from "@/constants/links";
import { cn } from "@/lib/utils";

type LegalFooterProps = {
  /** Hide on small screens by default (sidebar-style behavior) */
  hideOnMobile?: boolean;
  className?: string;
};

export function LegalFooter({
  hideOnMobile = true,
  className = "",
}: LegalFooterProps) {
  return (
    <div className={cn("flex-1", hideOnMobile && "max-sm:hidden", className)}>
      <div className="flex h-full flex-col justify-end">
        <div className="flex flex-wrap justify-center gap-2 p-2 text-xs text-slate-600/60 dark:text-slate-400/60">
          {LEGAL_LINKS.map((link) => (
            <span key={link.label}>
              <Link
                href={link.href}
                className="hover:text-slate-200 hover:underline"
                {...(link.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {link.label}
              </Link>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
