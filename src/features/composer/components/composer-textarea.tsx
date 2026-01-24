"use client";

import { Controller } from "react-hook-form";

import { CONTENT_MAX_LENGTH, PLACEHOLDERS } from "../composer-constants";
import { useComposerForm } from "../composer-context";

export function ComposerTextarea() {
  const { textareaRef, form } = useComposerForm();

  return (
    <div className="px-4 pt-4">
      <Controller
        name="content_text"
        control={form.control}
        render={({ field }) => (
          <textarea
            ref={(e) => {
              field.ref(e);
              textareaRef.current = e;
            }}
            value={field.value}
            onChange={(e) => {
              if (e.target.value.length <= CONTENT_MAX_LENGTH) {
                field.onChange(e.target.value);
              }
            }}
            onBlur={field.onBlur}
            placeholder={PLACEHOLDERS[0]}
            className="w-full resize-none border-0 bg-transparent text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
            style={{ fieldSizing: "content" as never, minHeight: "100px" }}
            maxLength={CONTENT_MAX_LENGTH}
            aria-label="Post content"
          />
        )}
      />
    </div>
  );
}
