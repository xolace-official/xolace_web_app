# FormInput Component

A scalable, reusable form input component built on top of `InputGroup` and `Field` components. Perfect for authentication UIs and any form that requires validation, addons, and customization.

## Features

- ✅ **Left & Right Addons**: Add icons, buttons, or any content on either side of the input
- ✅ **Password Toggle**: Built-in show/hide password functionality
- ✅ **Validation Support**: Display errors with proper ARIA attributes
- ✅ **Fully Customizable**: All styling can be overridden via className props
- ✅ **Accessible**: Proper ARIA labels, descriptions, and error handling
- ✅ **Type Safe**: Full TypeScript support with proper types

## Installation

The component is already installed at:
```
/src/components/shared/auth/form-input.tsx
```

## Basic Usage

```tsx
import { FormInput } from "@/components/shared/auth/form-input"

function MyForm() {
  return (
    <FormInput
      name="email"
      type="email"
      label="Email"
      placeholder="you@example.com"
      required
    />
  )
}
```

## Examples

### Email Input with Icon

```tsx
import { IconMail } from "@tabler/icons-react"

<FormInput
  name="email"
  type="email"
  label="Email"
  placeholder="you@example.com"
  leftAddon={<IconMail className="size-4 text-muted-foreground" />}
/>
```

### Password Input with Toggle

```tsx
<FormInput
  name="password"
  type="password"
  label="Password"
  placeholder="Enter your password"
  enablePasswordToggle
/>
```

### Password with Info Tooltip

```tsx
import { IconInfoCircle } from "@tabler/icons-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

<FormInput
  name="password"
  type="password"
  label="Password"
  enablePasswordToggle
  leftAddon={
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button" className="cursor-help">
            <IconInfoCircle className="size-4 text-muted-foreground" />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Password must be at least 8 characters</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  }
/>
```

### Confirm Password with Match Indicator

```tsx
import { IconCheck, IconX } from "@tabler/icons-react"

const passwordsMatch = password === confirmPassword && confirmPassword.length > 0

<FormInput
  name="confirmPassword"
  type="password"
  label="Confirm Password"
  enablePasswordToggle
  rightAddon={
    confirmPassword.length > 0 ? (
      passwordsMatch ? (
        <IconCheck className="size-4 text-green-500" />
      ) : (
        <IconX className="size-4 text-destructive" />
      )
    ) : null
  }
/>
```

### With Validation Errors

```tsx
<FormInput
  name="email"
  type="email"
  label="Email"
  error="Please enter a valid email address"
/>

// Multiple errors
<FormInput
  name="password"
  type="password"
  label="Password"
  error={[
    "Password must be at least 8 characters",
    "Password must contain an uppercase letter"
  ]}
/>
```

### With Description

```tsx
<FormInput
  name="username"
  type="text"
  label="Username"
  description="Choose a unique username for your account"
/>
```

### Both Left and Right Addons

```tsx
import { IconMail, IconCheck } from "@tabler/icons-react"

<FormInput
  name="email"
  type="email"
  label="Email"
  leftAddon={<IconMail className="size-4 text-muted-foreground" />}
  rightAddon={<IconCheck className="size-4 text-green-500" />}
/>
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | The label for the input field |
| `description` | `string` | - | Description text shown below the input |
| `error` | `string \| string[]` | - | Error message(s) to display |
| `leftAddon` | `ReactNode` | - | Content to display on the left side |
| `rightAddon` | `ReactNode` | - | Content to display on the right side |
| `type` | `HTMLInputTypeAttribute` | `"text"` | The input type |
| `enablePasswordToggle` | `boolean` | `false` | Enable password visibility toggle |
| `fieldClassName` | `string` | - | Custom class for Field wrapper |
| `inputGroupClassName` | `string` | - | Custom class for InputGroup |
| `required` | `boolean` | `false` | Whether the field is required |
| `className` | `string` | - | Custom class for the input element |

All other standard HTML input props are also supported (e.g., `placeholder`, `disabled`, `onChange`, etc.)

## Full Examples

See the complete working examples:
- **Sign In Form**: `/src/components/shared/auth/examples/signin-form-example.tsx`
- **Sign Up Form**: `/src/components/shared/auth/examples/signup-form-example.tsx`

## Integration with React Hook Form

```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

type FormData = z.infer<typeof schema>

function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <FormInput
        {...register("email")}
        type="email"
        label="Email"
        error={errors.email?.message}
      />
      <FormInput
        {...register("password")}
        type="password"
        label="Password"
        enablePasswordToggle
        error={errors.password?.message}
      />
    </form>
  )
}
```

## Customization

### Custom Styling

```tsx
<FormInput
  name="email"
  label="Email"
  fieldClassName="mb-8"
  inputGroupClassName="border-2"
  className="text-lg"
/>
```

### Custom Addons

You can pass any React component as an addon:

```tsx
<FormInput
  name="search"
  leftAddon={
    <Button size="icon-xs" variant="ghost">
      <SearchIcon />
    </Button>
  }
  rightAddon={
    <InputGroupButton size="xs">Search</InputGroupButton>
  }
/>
```

## Best Practices

1. **Use semantic types**: Always use the appropriate `type` prop (email, password, tel, etc.)
2. **Provide labels**: Always include a `label` for accessibility
3. **Add descriptions**: Use `description` to provide helpful context
4. **Handle errors gracefully**: Display clear, actionable error messages
5. **Use tooltips for complex requirements**: Help users understand password requirements, etc.
6. **Keep addons simple**: Don't overcrowd the input with too many addons

## Accessibility

The component automatically handles:
- Proper ARIA labels and descriptions
- Error state announcements
- Focus management
- Keyboard navigation
- Screen reader support

## Notes

- The password toggle uses `IconEye` and `IconEyeOff` from `@tabler/icons-react`
- The component is fully compatible with form libraries like React Hook Form
- All Field and InputGroup features are preserved
- The component forwards refs properly for form integration
