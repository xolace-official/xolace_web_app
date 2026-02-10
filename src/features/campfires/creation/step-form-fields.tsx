"use client";

import { ImageIcon, Trash2, Upload } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import {
  type ControllerRenderProps,
  type UseFormReturn,
  useWatch,
} from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { campfire_realms } from "@/features/campfires";
import { cn } from "@/lib/utils";
import type { FullFormType } from "@/validation/create-campfire";
import {
  type CampfireLane,
  campfireFieldsByStep,
  MAX_WORDS,
} from "@/validation/create-campfire";

const ImageCropper = dynamic(() => import("./image-cropper"), { ssr: false });

const WHITESPACE_RE = /\s+/;

interface StepFormFieldsProps {
  step: number;
  form: UseFormReturn<FullFormType>;
  bannerBlob: Blob | null;
  setBannerBlob: (blob: Blob | null) => void;
  iconBlob: Blob | null;
  setIconBlob: (blob: Blob | null) => void;
  bannerBlobType: string;
  setBannerBlobType: (type: string) => void;
  iconBlobType: string;
  setIconBlobType: (type: string) => void;
  wordCount: number;
  setWordCount: (count: number) => void;
}

/**
 * Render dynamic form fields for a specific step of the campfire creation flow.
 *
 * Renders inputs, textareas (with description word-count enforcement), selects (realm/lane), rule checkboxes (with a max selection), and file upload flows for banner and icon images including cropping, preview, re-crop and remove actions. Integrates with the provided react-hook-form instance and external blob state for image previews.
 *
 * @param step - Current step index (1-based) to determine which fields to render
 * @param form - react-hook-form controller (UseFormReturn<FullFormType>) used to read and write field values
 * @param bannerBlob - Current banner image blob used for previewing and uploading; null when absent
 * @param setBannerBlob - Setter to update the banner blob state
 * @param iconBlob - Current icon image blob used for previewing and uploading; null when absent
 * @param setIconBlob - Setter to update the icon blob state
 * @param setBannerBlobType - Setter to record the MIME type of the selected banner file
 * @param setIconBlobType - Setter to record the MIME type of the selected icon file
 * @param wordCount - Current word count for the description field
 * @param setWordCount - Setter to update the description word count
 * @returns A JSX element containing the rendered form fields for the specified step
 */
export default function StepFormFields({
  step,
  form,
  bannerBlob,
  setBannerBlob,
  iconBlob,
  setIconBlob,
  setBannerBlobType,
  setIconBlobType,
  wordCount,
  setWordCount,
}: StepFormFieldsProps) {
  const bannerUrl = useWatch({ control: form.control, name: "banner_url" });
  const iconUrl = useWatch({ control: form.control, name: "icon_url" });
  const realm = useWatch({ control: form.control, name: "realm" });

  // Stable object URLs for the original file — persists across re-crops, revoked on replace/remove/unmount
  const bannerFileUrlRef = useRef<string | null>(null);
  const iconFileUrlRef = useRef<string | null>(null);

  // Preview URLs for cropped blob display — computed once per blob, revoked on change/unmount
  const [bannerPreviewUrl, setBannerPreviewUrl] = useState<string | null>(null);
  const [iconPreviewUrl, setIconPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (bannerBlob) {
      const url = URL.createObjectURL(bannerBlob);
      setBannerPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setBannerPreviewUrl(null);
  }, [bannerBlob]);

  useEffect(() => {
    if (iconBlob) {
      const url = URL.createObjectURL(iconBlob);
      setIconPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setIconPreviewUrl(null);
  }, [iconBlob]);

  // Revoke file URL refs on unmount
  useEffect(() => {
    return () => {
      if (bannerFileUrlRef.current) {
        URL.revokeObjectURL(bannerFileUrlRef.current);
      }
      if (iconFileUrlRef.current) {
        URL.revokeObjectURL(iconFileUrlRef.current);
      }
    };
  }, []);

  const laneOptions = useMemo(() => {
    if (!realm) return [];
    const selectedRealm = campfire_realms.find((r) => r.key === realm);
    if (!selectedRealm) return [];
    return selectedRealm.lanes.map(([key, name]) => ({
      value: key,
      label: name.toUpperCase(),
    }));
  }, [realm]);

  const renderFieldControl = (
    config: {
      name: string;
      type: string;
      placeholder?: string;
      options?: { value: string; label: string }[];
    },
    field: ControllerRenderProps<FullFormType, keyof FullFormType>,
  ): ReactNode => {
    const { name: fieldName, type: fieldType, placeholder, options } = config;

    switch (fieldType) {
      case "input":
        return (
          <Input
            placeholder={placeholder}
            {...field}
            value={typeof field.value === "string" ? field.value : ""}
          />
        );

      case "textarea":
        if (fieldName === "description") {
          return (
            <Textarea
              placeholder={placeholder}
              value={typeof field.value === "string" ? field.value : ""}
              onChange={(e) => {
                const value = e.target.value;
                const words = value.trim().split(WHITESPACE_RE).filter(Boolean);

                if (words.length <= MAX_WORDS) {
                  field.onChange(e);
                  setWordCount(words.length);
                } else {
                  const truncated = words.slice(0, MAX_WORDS).join(" ");
                  field.onChange(truncated);
                  setWordCount(MAX_WORDS);
                }
              }}
            />
          );
        }
        return (
          <Textarea
            placeholder={placeholder}
            {...field}
            value={typeof field.value === "string" ? field.value : ""}
          />
        );

      case "select":
        if (!options) return null;
        return (
          <Select
            onValueChange={(value) => {
              field.onChange(value);
              if (fieldName === "realm") {
                form.setValue("lane", "" as CampfireLane);
              }
            }}
            value={typeof field.value === "string" ? field.value : ""}
            disabled={fieldName === "lane" && !realm}
          >
            <SelectTrigger className="w-full rounded-lg">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="w-full max-w-(--radix-select-trigger-width)">
              {(fieldName === "lane" ? laneOptions : options).map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "file": {
        if (fieldName === "banner_url") {
          if (bannerPreviewUrl) {
            return (
              <div className="relative overflow-hidden rounded-lg border">
                <Image
                  src={bannerPreviewUrl}
                  alt="Banner preview"
                  height={128}
                  width={1028}
                  className="h-28 w-full object-cover"
                />
                <div className="flex items-center gap-2 p-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => setBannerBlob(null)}
                  >
                    <ImageIcon className="size-4" />
                    Re&#45;crop
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive ml-auto gap-2"
                    onClick={() => {
                      if (bannerFileUrlRef.current) {
                        URL.revokeObjectURL(bannerFileUrlRef.current);
                        bannerFileUrlRef.current = null;
                      }
                      field.onChange("");
                      setBannerBlob(null);
                    }}
                  >
                    <Trash2 className="size-4" />
                    Remove
                  </Button>
                </div>
              </div>
            );
          }
          if (bannerUrl) {
            return (
              <ImageCropper
                key="banner"
                src={bannerUrl || "/placeholder.svg"}
                aspect={1028 / 128}
                output={{ width: 1028, height: 128 }}
                zoomLabel="Zoom"
                onCancel={() => {
                  if (bannerFileUrlRef.current) {
                    URL.revokeObjectURL(bannerFileUrlRef.current);
                    bannerFileUrlRef.current = null;
                  }
                  field.onChange("");
                  setBannerBlob(null);
                }}
                onCropped={(blob) => setBannerBlob(blob)}
              />
            );
          }
          return (
            <label
              htmlFor="banner-url"
              className={cn(
                "flex h-40 cursor-pointer items-center justify-center rounded-lg border",
                "bg-muted/40 hover:bg-muted/60 transition",
              )}
            >
              <Input
                id="banner-url"
                type="file"
                accept="image/*"
                placeholder={placeholder}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setBannerBlobType(file.type);
                    if (bannerFileUrlRef.current) {
                      URL.revokeObjectURL(bannerFileUrlRef.current);
                    }
                    const fileUrl = URL.createObjectURL(file);
                    bannerFileUrlRef.current = fileUrl;
                    field.onChange(fileUrl);
                  }
                }}
                className="sr-only"
              />
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <Upload className="size-4" />
                Upload banner image
              </div>
            </label>
          );
        }

        if (fieldName === "icon_url") {
          if (iconPreviewUrl) {
            return (
              <div className="flex items-center gap-4">
                <Image
                  src={iconPreviewUrl}
                  height={64}
                  width={64}
                  alt="Icon preview"
                  className="h-16 w-16 rounded-md border object-cover"
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => setIconBlob(null)}
                  >
                    <ImageIcon className="size-4" />
                    Re&#45;crop
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive gap-2"
                    onClick={() => {
                      if (iconFileUrlRef.current) {
                        URL.revokeObjectURL(iconFileUrlRef.current);
                        iconFileUrlRef.current = null;
                      }
                      field.onChange("");
                      setIconBlob(null);
                    }}
                  >
                    <Trash2 className="size-4" />
                    Remove
                  </Button>
                </div>
              </div>
            );
          }
          if (iconUrl) {
            return (
              <ImageCropper
                key="icon"
                src={iconUrl || "/placeholder.svg"}
                aspect={1}
                output={{ width: 256, height: 256 }}
                zoomLabel="Zoom"
                onCancel={() => {
                  if (iconFileUrlRef.current) {
                    URL.revokeObjectURL(iconFileUrlRef.current);
                    iconFileUrlRef.current = null;
                  }
                  field.onChange("");
                  setIconBlob(null);
                }}
                onCropped={(blob) => setIconBlob(blob)}
              />
            );
          }
          return (
            <label
              htmlFor="icon-url"
              className={cn(
                "flex h-32 cursor-pointer items-center justify-center rounded-lg border border-dashed",
                "bg-muted/40 hover:bg-muted/60 transition",
              )}
            >
              <Input
                id="icon-url"
                type="file"
                accept="image/*"
                placeholder={placeholder}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setIconBlobType(file.type);
                    if (iconFileUrlRef.current) {
                      URL.revokeObjectURL(iconFileUrlRef.current);
                    }
                    const fileUrl = URL.createObjectURL(file);
                    iconFileUrlRef.current = fileUrl;
                    field.onChange(fileUrl);
                  }
                }}
                className="sr-only"
              />
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <Upload className="size-4" />
                Upload icon image
              </div>
            </label>
          );
        }

        return null;
      }

      default:
        return null;
    }
  };

  return (
    <>
      {campfireFieldsByStep[step - 1].map(
        ({ name, label, type, placeholder, options }) => (
          <FormField
            key={name}
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                  <div>
                    {renderFieldControl(
                      { name, type, placeholder, options },
                      field,
                    )}
                  </div>
                </FormControl>
                <div className="flex items-center justify-between">
                  <div className="text-destructive flex-1 text-xs wrap-break-word">
                    <FormMessage />
                  </div>
                  {type === "textarea" && name === "description" ? (
                    <p className="text-muted-foreground text-right text-xs">
                      {wordCount} / {MAX_WORDS} words
                    </p>
                  ) : null}
                </div>
              </FormItem>
            )}
          />
        ),
      )}
    </>
  );
}