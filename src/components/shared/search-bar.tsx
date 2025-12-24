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
import { useDebounceValue } from "@/hooks/use-debounce-value";
import { cn } from "@/lib/utils";

// ============================================================================
// SearchBar Variants
// ============================================================================

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

// ============================================================================
// Types
// ============================================================================

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

// ============================================================================
// SearchBar Component
// ============================================================================

const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
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

    // Debounced value for triggering search
    const [debouncedValue, debouncedControl] = useDebounceValue(
      currentValue,
      debounceMs,
    );

    // Track if we're currently debouncing (value changed but debounce hasn't fired)
    const [isDebouncing, setIsDebouncing] = React.useState(false);

    // Input ref for internal use
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Merge refs
    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    // Handle debounced search callback
    React.useEffect(() => {
      onSearch?.(debouncedValue);
      setIsDebouncing(false);
    }, [debouncedValue, onSearch]);

    // Handle input change
    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;

        if (!isControlled) {
          setInternalValue(newValue);
        }

        onChange?.(newValue);
        setIsDebouncing(true);
        debouncedControl(newValue);
      },
      [isControlled, onChange, debouncedControl],
    );

    // Handle clear
    const handleClear = React.useCallback(() => {
      if (!isControlled) {
        setInternalValue("");
      }

      onChange?.("");
      debouncedControl.cancel();
      onSearch?.("");
      setIsDebouncing(false);
      inputRef.current?.focus();
    }, [isControlled, onChange, debouncedControl, onSearch]);

    // Handle keyboard events
    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Escape" && currentValue) {
          e.preventDefault();
          handleClear();
        }
      },
      [currentValue, handleClear],
    );

    // Determine loading state
    const showLoading = externalLoading || isDebouncing;
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
          onChange={handleChange}
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
              onClick={handleClear}
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

SearchBar.displayName = "SearchBar";

// ============================================================================
// Compound Components for Maximum Composability
// ============================================================================

/**
 * SearchBarRoot - The container component for building custom search bars
 */
const SearchBarRoot = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof InputGroup> &
    VariantProps<typeof searchBarVariants>
>(({ className, size, variant, ...props }, ref) => {
  return (
    <InputGroup
      ref={ref}
      className={cn(searchBarVariants({ size, variant }), className)}
      {...props}
    />
  );
});
SearchBarRoot.displayName = "SearchBarRoot";

/**
 * SearchBarIcon - The icon slot for the search bar
 */
const SearchBarIcon = React.forwardRef<
  HTMLDivElement,
  Omit<React.ComponentProps<typeof InputGroupAddon>, "align"> & {
    align?: "start" | "end";
  }
>(({ align = "start", children, ...props }, ref) => {
  return (
    <InputGroupAddon
      ref={ref}
      align={align === "start" ? "inline-start" : "inline-end"}
      {...props}
    >
      {children ?? (
        <SearchIcon className="size-4 text-muted-foreground" aria-hidden />
      )}
    </InputGroupAddon>
  );
});
SearchBarIcon.displayName = "SearchBarIcon";

/**
 * SearchBarInput - The input element for the search bar
 */
const SearchBarInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof InputGroupInput>
>(({ type = "search", ...props }, ref) => {
  return <InputGroupInput ref={ref} type={type} {...props} />;
});
SearchBarInput.displayName = "SearchBarInput";

/**
 * SearchBarSpinner - Loading indicator for the search bar
 */
function SearchBarSpinner({
  className,
  ...props
}: React.ComponentProps<typeof Loader2Icon>) {
  return (
    <Loader2Icon
      className={cn("size-4 animate-spin text-muted-foreground", className)}
      aria-hidden
      {...props}
    />
  );
}
SearchBarSpinner.displayName = "SearchBarSpinner";

/**
 * SearchBarClear - Clear button for the search bar
 */
const SearchBarClear = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof InputGroupButton>
>(({ className, children, ...props }, ref) => {
  return (
    <InputGroupButton
      ref={ref}
      size="icon-xs"
      variant="ghost"
      aria-label="Clear search"
      className={cn("text-muted-foreground hover:text-foreground", className)}
      {...props}
    >
      {children ?? <XIcon className="size-3.5" />}
    </InputGroupButton>
  );
});
SearchBarClear.displayName = "SearchBarClear";

/**
 * SearchBarActions - Container for action buttons in the search bar
 */
const SearchBarActions = React.forwardRef<
  HTMLDivElement,
  Omit<React.ComponentProps<typeof InputGroupAddon>, "align">
>(({ ...props }, ref) => {
  return <InputGroupAddon ref={ref} align="inline-end" {...props} />;
});
SearchBarActions.displayName = "SearchBarActions";

// ============================================================================
// Hook for controlled search with debounce
// ============================================================================

export type UseSearchOptions = {
  /** Initial search value */
  initialValue?: string;
  /** Debounce delay in milliseconds */
  debounceMs?: number;
  /** Callback when debounced value changes */
  onSearch?: (value: string) => void;
};

export function useSearch({
  initialValue = "",
  debounceMs = 300,
  onSearch,
}: UseSearchOptions = {}) {
  const [value, setValue] = React.useState(initialValue);
  const [debouncedValue, debouncedControl] = useDebounceValue(
    value,
    debounceMs,
  );
  const [isSearching, setIsSearching] = React.useState(false);

  // Handle debounced search callback
  React.useEffect(() => {
    onSearch?.(debouncedValue);
    setIsSearching(false);
  }, [debouncedValue, onSearch]);

  const handleChange = React.useCallback(
    (newValue: string) => {
      setValue(newValue);
      setIsSearching(true);
      debouncedControl(newValue);
    },
    [debouncedControl],
  );

  const handleClear = React.useCallback(() => {
    setValue("");
    debouncedControl.cancel();
    onSearch?.("");
    setIsSearching(false);
  }, [debouncedControl, onSearch]);

  return {
    /** Current input value */
    value,
    /** Debounced search value */
    debouncedValue,
    /** Whether search is currently debouncing */
    isSearching,
    /** Set the search value */
    setValue: handleChange,
    /** Clear the search */
    clear: handleClear,
    /** Flush the debounce immediately */
    flush: debouncedControl.flush,
    /** Cancel pending debounce */
    cancel: debouncedControl.cancel,
  };
}

// ============================================================================
// Exports
// ============================================================================

export {
  SearchBar,
  SearchBarRoot,
  SearchBarIcon,
  SearchBarInput,
  SearchBarSpinner,
  SearchBarClear,
  SearchBarActions,
  searchBarVariants,
};
