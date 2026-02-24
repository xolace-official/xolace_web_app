"use client";

import { Plus } from "lucide-react";
import { type ReactNode, useState } from "react";
import { AnimatedDrawer } from "@/components/builders/animated-drawer";
import { Button } from "@/components/ui/button";
import type { CreateCollectionFormValues } from "../collections.schema";
import { useCollections } from "../hooks/use-collections";
import { useCreateCollection } from "../hooks/use-create-collection";
import { CollectionCard } from "./collection-card";
import { CollectionEmptyState } from "./collection-empty-state";
import { CollectionSkeletonGrid } from "./collection-skeleton";
import { CreateCollectionForm } from "./create-collection-form";

export function CollectionsGrid() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { collections, isLoading } = useCollections({ simple: false });

  const { mutate: createCollection, isPending: isCreating } =
    useCreateCollection({
      onSuccess: () => {
        setIsCreateOpen(false);
      },
    });

  const handleCreate = (values: CreateCollectionFormValues) => {
    createCollection(values);
  };

  if (isLoading) {
    return (
      <CollectionsGridLayout onCreateClick={() => setIsCreateOpen(true)}>
        <CollectionSkeletonGrid />
        <CreateDrawer
          isOpen={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          onSubmit={handleCreate}
          isLoading={isCreating}
        />
      </CollectionsGridLayout>
    );
  }

  if (collections.length === 0) {
    return (
      <CollectionsGridLayout onCreateClick={() => setIsCreateOpen(true)}>
        <CollectionEmptyState onCreateClick={() => setIsCreateOpen(true)} />
        <CreateDrawer
          isOpen={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          onSubmit={handleCreate}
          isLoading={isCreating}
        />
      </CollectionsGridLayout>
    );
  }

  return (
    <CollectionsGridLayout onCreateClick={() => setIsCreateOpen(true)}>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {collections.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>
      <CreateDrawer
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSubmit={handleCreate}
        isLoading={isCreating}
      />
    </CollectionsGridLayout>
  );
}

// Internal layout component with header action
interface CollectionsGridLayoutProps {
  children: ReactNode;
  onCreateClick: () => void;
}

function CollectionsGridLayout({
  children,
  onCreateClick,
}: CollectionsGridLayoutProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={onCreateClick}>
          <Plus className="mr-2 h-4 w-4" />
          New
        </Button>
      </div>
      {children}
    </div>
  );
}

// Internal drawer component
interface CreateDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: CreateCollectionFormValues) => void;
  isLoading: boolean;
}

function CreateDrawer({
  isOpen,
  onOpenChange,
  onSubmit,
  isLoading,
}: CreateDrawerProps) {
  return (
    <AnimatedDrawer
      open={isOpen}
      onOpenChange={onOpenChange}
      steps={[{ id: "create", title: "Create Collection" }]}
      initialStep="create"
    >
      <AnimatedDrawer.Content showHeader maxWidth="400px">
        <AnimatedDrawer.Body className="px-4 pb-6">
          <CreateCollectionForm
            onSubmit={onSubmit}
            onCancel={() => onOpenChange(false)}
            isLoading={isLoading}
            submitLabel="Create"
          />
        </AnimatedDrawer.Body>
      </AnimatedDrawer.Content>
    </AnimatedDrawer>
  );
}
