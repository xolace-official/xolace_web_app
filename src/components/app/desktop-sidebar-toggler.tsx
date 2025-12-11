import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/animate-ui/components/animate/tooltip";
import { Button } from "../ui/button";
import { useSidebar } from "../ui/sidebar";

export const DesktopSidebarToggler = () => {
  const { toggleSidebar, open } = useSidebar();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          className="bg-background absolute top-16 -right-5 hidden h-10 w-10 cursor-pointer items-center justify-center rounded-full border-r border-b-0 border-gray-300 hover:border-gray-600 md:flex dark:border-gray-600/40 dark:hover:border-gray-200"
          onClick={toggleSidebar}
        >
          {open ? (
            <ChevronLeft className="size-5" />
          ) : (
            <ChevronRight className="size-5" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent className="bg-black text-white dark:bg-white dark:text-black">
        <p>{open ? "Collapse Navigation" : "Expand Navigation"}</p>
      </TooltipContent>
    </Tooltip>
  );
};
