"use client";

import {
  IconCheck,
  IconInfoCircle,
  IconMail,
  IconUser,
  IconX,
} from "@tabler/icons-react";
import * as React from "react";

import { FormInput } from "@/components/shared/auth/form-input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function SignUpFormExample() {
  const [formState, setFormState] = React.useState<{
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    errors: {
      name?: string[];
      email?: string[];
      password?: string[];
      confirmPassword?: string[];
    };
  }>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    errors: {},
  });

  // Password validation helpers
  const hasMinLength = formState.password.length >= 8;
  const hasUppercase = /[A-Z]/.test(formState.password);
  const hasNumber = /[0-9]/.test(formState.password);
  const passwordsMatch =
    formState.password === formState.confirmPassword &&
    formState.confirmPassword.length > 0;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add your form submission logic here
    console.log("Form submitted:", formState);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>
          Sign up to get started with your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} id="signup-form">
          <FieldGroup>
            {/* Name Field */}
            <FormInput
              name="name"
              type="text"
              label="Full Name"
              placeholder="John Doe"
              required
              leftAddon={<IconUser className="size-4 text-muted-foreground" />}
              value={formState.name}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, name: e.target.value }))
              }
              error={formState.errors.name}
            />

            {/* Email Field */}
            <FormInput
              name="email"
              type="email"
              label="Email"
              placeholder="you@example.com"
              required
              leftAddon={<IconMail className="size-4 text-muted-foreground" />}
              value={formState.email}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, email: e.target.value }))
              }
              error={formState.errors.email}
            />

            {/* Password Field with Validation Info */}
            <FormInput
              name="password"
              type="password"
              label="Password"
              placeholder="Create a strong password"
              required
              enablePasswordToggle
              leftAddon={
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" className="cursor-help">
                        <IconInfoCircle className="size-4 text-muted-foreground" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <div className="space-y-1 text-xs">
                        <p className="font-semibold">Password must contain:</p>
                        <div className="flex items-center gap-1.5">
                          {hasMinLength ? (
                            <IconCheck className="size-3 text-green-500" />
                          ) : (
                            <IconX className="size-3 text-muted-foreground" />
                          )}
                          <span>At least 8 characters</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {hasUppercase ? (
                            <IconCheck className="size-3 text-green-500" />
                          ) : (
                            <IconX className="size-3 text-muted-foreground" />
                          )}
                          <span>One uppercase letter</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {hasNumber ? (
                            <IconCheck className="size-3 text-green-500" />
                          ) : (
                            <IconX className="size-3 text-muted-foreground" />
                          )}
                          <span>One number</span>
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              }
              value={formState.password}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, password: e.target.value }))
              }
              error={formState.errors.password}
            />

            {/* Confirm Password Field with Match Indicator */}
            <FormInput
              name="confirmPassword"
              type="password"
              label="Confirm Password"
              placeholder="Re-enter your password"
              required
              enablePasswordToggle
              rightAddon={
                formState.confirmPassword.length > 0 ? (
                  passwordsMatch ? (
                    <IconCheck className="size-4 text-green-500" />
                  ) : (
                    <IconX className="size-4 text-destructive" />
                  )
                ) : null
              }
              value={formState.confirmPassword}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
              error={formState.errors.confirmPassword}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" form="signup-form" className="w-full">
          Create Account
        </Button>
      </CardFooter>
    </Card>
  );
}
