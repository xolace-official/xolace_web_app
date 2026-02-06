"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SensitiveContentMode } from "./preference-types";

interface SensitiveContentSelectProps {
  value: SensitiveContentMode;
  onValueChange: (value: SensitiveContentMode) => void;
  disabled?: boolean;
}

const sensitiveContentOptions: {
  value: SensitiveContentMode;
  label: string;
}[] = [
  { value: "show", label: "Show all content" },
  { value: "blur", label: "Blur sensitive content" },
  { value: "hide", label: "Hide sensitive content" },
];

export function SensitiveContentSelect({
  value,
  onValueChange,
  disabled,
}: SensitiveContentSelectProps) {
  return (
    <Select
      value={value}
      onValueChange={(v) => onValueChange(v as SensitiveContentMode)}
      disabled={disabled}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select option" />
      </SelectTrigger>
      <SelectContent>
        {sensitiveContentOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
