"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface StickySidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  offset?: number;
}

export function StickySidebar({
  children,
  className,
  offset = 24, // 1.5rem aka top-6
  ...props
}: StickySidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isTall, setIsTall] = useState(false);

  useEffect(() => {
    const checkHeight = () => {
      if (!sidebarRef.current) return;
      const sidebarHeight = sidebarRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;
      // If sidebar is taller than viewport (minus some buffer), stick to bottom
      setIsTall(sidebarHeight + offset * 2 > viewportHeight);
    };

    // Initial check
    checkHeight();

    // Re-check on resize and mutation
    const handleResize = () => checkHeight();
    window.addEventListener("resize", handleResize);

    // Observer for content changes
    const observer = new ResizeObserver(checkHeight);
    if (sidebarRef.current) {
      observer.observe(sidebarRef.current);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
    };
  }, [offset]);

  return (
    <div
      ref={sidebarRef}
      className={cn(
        "sticky transition-[top,bottom] duration-200",
        isTall ? "bottom-6" : "top-6",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
