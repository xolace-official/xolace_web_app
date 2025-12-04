"use client";

import { IconInfoCircle, IconMail } from "@tabler/icons-react";
import { motion } from "motion/react";
import Form from "next/form";
import Link from "next/link";
import { useActionState } from "react";
import { signinFormAction } from "@/actions/auth";
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
import { Separators } from "@/components/ui/separators";
import { AuthHeader } from "@/features/auth/auth-form-wrapper";
import { ResponsiveInfoTrigger } from "@/components/shared/responsive-info-trigger";
import type { SigninFormState } from "@/validation";

export default function SignInPage() {
  const [formState, formAction] = useActionState<SigninFormState, FormData>(
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
      <AuthHeader title="Holla 👋," subtitle="Welcome Back" />
      <Card className="w-full md:max-w-md">
        <CardHeader className="max-sm:px-3">
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="max-sm:px-3">
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
                showForgotPasswordLink
                leftAddon={
                 <ResponsiveInfoTrigger
                                       content={
                                         <p>
                                           Password must be at least 8 characters with one
                                           uppercase and one number
                                         </p>
                                       }
                                     />
                }
                error={formState.errors?.password}
              />
            </FieldGroup>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 max-sm:px-3">
          <Button type="submit" form="signin-form" className="w-full">
            Sign In
          </Button>

          <Separators
            label={
              <div className="rounded-full border border-dashed px-4 py-1">
                OR
              </div>
            }
            gradient
          />

          <Button variant="outline" form="signin-form" className="w-full">
            Sign In Anonymously
          </Button>

          <div className="text-center text-sm text-muted-foreground">
							Don&apos;t have an account?{" "}
							<Link
								href="/sign-up"
								className="underline underline-offset-4 hover:text-primary"
							>
								Sign up
							</Link>
						</div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
