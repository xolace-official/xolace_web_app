"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarLinks } from "@/constants";
import { ThemeSwitcher } from "@/components/shared/theme-switcher";

/**
 * Renders the application's bottom navigation bar with links and a theme toggle.
 *
 * Maps `sidebarLinks` to render each link's icon and the first word of its label,
 * applies an active style when the current pathname matches the link's route,
 * and hides specific routes on smaller viewports. Also includes a ThemeSwitcher control.
 *
 * @returns A JSX element representing the bottom navigation bar.
 */
function Bottombar() {
  const pathName = usePathname();

  return (
    <section className="bottombar">
      <div className="bottombar_container">
        {sidebarLinks.map((link) => {
          const isActive: boolean =
            (pathName.includes(link.route) && link.route.length > 1) ||
            pathName == link.route;

          const IconComponent = link.icon;
          return (
            <Link
              href={link.route}
              key={link.label}
              className={`bottombar_link ${isActive && "bg-primary-500"} ${link.route === "/profile" && "max-md:hidden"} ${link.route === "/channel" && "max-md:hidden"} ${link.route === "/explore" && "max-md:hidden"} ${link.route === "/collections" && "max-md:hidden"} ${link.route === "https://messaging.xolace.app/dashboard" && "max-md:hidden"} `}
            >
              <IconComponent size="sm" />
              <p className="text-subtle-medium text-light-1 max-sm:hidden">
                {link.label.split(/\s+/)[0]}
              </p>
            </Link>
          );
        })}
        <div className="theme-btn">
          <ThemeSwitcher key={"theme-switcher"} />
        </div>
      </div>
    </section>
  );
}

export default Bottombar;
