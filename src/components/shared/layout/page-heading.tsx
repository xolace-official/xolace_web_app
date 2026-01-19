import { cn } from "@/lib/utils";
import { BackButton } from "@/components/shared/layout/back-button";

export function PageHeading(props: {
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  showBackButton?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col @md:flex-row items-center justify-between gap-2",
        props.className,
      )}
    >
      <div className={"flex flex-col gap-2 md:gap-4 sticky top-0"}>
        {props.showBackButton && <BackButton />}
        <div className="space-y-2">
          {props.title && (
            <h2 className="text-3xl font-semibold">{props.title}</h2>
          )}
          {props.description && (
            <p className="text-sm text-muted-foreground">{props.description}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">{props.actions}</div>
    </div>
  );
}
