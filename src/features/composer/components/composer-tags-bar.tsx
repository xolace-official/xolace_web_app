"use client";

import { useMemo } from "react";
import { useWatch } from "react-hook-form";
import { Pill } from "@/components/kibo-ui/pill";
import { MAX_TAGS } from "../composer-constants";
import { useComposerForm } from "../composer-context";

const TAG_REGEX = /#(\w+)/g;

export function ComposerTagsBar() {
  const { form } = useComposerForm();
  const contentText = useWatch({ control: form.control, name: "content_text" });

  const tags = useMemo(() => {
    const matches = (contentText || "").match(TAG_REGEX) || [];
    return [...new Set(matches.map((m) => m.slice(1)))].slice(0, MAX_TAGS);
  }, [contentText]);

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
