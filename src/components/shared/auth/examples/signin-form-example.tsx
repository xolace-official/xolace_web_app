"use client";

import { IconInfoCircle, IconMail } from "@tabler/icons-react";
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

export function SignInFormExample() {
  const [formState, setFormState] = React.useState<{
    email: string;
    password: string;
    errors: {
      email?: string[];
      password?: string[];
    };
  }>({
    email: "",
    password: "",
    errors: {},
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add your form submission logic here
    console.log("Form submitted:", formState);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} id="signin-form">
          <FieldGroup>
            {/* Email Field with Icon */}
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

            {/* Password Field with Toggle and Info Icon */}
            <FormInput
              name="password"
              type="password"
              label="Password"
              placeholder="Enter your password"
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
                    <TooltipContent>
                      <p>
                        Password must be at least 8 characters with one
                        uppercase and one number
                      </p>
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
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" form="signin-form" className="w-full">
          Sign In
        </Button>
      </CardFooter>
    </Card>
  );
}
