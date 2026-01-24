"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { composerSchema } from "./composer-schema";
import { useCursorInsert } from "./hooks/use-cursor-insert";
import { useImageUpload } from "./hooks/use-image-upload";
import { STARTER_PROMPTS } from "./composer-constants";
import type {
  CampfireSelection,
  ComposerFormValues,
  PostKind,
} from "./composer-types";

// --- Form Context (stable: form instance, ref, insert action) ---

interface ComposerFormContextValue {
  form: UseFormReturn<ComposerFormValues>;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  insertAtCursor: (text: string) => void;
}

const ComposerFormContext = createContext<ComposerFormContextValue | null>(
  null,
);

// --- UI Context (updates on discrete user actions, NOT keystrokes) ---

interface ComposerUIContextValue {
  mediaFile: File | null;
  mediaPreviewUrl: string | null;
  setMedia: (file: File | null) => void;
  openFilePicker: () => void;
  campfire: CampfireSelection | null;
  setCampfire: (c: CampfireSelection | null) => void;
  activePrompt: string | null;
  dismissPrompt: () => void;
  applyPrompt: (text: string) => void;
  postKind: PostKind;
  reset: () => void;
}

const ComposerUIContext = createContext<ComposerUIContextValue | null>(null);

// --- Provider ---

export function ComposerProvider({ children }: { children: React.ReactNode }) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const form = useForm<ComposerFormValues>({
    resolver: zodResolver(composerSchema),
    defaultValues: {
      content_text: "",
      mood: "neutral",
      author_display_mode: "attributed",
      is_sensitive: false,
      auto_expiry: false,
      campfire_id: null,
    },
  });

  // Cursor insert
  const { insertAtCursor } = useCursorInsert({ textareaRef, form });

  // Image upload
  const { mediaFile, mediaPreviewUrl, setMedia, openFilePicker } =
    useImageUpload();

  // Campfire state
  const [campfire, setCampfireState] = useState<CampfireSelection | null>(null);

  const setCampfire = useCallback(
    (c: CampfireSelection | null) => {
      setCampfireState(c);
      form.setValue("campfire_id", c?.id ?? null);
    },
    [form],
  );

  // Prompt state
  const [activePrompt, setActivePrompt] = useState<string | null>(
    () =>
      STARTER_PROMPTS[Math.floor(Math.random() * STARTER_PROMPTS.length)].text,
  );

  const dismissPrompt = useCallback(() => {
    setActivePrompt(null);
  }, []);

  const applyPrompt = useCallback(
    (text: string) => {
      form.setValue("content_text", text, { shouldValidate: true });
      setActivePrompt(null);
      setTimeout(() => textareaRef.current?.focus(), 0);
    },
    [form],
  );

  // Derived
  const postKind: PostKind = mediaFile ? "text_with_media" : "text";

  // Reset
  const reset = useCallback(() => {
    form.reset();
    setMedia(null);
    setCampfire(null);
    setActivePrompt(
      STARTER_PROMPTS[Math.floor(Math.random() * STARTER_PROMPTS.length)].text,
    );
  }, [form, setMedia, setCampfire]);

  // Form context value (stable — form/ref/insertAtCursor don't change on keystrokes)
  const formValue = useMemo<ComposerFormContextValue>(
    () => ({ form, textareaRef, insertAtCursor }),
    [form, insertAtCursor],
  );

  // UI context value (updates only on discrete user actions)
  const uiValue = useMemo<ComposerUIContextValue>(
    () => ({
      mediaFile,
      mediaPreviewUrl,
      setMedia,
      openFilePicker,
      campfire,
      setCampfire,
      activePrompt,
      dismissPrompt,
      applyPrompt,
      postKind,
      reset,
    }),
    [
      mediaFile,
      mediaPreviewUrl,
      setMedia,
      openFilePicker,
      campfire,
      setCampfire,
      activePrompt,
      dismissPrompt,
      applyPrompt,
      postKind,
      reset,
    ],
  );

  return (
    <ComposerFormContext.Provider value={formValue}>
      <ComposerUIContext.Provider value={uiValue}>
        {children}
      </ComposerUIContext.Provider>
    </ComposerFormContext.Provider>
  );
}

// --- Hooks ---

export function useComposerForm() {
  const context = useContext(ComposerFormContext);
  if (!context) {
    throw new Error("useComposerForm must be used within a ComposerProvider");
  }
  return context;
}

export function useComposerUI() {
  const context = useContext(ComposerUIContext);
  if (!context) {
    throw new Error("useComposerUI must be used within a ComposerProvider");
  }
  return context;
}
