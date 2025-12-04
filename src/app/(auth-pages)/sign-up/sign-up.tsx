"use client";

import { IconInfoCircle, IconMail, IconUser } from "@tabler/icons-react";
import { motion } from "motion/react";
import Form from "next/form";
import Link from "next/link";
import { useActionState } from "react";
import { signupFormAction } from "@/actions/auth";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/animate-ui/components/animate/tooltip";
import { Checkbox } from "@/components/molecule-ui/checkbox";
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
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { AuthHeader } from "@/features/auth/auth-form-wrapper";
import type { SignupFormState } from "@/validation";

export default function SignUpPage() {
  const [formState, formAction, pending] = useActionState<
    SignupFormState,
    FormData
  >(signupFormAction, {
    values: {
      username: "",
      email: "",
      password: "",
    },
    errors: null,
    success: false,
  });

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
        subtitle="So glad you're here!"
        titleClassName="max-sm:text-2xl"
        subtitleClassName="text-xl"
      />
      <Card className="w-full md:max-w-md">
        <CardHeader className="max-sm:px-3">
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>
            Enter your credentials to create an account
          </CardDescription>
        </CardHeader>
        <CardContent className="max-sm:px-3">
          <Form action={formAction} id="signup-form">
            <FieldSet>
              <FieldGroup>
                {/* Username Field with Icon */}
                <FormInput
                  id="username"
                  name="username"
                  defaultValue={formState.values?.username}
                  type="text"
                  label="Username"
                  placeholder="Enter your username"
                  required
                  leftAddon={
                    <IconUser className="size-4 text-muted-foreground" />
                  }
                  rightAddon={
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button type="button" className="cursor-help">
                          <IconInfoCircle className="size-4 text-muted-foreground" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Definitely not the name you mommy gave you 🙂‍↕️</p>
                      </TooltipContent>
                    </Tooltip>
                  }
                  error={formState.errors?.username}
                />

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
                  showForgotPasswordLink
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

              <FieldGroup>
                <Field orientation="horizontal">
                  <Checkbox id="sign-up-form-agree-to-terms" defaultChecked />
                  <FieldDescription className="text-xs font-extralight">
                    I am not in crisis or suicidal
                    and I agree to the Xolace <Link href="/terms" className="underline">Terms of Service</Link> & <Link href="/privacy" className="underline">Privacy Policy</Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </FieldSet>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 max-sm:px-3">
          <Button type="submit" form="signup-form" className="w-full">
            Sign Up
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="underline underline-offset-4 hover:text-primary"
            >
              Sign In
            </Link>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
