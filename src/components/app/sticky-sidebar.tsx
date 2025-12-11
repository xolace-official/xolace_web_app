"use client";

import {
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useResizeObserver } from "@/hooks/use-resize-observer";
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

  // Common logic to determine if the sidebar triggers "sticky-bottom"
  const checkSticky = useCallback(() => {
    if (!sidebarRef.current) return;
    const sidebarHeight = sidebarRef.current.offsetHeight;
    const viewportHeight = window.innerHeight;
    // If sidebar is taller than viewport (minus some buffer), stick to bottom
    setIsTall(sidebarHeight + offset * 2 > viewportHeight);
  }, [offset]);

  // Observe element resizing
  useResizeObserver<HTMLDivElement>({
    ref: sidebarRef as RefObject<HTMLDivElement>,
    onResize: checkSticky,
  });

  // Observe window resizing
  useEffect(() => {
    checkSticky();
    window.addEventListener("resize", checkSticky);
    return () => window.removeEventListener("resize", checkSticky);
  }, [checkSticky]);

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
