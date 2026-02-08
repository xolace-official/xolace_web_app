"use client";

import { useWatch, type UseFormReturn } from "react-hook-form";
import dynamic from "next/dynamic";
import Image from "next/image";
import { ImageIcon, Trash2, Upload } from "lucide-react";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  campfireFieldsByStep,
  CampfireLane,
  MAX_WORDS,
} from "@/validation/create-campfire";
import type { FullFormType } from "@/validation/create-campfire";
import { campfire_realms } from "@/features/campfires";

const ImageCropper = dynamic(() => import("./image-cropper"), { ssr: false });

const MAX_RULES = 4;

const RULE_OPTIONS = [
  { id: "no_spam", label: "No spam or self-promotion" },
  { id: "be_respectful", label: "Be respectful" },
  { id: "stay_on_topic", label: "Stay on topic" },
  { id: "no_hate", label: "No hate speech or bullying" },
  { id: "use_search", label: "Use the search before posting" },
  { id: "no_politics", label: "No political discussions" },
  { id: "english_only", label: "English only" },
  { id: "no_piracy", label: "No piracy or illegal content" },
];

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

  const laneOptions = (() => {
    if (!realm) return [];
    const selectedRealm = campfire_realms.find((r) => r.key === realm);
    if (!selectedRealm) return [];
    return selectedRealm.lanes.map(([key, name]) => ({
      value: key,
      label: name.toUpperCase(),
    }));
  })();

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
                    {type === "input" ? (
                      <Input placeholder={placeholder} {...field} />
                    ) : null}
                    {type === "textarea" && name === "description" ? (
                      <>
                        <Textarea
                          placeholder={placeholder}
                          value={field.value}
                          onChange={(e) => {
                            const value = e.target.value;
                            const words = value
                              .trim()
                              .split(/\s+/)
                              .filter(Boolean);

                            if (words.length <= MAX_WORDS) {
                              field.onChange(e);
                              setWordCount(words.length);
                            } else {
                              const truncated = words
                                .slice(0, MAX_WORDS)
                                .join(" ");
                              field.onChange(truncated);
                              setWordCount(MAX_WORDS);
                            }
                          }}
                        />
                      </>
                    ) : type === "textarea" ? (
                      <Textarea placeholder={placeholder} {...field} />
                    ) : null}

                    {type === "select" && options ? (
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          if (name === "realm") {
                            form.setValue("lane", "" as CampfireLane);
                          }
                        }}
                        value={
                          typeof field.value === "string" ? field.value : ""
                        }
                        disabled={name === "lane" && !realm}
                      >
                        <SelectTrigger className="w-full rounded-lg">
                          <SelectValue placeholder={placeholder} />
                        </SelectTrigger>
                        <SelectContent className="w-full max-w-[var(--radix-select-trigger-width)]">
                          {(name === "lane" ? laneOptions : options || []).map(
                            (opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    ) : null}

                    {name === "rules" && type === "checkbox" ? (
                      <Popover modal={false}>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className="h-auto min-h-[2.5rem] w-full items-start justify-start p-2 text-left whitespace-normal"
                          >
                            <div className="w-full text-left break-words whitespace-normal">
                              {field.value?.length
                                ? RULE_OPTIONS.filter((r) =>
                                    field.value?.includes(r.id),
                                  )
                                    .map((r) => r.label)
                                    .join(", ")
                                : "Select rules"}
                            </div>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-2">
                          <div className="flex flex-col gap-2">
                            {RULE_OPTIONS.map((rule) => {
                              const selected = field.value?.includes(rule.id);
                              const disabled =
                                !selected &&
                                (field.value?.length || 0) >= MAX_RULES;
                              return (
                                <label
                                  key={rule.id}
                                  className="flex cursor-pointer items-center gap-2"
                                >
                                  <Checkbox
                                    checked={selected}
                                    disabled={disabled}
                                    onCheckedChange={(checked) => {
                                      let newValues: string[];

                                      if (checked) {
                                        newValues = [
                                          ...(Array.isArray(field.value)
                                            ? field.value
                                            : []),
                                          rule.id,
                                        ];
                                      } else {
                                        newValues = Array.isArray(field.value)
                                          ? field.value.filter(
                                              (id) => id !== rule.id,
                                            )
                                          : [];
                                      }

                                      field.onChange(newValues);
                                    }}
                                  />
                                  {rule.label}
                                </label>
                              );
                            })}
                          </div>
                        </PopoverContent>
                      </Popover>
                    ) : null}

                    {/* default view for banner */}
                    {type === "file" &&
                    label === "Banner URL" &&
                    !bannerBlob &&
                    !bannerUrl ? (
                      <label
                        className={cn(
                          "flex h-40 cursor-pointer items-center justify-center rounded-lg border",
                          "bg-muted/40 hover:bg-muted/60 transition",
                        )}
                      >
                        <Input
                          type="file"
                          accept="image/*"
                          placeholder={placeholder}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setBannerBlobType(file.type);
                              const previewUrl = URL.createObjectURL(file);
                              field.onChange(previewUrl);
                            }
                          }}
                          className="sr-only"
                        />

                        <div className="text-muted-foreground flex items-center gap-2 text-sm">
                          <Upload className="size-4" />
                          Upload banner image
                        </div>
                      </label>
                    ) : null}

                    {/* cropper view for banner */}
                    {type === "file" &&
                    label === "Banner URL" &&
                    bannerUrl &&
                    !bannerBlob ? (
                      <ImageCropper
                        key="banner"
                        src={bannerUrl || "/placeholder.svg"}
                        aspect={1028 / 128}
                        output={{ width: 1028, height: 128 }}
                        zoomLabel="Zoom"
                        onCancel={() => {
                          field.onChange("");
                          setBannerBlob(null);
                        }}
                        onCropped={(blob) => {
                          setBannerBlob(blob);
                          field.onChange(URL.createObjectURL(blob));
                        }}
                      />
                    ) : null}

                    {/* preview view for banner */}
                    {type === "file" && label === "Banner URL" && bannerBlob ? (
                      <div className="relative overflow-hidden rounded-lg border">
                        <Image
                          src={
                            URL.createObjectURL(bannerBlob) ||
                            "/placeholder.svg"
                          }
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
                            onClick={() => {
                              field.onChange(URL.createObjectURL(bannerBlob));
                              setBannerBlob(null);
                            }}
                          >
                            <ImageIcon className="size-4" />
                            Re&#45;crop
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive ml-auto gap-2"
                            onClick={() => {
                              field.onChange("");
                              setBannerBlob(null);
                            }}
                          >
                            <Trash2 className="size-4" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    ) : null}

                    {/* default view for icon */}
                    {type === "file" &&
                    label === "Icon URL" &&
                    !iconBlob &&
                    !iconUrl ? (
                      <label
                        className={cn(
                          "flex h-32 cursor-pointer items-center justify-center rounded-lg border border-dashed",
                          "bg-muted/40 hover:bg-muted/60 transition",
                        )}
                      >
                        <Input
                          type="file"
                          accept="image/*"
                          placeholder={placeholder}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setIconBlobType(file.type);
                              const previewUrl = URL.createObjectURL(file);
                              field.onChange(previewUrl);
                            }
                          }}
                          className="sr-only"
                        />

                        <div className="text-muted-foreground flex items-center gap-2 text-sm">
                          <Upload className="size-4" />
                          Upload icon image
                        </div>
                      </label>
                    ) : null}

                    {/* icon cropper */}
                    {type === "file" &&
                    label === "Icon URL" &&
                    iconUrl &&
                    !iconBlob ? (
                      <ImageCropper
                        key="icon"
                        src={iconUrl || "/placeholder.svg"}
                        aspect={1}
                        output={{ width: 256, height: 256 }}
                        zoomLabel="Zoom"
                        onCancel={() => {
                          field.onChange("");
                          setIconBlob(null);
                        }}
                        onCropped={(blob) => {
                          setIconBlob(blob);
                          field.onChange(URL.createObjectURL(blob));
                        }}
                      />
                    ) : null}

                    {/* preview icon */}
                    {type === "file" && label === "Icon URL" && iconBlob ? (
                      <div className="flex items-center gap-4">
                        <Image
                          src={
                            URL.createObjectURL(iconBlob) || "/placeholder.svg"
                          }
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
                            onClick={() => {
                              field.onChange(URL.createObjectURL(iconBlob));
                              setIconBlob(null);
                            }}
                          >
                            <ImageIcon className="size-4" />
                            Re&#45;crop
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive gap-2"
                            onClick={() => {
                              field.onChange("");
                              setIconBlob(null);
                            }}
                          >
                            <Trash2 className="size-4" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </FormControl>
                <div className="flex items-center justify-between">
                  <div className="text-destructive flex-1 text-xs break-words">
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
