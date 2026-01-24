import { useCallback, type RefObject } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { ComposerFormValues } from "../composer-types";

interface UseCursorInsertOptions {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  form: UseFormReturn<ComposerFormValues>;
}

export function useCursorInsert({ textareaRef, form }: UseCursorInsertOptions) {
  const insertAtCursor = useCallback(
    (text: string) => {
      const textarea = textareaRef.current;
      const currentContent = form.getValues("content_text");

      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newContent =
          currentContent.substring(0, start) +
          text +
          currentContent.substring(end);

        form.setValue("content_text", newContent, { shouldValidate: true });

        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + text.length;
          textarea.focus();
        }, 0);
      } else {
        const newContent = currentContent ? currentContent + text : text;
        form.setValue("content_text", newContent, { shouldValidate: true });
      }
    },
    [textareaRef, form],
  );

  return { insertAtCursor };
}
