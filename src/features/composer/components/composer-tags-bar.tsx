"use client";

import { useComposer } from "../composer-context";
import { Pill } from "@/components/kibo-ui/pill";

export function ComposerTagsBar() {
  const { tags } = useComposer();

  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 px-4 pb-2">
      {tags.map((tag) => (
        <Pill key={tag} variant="secondary" className="text-xs">
          #{tag}
        </Pill>
      ))}
    </div>
  );
}
