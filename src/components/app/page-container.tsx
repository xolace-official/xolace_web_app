import { cn } from "@/lib/utils";
import SiteHeader from "./site-header";
import { StickySidebar } from "./sticky-sidebar";

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
    <div
      className={cn("flex flex-col size-full px-4 md:px-0", props.className)}
    >
      <SiteHeader
        disableSidebarToggle={props.disableSidebarToggle}
        title={props.title}
        actions={props.actions}
      />

      <div
        id="scrollable-body"
        className={cn("lg:overflow-y-auto flex-1", props.containerClassName)}
      >
        <div className="flex justify-center items-start gap-6 sm:px-4 py-6">
          <div
            className={cn(
              "w-full max-w-3xl flex flex-col gap-4 md:gap-6 min-w-0",
              props.contentClassName,
            )}
          >
            {props.children}
          </div>

          {props.externalContent && (
            <StickySidebar className="hidden xl:block w-80 shrink-0">
              {props.externalContent}
            </StickySidebar>
          )}
        </div>
      </div>
    </div>
  );
}
