"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Loader2Icon, SearchIcon, XIcon } from "lucide-react";
import * as React from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

const searchBarVariants = cva("", {
  variants: {
    size: {
      sm: "[&_input]:h-8 [&_input]:text-sm",
      md: "[&_input]:h-9 [&_input]:text-sm",
      lg: "[&_input]:h-10 [&_input]:text-base",
    },
    variant: {
      default: "",
      ghost:
        "border-transparent bg-muted/50 hover:bg-muted focus-within:bg-background focus-within:border-input",
      outline: "",
    },
  },
  defaultVariants: {
    size: "md",
    variant: "default",
  },
});

export type SearchBarProps = Omit<
  React.ComponentProps<typeof InputGroup>,
  "onChange"
> &
  VariantProps<typeof searchBarVariants> & {
    /** Current search value (controlled) */
    value?: string;
    /** Default value for uncontrolled usage */
    defaultValue?: string;
    /** Callback when search value changes (debounced) */
    onSearch?: (value: string) => void;
    /** Callback when input value changes immediately (non-debounced) */
    onChange?: (value: string) => void;
    /** Debounce delay in milliseconds */
    onClear?: () => void;
    debounceMs?: number;
    /** Placeholder text */
    placeholder?: string;
    /** Show loading spinner */
    isLoading?: boolean;
    /** Disable the search bar */
    disabled?: boolean;
    /** Show clear button when there's input */
    showClear?: boolean;
    /** Custom icon to replace default search icon */
    icon?: React.ReactNode;
    /** Content to render after the input (before clear/loading) */
    endContent?: React.ReactNode;
    /** Content to render before the input (after search icon) */
    startContent?: React.ReactNode;
    /** Input element props */
    inputProps?: Omit<
      React.ComponentProps<typeof InputGroupInput>,
      "value" | "onChange" | "placeholder" | "disabled"
    >;
    /** Auto focus the input on mount */
    autoFocus?: boolean;
  };

const ParamsSearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  (
    {
      className,
      size,
      variant,
      value: controlledValue,
      defaultValue = "",
      onSearch,
      onChange,
      debounceMs = 300,
      placeholder = "Search...",
      isLoading: externalLoading = false,
      disabled = false,
      showClear = true,
      onClear,
      icon,
      endContent,
      startContent,
      inputProps,
      autoFocus = false,
      ...props
    },
    ref,
  ) => {
    // Internal state for uncontrolled mode
    const [internalValue, setInternalValue] = React.useState(defaultValue);

    // Determine if controlled or uncontrolled
    const isControlled = controlledValue !== undefined;
    const currentValue = isControlled ? controlledValue : internalValue;

    // Input ref for internal use
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    // Handle keyboard events
    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Escape" && currentValue) {
          e.preventDefault();
          if (onClear) onClear();
        }
      },
      [currentValue, onClear],
    );

    // Determine loading state
    const showLoading = externalLoading;
    const showClearButton = showClear && currentValue && !showLoading;

    return (
      <InputGroup
        data-disabled={disabled}
        className={cn(searchBarVariants({ size, variant }), className)}
        {...props}
      >
        {/* Start Addon - Search Icon */}
        <InputGroupAddon align="inline-start">
          {icon ?? (
            <SearchIcon className="size-4 text-muted-foreground" aria-hidden />
          )}
          {startContent}
        </InputGroupAddon>

        {/* Input */}
        <InputGroupInput
          ref={inputRef}
          type="search"
          value={currentValue}
          onChange={(e) => {
            // Add the event handler
            const newValue = e.target.value;
            if (!isControlled) {
              setInternalValue(newValue);
            }
            onChange?.(newValue);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          aria-label={placeholder}
          {...inputProps}
        />

        {/* End Addon - Loading/Clear */}
        <InputGroupAddon align="inline-end">
          {endContent}

          {/* Loading Spinner */}
          {showLoading && (
            <Loader2Icon
              className="size-4 animate-spin text-muted-foreground"
              aria-hidden
            />
          )}

          {/* Clear Button */}
          {showClearButton && (
            <InputGroupButton
              size="icon-xs"
              variant="ghost"
              onClick={() => onClear?.()}
              aria-label="Clear search"
              className="text-muted-foreground hover:text-foreground"
            >
              <XIcon className="size-3.5" />
            </InputGroupButton>
          )}
        </InputGroupAddon>
      </InputGroup>
    );
  },
);

ParamsSearchBar.displayName = "ParamsSearchBar";

export { ParamsSearchBar, searchBarVariants };
