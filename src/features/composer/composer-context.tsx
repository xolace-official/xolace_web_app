"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { composerSchema } from "./composer-schema";
import { useTagExtraction } from "./hooks/use-tag-extraction";
import { useCursorInsert } from "./hooks/use-cursor-insert";
import { useImageUpload } from "./hooks/use-image-upload";
import { STARTER_PROMPTS } from "./composer-constants";
import type {
  AuthorDisplayMode,
  CampfireSelection,
  ComposerFormValues,
  PostKind,
  PostMood,
} from "./composer-types";

interface ComposerContextValue {
  // Refs
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;

  // Media
  mediaFile: File | null;
  mediaPreviewUrl: string | null;
  setMedia: (file: File | null) => void;
  openFilePicker: () => void;

  // Mood
  mood: PostMood;
  setMood: (mood: PostMood) => void;

  // Tags (extracted from text)
  tags: string[];

  // Campfire
  campfire: CampfireSelection | null;
  setCampfire: (c: CampfireSelection | null) => void;

  // Post tools
  isSensitive: boolean;
  setIsSensitive: (v: boolean) => void;
  autoExpiry: boolean;
  setAutoExpiry: (v: boolean) => void;

  // Display mode
  displayMode: AuthorDisplayMode;
  setDisplayMode: (m: AuthorDisplayMode) => void;

  // Prompt
  activePrompt: string | null;
  dismissPrompt: () => void;
  applyPrompt: (text: string) => void;

  // Derived
  isValid: boolean;
  postKind: PostKind;
  charCount: number;

  // Actions
  insertAtCursor: (text: string) => void;
  reset: () => void;

  // Form
  form: UseFormReturn<ComposerFormValues>;
}

const ComposerContext = createContext<ComposerContextValue | null>(null);

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

  const contentText = form.watch("content_text");
  const mood = form.watch("mood");
  const isSensitive = form.watch("is_sensitive");
  const autoExpiry = form.watch("auto_expiry");
  const authorDisplayMode = form.watch("author_display_mode");
  // Tag extraction — reactively extracts from content
  const { tags, extractTags, clearTags } = useTagExtraction();

  useEffect(() => {
    extractTags(contentText);
  }, [contentText, extractTags]);

  // Image upload
  const { mediaFile, mediaPreviewUrl, setMedia, openFilePicker } =
    useImageUpload();

  // Campfire state (holds object data beyond just the id)
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

  // Cursor insert
  const { insertAtCursor } = useCursorInsert({
    textareaRef,
    form,
  });

  // Setters
  const setMood = useCallback(
    (m: PostMood) => {
      form.setValue("mood", m);
    },
    [form],
  );

  const setIsSensitive = useCallback(
    (v: boolean) => {
      form.setValue("is_sensitive", v);
    },
    [form],
  );

  const setAutoExpiry = useCallback(
    (v: boolean) => {
      form.setValue("auto_expiry", v);
    },
    [form],
  );

  const setDisplayMode = useCallback(
    (m: AuthorDisplayMode) => {
      form.setValue("author_display_mode", m);
    },
    [form],
  );

  // Derived values
  const charCount = contentText.length;
  const isValid = charCount >= 10 && !form.formState.isSubmitting;
  const postKind: PostKind = mediaFile ? "text_with_media" : "text";

  // Reset
  const reset = useCallback(() => {
    form.reset();
    setMedia(null);
    clearTags();
    setCampfire(null);
    setActivePrompt(
      STARTER_PROMPTS[Math.floor(Math.random() * STARTER_PROMPTS.length)].text,
    );
  }, [form, setMedia, clearTags, setCampfire]);

  const value = useMemo<ComposerContextValue>(
    () => ({
      textareaRef,
      mediaFile,
      mediaPreviewUrl,
      setMedia,
      openFilePicker,
      mood,
      setMood,
      tags,
      campfire,
      setCampfire,
      isSensitive,
      setIsSensitive,
      autoExpiry,
      setAutoExpiry,
      displayMode: authorDisplayMode,
      setDisplayMode,
      activePrompt,
      dismissPrompt,
      applyPrompt,
      isValid,
      postKind,
      charCount,
      insertAtCursor,
      reset,
      form,
    }),
    [
      mediaFile,
      mediaPreviewUrl,
      setMedia,
      openFilePicker,
      mood,
      setMood,
      tags,
      campfire,
      setCampfire,
      isSensitive,
      setIsSensitive,
      autoExpiry,
      setAutoExpiry,
      authorDisplayMode,
      setDisplayMode,
      activePrompt,
      dismissPrompt,
      applyPrompt,
      isValid,
      postKind,
      charCount,
      insertAtCursor,
      reset,
      form,
    ],
  );

  return (
    <ComposerContext.Provider value={value}>
      {children}
    </ComposerContext.Provider>
  );
}

export function useComposer() {
  const context = useContext(ComposerContext);
  if (!context) {
    throw new Error("useComposer must be used within a ComposerProvider");
  }
  return context;
}
