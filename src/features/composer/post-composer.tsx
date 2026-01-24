"use client";

import { ComposerCampfireSelector } from "./components/composer-campfire-selector";
import { ComposerFooter } from "./components/composer-footer";
import { ComposerMediaPreview } from "./components/composer-media-preview";
import { ComposerMoodIndicator } from "./components/composer-mood-indicator";
import { ComposerPromptBanner } from "./components/composer-prompt-banner";
import { ComposerTagsBar } from "./components/composer-tags-bar";
import { ComposerTextarea } from "./components/composer-textarea";
import { ComposerToolbar } from "./components/toolbar/composer-toolbar";
import { ComposerProvider, useComposerForm } from "./composer-context";
import type { ComposerFormValues } from "./composer-types";

export function PostComposer() {
  return (
    <ComposerProvider>
      <ComposerForm />
    </ComposerProvider>
  );
}

function ComposerForm() {
  const { form } = useComposerForm();

  const onSubmit = (data: ComposerFormValues) => {
    console.log("Composer submit:", data);
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-3"
    >
      <ComposerCampfireSelector />
      <ComposerPromptBanner />

      <div className="overflow-hidden rounded-2xl border bg-card">
        <ComposerTextarea />
        <ComposerMediaPreview />
        <ComposerMoodIndicator />
        <ComposerTagsBar />
        <ComposerToolbar />
      </div>

      <ComposerFooter />
    </form>
  );
}
