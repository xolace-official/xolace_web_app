"use client";

import { ChevronRight, ExternalLink, Minus, Pencil, Save } from "lucide-react";
import { memo, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { truncateText } from "@/utils";

export interface SettingsItemProps {
  label: string;
  value?: string | null;
  description?: string;
  onClick?: () => void;
  onToggle?: (val: boolean) => void;
  toggle?: boolean;
  toggleValue?: boolean | null;
  type?: "input" | "textarea" | "select" | "resources";
  options?: string[];
  isOpen?: boolean;
  onClose?: () => void;
  onSave?: (
    label: string,
    value: string | { label: string; value: string }[],
  ) => void;
  isSaving?: boolean;
  disabled?: boolean;
  resourcesList?: { label: string; value: string }[];
  onResourcesChange?: (resources: { label: string; value: string }[]) => void;
  isLoading?: boolean;
}

const SettingsItem = memo(function SettingsItem({
  label,
  value,
  description,
  toggle,
  toggleValue,
  type,
  options,
  isOpen,
  onClose,
  onSave,
  onClick,
  isSaving,
  disabled,
  resourcesList = [],
  onToggle,
  isLoading,
}: SettingsItemProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [editValue, setEditValue] = useState("");
  const [resources, setResources] = useState(resourcesList);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    setResources(resourcesList);
  }, [resourcesList]);

  const handleEdit = (idx: number, res: { label: string; value: string }) => {
    setEditingIndex(idx);
    setEditLabel(res.label);
    setEditValue(res.value);
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      field: value || "",
    },
  });

  // Watch for changes to show unsaved indicator
  const watchedField = watch("field");
  useEffect(() => {
    setHasUnsavedChanges(watchedField !== (value || ""));
  }, [watchedField, value]);

  //eslint-disable-next-line
  const handleSave = (data: any) => {
    if (type === "resources" && resources) {
      onSave?.(label, resources);
    } else {
      onSave?.(label, data.field);
    }
    setValue("field", "dirty", { shouldDirty: false });
    setHasUnsavedChanges(false);
    onClose?.();
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setHasUnsavedChanges(false);
    setValue("field", value || "", { shouldDirty: false });
    setResources(resourcesList);
    onClose?.();
  };

  const addResource = () => {
    if (resources.length < 3) {
      const idx = resources.length;
      setResources([...resources, { label: "Resource Name", value: "" }]);
      setHasUnsavedChanges(true);
      handleEdit(idx, { label: "Resource Name", value: "" });
    }
  };

  const updateResource = (index: number) => {
    if (!editLabel.trim() || !editValue.trim()) {
      toast.error("Please fill in both fields");
      return;
    }

    // check if editValue is link format
    if (editValue && !editValue.startsWith("https://")) {
      toast.error("Invalid link format. Please include https://");
      return;
    }

    setValue("field", "dirty", { shouldDirty: true });
    const updated = [...resources];
    updated[index] = { label: editLabel, value: editValue };
    setEditingIndex(null);
    setResources(updated);
    setHasUnsavedChanges(true);
  };

  const removeResource = (index: number) => {
    setValue("field", "dirty", { shouldDirty: true });
    setResources(resources.filter((_, i) => i !== index));
    setHasUnsavedChanges(true);
  };

  return (
    <div className="flex w-full flex-col">
      <button
        type="button"
        className={`${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"} group flex w-full items-center justify-between gap-5`}
        onClick={() => {
          if (disabled || isLoading) return;
          if (!toggle) {
            onClick?.();
          }
        }}
      >
        <div>
          <p className="font-medium">{label}</p>
          {description && (
            <p className="text-muted-foreground text-sm">{description}</p>
          )}
        </div>

        {toggle ? (
          <Switch
            checked={toggleValue ?? false}
            onCheckedChange={(val) => onToggle?.(val)}
            disabled={disabled || isLoading}
          />
        ) : (
          <div className="text-muted-foreground flex items-center gap-1 text-sm">
            {value && label === "Display name"
              ? `x/${value}`
              : label === "Resources"
                ? `${resources.length}/3`
                : truncateText(value || "Not Set", 20)}
            <div className="flex items-center gap-1">
              {hasUnsavedChanges && !isSaving && (
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-destructive" />
              )}
              <span className="rounded-full p-1.5 transition-colors duration-200">
                <ChevronRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        )}
      </button>

      {isOpen && !toggle && (
        <form
          onSubmit={handleSubmit(handleSave)}
          className="bg-muted/30 mt-3 space-y-3 rounded-xl border p-3"
        >
          {type === "input" && (
            <Input {...register("field")} placeholder={`Enter ${label}`} />
          )}
          {/* Welcome Message Tip */}
          {label === "Welcome message" && (
            <div className="rounded-lg border border-border p-2">
              <p className="text-destructive flex items-center gap-1 text-xs">
                <span className="font-medium">💡 Tip:</span>
                Add <code className="rounded px-1">{"{username}"}</code> to
                personalize the message
              </p>
            </div>
          )}

          {type === "textarea" && (
            <Textarea
              {...register("field")}
              placeholder={`Enter ${label}`}
              rows={4}
            />
          )}

          {type === "select" && options && (
            <Select
              onValueChange={(val) =>
                setValue("field", val, { shouldDirty: true })
              }
              defaultValue={value || options?.[0]}
            >
              <SelectTrigger className={"w-full"}>
                <SelectValue placeholder={`Select ${label}`} />
              </SelectTrigger>
              <SelectContent className={"w-full"}>
                {options.map((opt, i) => (
                  <SelectItem key={`${i}-${opt}`} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Resources Management */}
          {type === "resources" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Campfire Resources</h4>
                <span className="rounded-full bg-muted px-2 py-1 text-xs">
                  {resources.length}/3 resources
                </span>
              </div>

              {resources.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="mb-2 text-sm">No resources added yet</p>
                  <p className="text-xs">
                    Add helpful links for your community members
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {resources.map((res, idx) => (
                    <div
                      key={`${idx}-${res.label}`}
                      className="flex items-center justify-between gap-3 rounded-lg border  p-3 transition-all duration-200 hover:shadow-sm bg-muted"
                    >
                      {editingIndex === idx ? (
                        <div className="flex flex-1 flex-col gap-3">
                          <Input
                            value={editLabel}
                            onChange={(e) => setEditLabel(e.target.value)}
                            placeholder="Resource name (e.g., Official Website)"
                            className="focus:ring-2"
                          />
                          <div className="flex gap-2">
                            <Input
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              placeholder="https://example.com"
                              className="flex-1 focus:ring-2"
                            />
                            {editValue?.startsWith("https://") && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(editValue, "_blank")}
                                className="px-3"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-1 flex-col">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium ">
                              {res.label}
                            </span>
                            {res.value && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(res.value, "_blank")}
                                className="h-auto p-1"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                          <span className="text-muted-foreground truncate text-xs">
                            {res.value || "No URL provided"}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        {editingIndex === idx ? (
                          <>
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => updateResource(idx)}
                              className="h-auto px-3 py-1.5"
                              disabled={!editLabel.trim() || !editValue.trim()}
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingIndex(null)}
                              className="h-auto px-3 py-1.5"
                            >
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleEdit(idx, res)}
                              className="hover:bg-muted rounded-full p-2 transition-colors"
                              title="Edit resource"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeResource(idx)}
                              className="rounded-full p-2 text-red-500 transition-colors"
                              title="Remove resource"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {resources.length < 3 && (
                <Button
                  type="button"
                  onClick={addResource}
                  variant="outline"
                  className="w-full rounded-lg border-2 border-dashed py-6 transition-all duration-200"
                >
                  + Add Resource ({resources.length}/3)
                </Button>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className={"rounded-full border px-4"}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isDirty || isSaving}
              size="sm"
              className={"rounded-full px-4"}
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
});

export default SettingsItem;
