import { cn } from "@/lib/utils";

export function PageHeading(props: {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col @md:flex-row items-center justify-between gap-2",
        props.className,
      )}
    >
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold">{props.title}</h2>
        <p className="text-sm text-muted-foreground">{props.description}</p>
      </div>

      <div className="flex items-center gap-2 shrink-0">{props.actions}</div>
    </div>
  );
}
