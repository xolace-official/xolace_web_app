import { cn } from "@/lib/utils";
import { BackButton } from "@/components/shared/layout/back-button";

/**
 * Render a responsive page heading with an optional description, right-aligned actions, and an optional back button.
 *
 * @param title - The content displayed as the main heading.
 * @param description - Optional content shown below the heading in muted text.
 * @param actions - Optional content rendered on the right side of the heading container.
 * @param className - Optional additional class names merged into the outer container.
 * @param showBackButton - When `true`, renders a BackButton above the heading.
 * @returns The page heading JSX element.
 */
export function PageHeading(props: {
  title: React.ReactNode;
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
          <h2 className="text-3xl font-semibold">{props.title}</h2>
          <p className="text-sm text-muted-foreground">{props.description}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">{props.actions}</div>
    </div>
  );
}