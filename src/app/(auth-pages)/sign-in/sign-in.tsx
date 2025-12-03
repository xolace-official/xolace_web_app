"use client";

import { IconInfoCircle, IconMail } from "@tabler/icons-react";
import { motion } from "motion/react";
import Form from "next/form";
import Link from "next/link";
import { useActionState } from "react";
import { toast } from "sonner";
import { signinFormAction } from "@/actions/auth";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/animate-ui/components/animate/tooltip";
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
import type { FormState } from "@/validation";
import { AuthHeader } from "@/features/auth/auth-form-wrapper";

export default function SignInPage() {
  const [formState, formAction, pending] = useActionState<FormState, FormData>(
    signinFormAction,
    {
      values: {
        email: "",
        password: "",
      },
      errors: null,
      success: false,
    },
  );

  return (
    <motion.div
      key="sign-in"
      initial={{ opacity: 0.2 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0.2 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <AuthHeader 
      title="Holla 👋,"
      subtitle="Welcome Back"
      />
      <Card className="w-full md:max-w-md">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form action={formAction} id="signin-form">
            <FieldGroup>
              {/* Email Field with Icon */}
              <FormInput
                id="email"
                name="email"
                defaultValue={formState.values?.email}
                type="email"
                label="Email"
                placeholder="you@example.com"
                required
                leftAddon={
                  <IconMail className="size-4 text-muted-foreground" />
                }
                error={formState.errors?.email}
              />

              {/* Password Field with Toggle and Info Icon */}
              <FormInput
                id="password"
                name="password"
                defaultValue={formState.values?.password}
                type="password"
                label="Password"
                placeholder="Enter your password"
                required
                enablePasswordToggle
                leftAddon={
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
                }
                error={formState.errors?.password}
              />
            </FieldGroup>
          </Form>
        </CardContent>
        <CardFooter>
          <Button type="submit" form="signin-form" className="w-full">
            Sign In
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
