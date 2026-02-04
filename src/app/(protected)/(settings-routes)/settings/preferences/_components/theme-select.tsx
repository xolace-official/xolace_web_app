"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ThemeOption } from "./preference-types";

interface ThemeSelectProps {
  value: ThemeOption;
  onValueChange: (value: ThemeOption) => void;
  disabled?: boolean;
}

const themeOptions: { value: ThemeOption; label: string }[] = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

export function ThemeSelect({
  value,
  onValueChange,
  disabled,
}: ThemeSelectProps) {
  return (
    <Select
      value={value}
      onValueChange={(v) => onValueChange(v as ThemeOption)}
      disabled={disabled}
    >
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder="Select theme" />
      </SelectTrigger>
      <SelectContent>
        {themeOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
