"use client";

import { MoveLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export const BackButton = () => {
  const router = useRouter();

  return (
    <Button
      variant="ghostDestructive"
      size="sm"
      className={"rounded-full w-8 h-8 border border-border p-2 "}
      onClick={() => router.back()}
    >
      <MoveLeft size={8} />
    </Button>
  );
};
