"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import MoonIcon from "./MoonIcon";
import SunIcon from "./SunIcon";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, theme, resolvedTheme } = useTheme();

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }

  const toggleTheme = (theme: string) => {
    const switchTheme = () => setTheme(theme);

    if (!document.startViewTransition) {
      switchTheme();
      return;
    }

    document.startViewTransition(switchTheme);
  };

  return (
    <button
      type="button"
      className="cursor-pointer"
      aria-label="Toggle Dark Mode"
      onClick={() =>
        toggleTheme(
          theme === "dark" || resolvedTheme === "dark" ? "light" : "dark",
        )
      }
    >
      {(mounted && theme === "dark") || resolvedTheme === "dark" ? (
        <SunIcon className="fill-gray-700/10" />
      ) : (
        <MoonIcon className={" "} />
      )}
    </button>
  );
}
