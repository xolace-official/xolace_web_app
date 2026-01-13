"use client";

import { MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export const BackButton = ({
  fallbackHref = "/",
}: {
  fallbackHref?: string;
}) => {
  const router = useRouter();

  return (
    <Button
      variant="ghostDestructive"
      size="sm"
      className={"rounded-full w-8 h-8 border border-border p-2 "}
      onClick={() => {
        if (window.history.length > 1) {
          router.back();
        } else {
          router.push(fallbackHref);
        }
      }}
    >
      <MoveLeft size={8} />
    </Button>
  );
};
