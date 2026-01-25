"use client";

import { PageContainer } from "@/components/app/page-container";
import { Button } from "@/components/ui/button";
import { useCollections, useCreateCollection } from "@/features/collections";
import { CollectionCard } from "@/features/collections/components/collection-card";
import { CollectionEmptyState } from "@/features/collections/components/collection-empty-state";
import { CollectionSkeletonGrid } from "@/features/collections/components/collection-skeleton";
import { Plus } from "lucide-react";
import * as React from "react";
import { AnimatedDrawer } from "@/components/builders/animated-drawer";
import { CreateCollectionForm } from "@/features/collections/components/create-collection-form";
import type { CreateCollectionFormValues } from "@/features/collections";

export const CollectionsPage = () => {
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const { data, isLoading } = useCollections({ simple: false });

  const { mutate: createCollection, isPending: isCreating } =
    useCreateCollection({
      onSuccess: () => {
        setIsCreateOpen(false);
      },
    });

  const collections = data?.data ?? [];

  const handleCreate = (values: CreateCollectionFormValues) => {
    createCollection(values);
  };

  return (
    <PageContainer
      title="Collections"
      actions={
        <Button size="sm" onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New
        </Button>
      }
    >
      {isLoading ? (
        <CollectionSkeletonGrid />
      ) : collections.length === 0 ? (
        <CollectionEmptyState onCreateClick={() => setIsCreateOpen(true)} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      )}

      {/* Create Collection Drawer */}
      <AnimatedDrawer
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        steps={[{ id: "create", title: "Create Collection" }]}
        initialStep="create"
      >
        <AnimatedDrawer.Content showHeader maxWidth="400px">
          <AnimatedDrawer.Body className="px-4 pb-6">
            <CreateCollectionForm
              onSubmit={handleCreate}
              onCancel={() => setIsCreateOpen(false)}
              isLoading={isCreating}
              submitLabel="Create"
            />
          </AnimatedDrawer.Body>
        </AnimatedDrawer.Content>
      </AnimatedDrawer>
    </PageContainer>
  );
};
