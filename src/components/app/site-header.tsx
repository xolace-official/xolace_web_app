import { Separator } from "../ui/separator";
import { SidebarToggle } from "./app-sidebar";

const SiteHeader = (props: {
  disableSidebarToggle?: boolean;
  title: React.ReactNode;
  actions?: React.ReactNode;
}) => {
  return (
    <div className="sticky top-0 w-full flex items-center justify-between px-3 py-3 bg-background lg:relative z-50 header-height">
      <div className="flex items-center gap-2 w-full">
        {!props.disableSidebarToggle && (
          <>
            <SidebarToggle />

            <Separator
              orientation="vertical"
              className="data-[orientation=vertical]:h-5"
            />
          </>
        )}

        <h1 className="text-sm font-medium pl-1 w-full line-clamp-1">
          {props.title}
        </h1>
      </div>

      {props.actions}
    </div>
  );
};

export default SiteHeader;
