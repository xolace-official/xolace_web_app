"use client";

import { Loader2, Plus, Star } from "lucide-react";
import { useMemo, useState } from "react";
import {
  AnimatedDrawer,
  useAnimatedDrawer,
} from "@/components/builders/animated-drawer";
import { Button } from "@/components/ui/button";
import { DRAWER_STEPS, type DrawerStep } from "../collections.constants";
import type { CreateCollectionFormValues } from "../collections.schema";
import { useSaveToCollection } from "../context/save-to-collection-context";
import { useCollections } from "../hooks/use-collections";
import { useSaveItem } from "../hooks/use-save-item";
import { CollectionListItem } from "./collection-list-item";
import { CreateCollectionForm } from "./create-collection-form";

// ============================================================================
// Step Configuration
// ============================================================================

const STEPS = [
  {
    id: DRAWER_STEPS.SELECT,
    title: "Save to Collection",
    description: "Choose a collection or create a new one",
  },
  {
    id: DRAWER_STEPS.CREATE,
    title: "Create Collection",
    description: "Create a new collection and save",
  },
];

// ============================================================================
// Main Drawer Component
// ============================================================================

export function SaveToCollectionDrawer() {
  const { isOpen, closeSaveDrawer } = useSaveToCollection();

  return (
    <AnimatedDrawer<DrawerStep>
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) closeSaveDrawer();
      }}
      steps={STEPS}
      initialStep={DRAWER_STEPS.SELECT}
    >
      <AnimatedDrawer.Content showHeader maxWidth="400px">
        <AnimatedDrawer.StepContainer>
          <AnimatedDrawer.Step stepId={DRAWER_STEPS.SELECT}>
            <SelectStep />
          </AnimatedDrawer.Step>
          <AnimatedDrawer.Step stepId={DRAWER_STEPS.CREATE}>
            <CreateStep />
          </AnimatedDrawer.Step>
        </AnimatedDrawer.StepContainer>
      </AnimatedDrawer.Content>
    </AnimatedDrawer>
  );
}

// ============================================================================
// Select Step
// ============================================================================

function SelectStep() {
  const { goToStep } = useAnimatedDrawer<DrawerStep>();
  const { target, closeSaveDrawer } = useSaveToCollection();
  const [savingToId, setSavingToId] = useState<string | null>(null);

  const { collections, isLoading: isLoadingCollections } = useCollections({
    simple: true,
    limit: 20,
  });

  const { mutate: saveItem, isPending: isSaving } = useSaveItem({
    onSuccess: () => {
      setSavingToId(null);
      closeSaveDrawer();
    },
    onError: () => {
      setSavingToId(null);
    },
  });

  // Sort to put Favorites first
  const sortedCollections = useMemo(() => {
    return [...collections].sort((a, b) => {
      const aIsFavorites = a.name.toLowerCase() === "favorites";
      const bIsFavorites = b.name.toLowerCase() === "favorites";
      if (aIsFavorites && !bIsFavorites) return -1;
      if (!aIsFavorites && bIsFavorites) return 1;
      if (a.is_pinned && !b.is_pinned) return -1;
      if (!a.is_pinned && b.is_pinned) return 1;
      return 0;
    });
  }, [collections]);

  const handleSaveToCollection = (collectionId: string) => {
    if (!target) return;

    setSavingToId(collectionId);
    saveItem({
      entity_type: target.entityType,
      entity_id: target.entityId,
      collection_id: collectionId,
    });
  };

  const handleQuickSaveToFavorites = () => {
    if (!target) return;

    setSavingToId("favorites");
    saveItem({
      entity_type: target.entityType,
      entity_id: target.entityId,
      // Not providing collection_id or collection_name defaults to Favorites
    });
  };

  return (
    <AnimatedDrawer.Body className="space-y-3 px-4 pb-6">
      {/* Quick save to Favorites */}
      {!collections.some((c) => c.name.toLowerCase() === "favorites") && (
        <button
          type="button"
          onClick={handleQuickSaveToFavorites}
          disabled={isSaving}
          className="flex w-full items-center gap-3 rounded-xl bg-amber-500/10 px-4 py-3 text-left transition-colors hover:bg-amber-500/20"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/20">
            <Star className="h-5 w-5 text-amber-500" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground">Favorites</p>
            <p className="text-sm text-muted-foreground">Quick save</p>
          </div>
          {savingToId === "favorites" && (
            <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
          )}
        </button>
      )}

      {/* Collection list */}
      {isLoadingCollections ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : sortedCollections.length > 0 ? (
        <div className="space-y-1">
          {sortedCollections.map((collection) => (
            <CollectionListItem
              key={collection.id}
              collection={collection}
              onClick={() => handleSaveToCollection(collection.id)}
              isLoading={savingToId === collection.id}
            />
          ))}
        </div>
      ) : (
        <div className="py-6 text-center">
          <p className="text-sm text-muted-foreground">No collections yet</p>
        </div>
      )}

      {/* Create new button */}
      <Button
        variant="outline"
        className="w-full"
        onClick={() => goToStep(DRAWER_STEPS.CREATE)}
      >
        <Plus className="mr-2 h-4 w-4" />
        Create new collection
      </Button>
    </AnimatedDrawer.Body>
  );
}

// ============================================================================
// Create Step
// ============================================================================

function CreateStep() {
  const { goBack } = useAnimatedDrawer<DrawerStep>();
  const { target, closeSaveDrawer } = useSaveToCollection();

  const { mutate: saveItem, isPending: isSaving } = useSaveItem({
    onSuccess: () => {
      closeSaveDrawer();
    },
  });

  const handleCreate = (values: CreateCollectionFormValues) => {
    if (!target) return;

    // Save with collection_name to auto-create
    saveItem({
      entity_type: target.entityType,
      entity_id: target.entityId,
      collection_name: values.name,
    });
  };

  return (
    <AnimatedDrawer.Body className="px-4 pb-6">
      <CreateCollectionForm
        onSubmit={handleCreate}
        onCancel={goBack}
        isLoading={isSaving}
      />
    </AnimatedDrawer.Body>
  );
}
