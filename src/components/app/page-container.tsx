import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { SidebarToggle } from "./app-sidebar";

/**
 * The main container for a page.
 *
 * It contains the top bar and the content.
 *
 * The top bar contains the title, the actions and the sidebar toggle.
 *
 * The content is the main content of the page.
 *
 * use the `containerClassName` and `contentClassName` props to customize the
 * container and content.
 */
export function PageContainer(props: {
  children: React.ReactNode;
  actions?: React.ReactNode;
  title: React.ReactNode;
  className?: string;

  /**
   * This is the scrollable container
   */
  containerClassName?: string;
  /**
   * This is the content container. I.e, the part that's width constrained and centered.
   */
  contentClassName?: string;
  /**
   * Will be rendered outside the width constraints. You'll need to handle the positioning yourself
   */
  externalContent?: React.ReactNode;
  /**
   * Will disable the sidebar toggle.
   */
  disableSidebarToggle?: boolean;
}) {
  return (
    <div className={cn("flex flex-col size-full", props.className)}>
      <div className="w-full flex items-center justify-between px-3 py-3 bg-background relative z-50 header-height">
        <div className="flex items-center gap-2">
          {!props.disableSidebarToggle && (
            <>
              <SidebarToggle />

              <Separator
                orientation="vertical"
                className="data-[orientation=vertical]:h-5"
              />
            </>
          )}

          <h1 className="text-sm font-medium pl-1 max-w-sm line-clamp-1">
            {props.title}
          </h1>
        </div>

        {props.actions}
      </div>

      <div
        id="scrollable-body"
        className={cn("overflow-y-auto flex-1", props.containerClassName)}
      >
        <div className="flex justify-center items-start gap-6 px-4 py-6">
          <div
            className={cn(
              "w-full max-w-3xl flex flex-col gap-10 min-w-0",
              props.contentClassName,
            )}
          >
            {props.children}
          </div>

          {props.externalContent && (
            <div className="hidden xl:block w-80 shrink-0 sticky top-6">
              {props.externalContent}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
