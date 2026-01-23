"use client";

import { useCallback } from "react";
import { useComposer } from "../composer-context";
import { CONTENT_MAX_LENGTH, PLACEHOLDERS } from "../composer-constants";

export function ComposerTextarea() {
  const { textareaRef, form } = useComposer();
  const content = form.watch("content_text");

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      if (value.length <= CONTENT_MAX_LENGTH) {
        form.setValue("content_text", value, { shouldValidate: true });
      }
    },
    [form],
  );

  return (
    <div className="px-4 pt-4">
      <textarea
        ref={textareaRef}
        value={content}
        onChange={handleChange}
        placeholder={PLACEHOLDERS[0]}
        className="w-full resize-none border-0 bg-transparent text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
        style={{ fieldSizing: "content" as never, minHeight: "100px" }}
        maxLength={CONTENT_MAX_LENGTH}
        aria-label="Post content"
      />
    </div>
  );
}
