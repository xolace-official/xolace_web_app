"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MAX_COLLECTION_NAME_LENGTH } from "../collections.constants";
import {
  type CreateCollectionFormValues,
  createCollectionSchema,
} from "../collections.schema";

interface CreateCollectionFormProps {
  onSubmit: (values: CreateCollectionFormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
  /** Pre-fill with entity save after creation */
  submitLabel?: string;
}

export function CreateCollectionForm({
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = "Create & Save",
}: CreateCollectionFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CreateCollectionFormValues>({
    resolver: zodResolver(createCollectionSchema),
    defaultValues: {
      name: "",
      is_pinned: false,
    },
  });

  const nameValue = watch("name");
  const charCount = nameValue?.length || 0;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="collection-name">Collection name</Label>
        <Input
          id="collection-name"
          placeholder="My collection"
          autoComplete="off"
          autoFocus
          {...register("name")}
        />
        <div className="flex items-center justify-between">
          {errors.name ? (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          ) : (
            <span />
          )}
          <p className="text-xs text-muted-foreground">
            {charCount}/{MAX_COLLECTION_NAME_LENGTH}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  );
}
