"use client";

import { IconMail } from "@tabler/icons-react";
import { motion } from "motion/react";
import Form from "next/form";
import Link from "next/link";
import { useActionState } from "react";
import { forgotPasswordFormAction } from "@/actions/auth";
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
import type { ForgotPasswordFormState} from "@/validation/auth";

const ForgotPasswordPage = () => {
  const [formState, formAction] = useActionState<ForgotPasswordFormState, FormData>(
    forgotPasswordFormAction,
    {
      values: {
        email: "",
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
      {/* <AuthHeader title="Holla 👋," subtitle="Welcome Back" /> */}
      <Card className="w-full md:max-w-md">
        <CardHeader className="max-sm:px-3">
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>
            Enter your email to reset your password
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

            </FieldGroup>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 max-sm:px-3">
          <Button type="submit" form="signin-form" className="w-full">
           Reset Password
          </Button>


          <div className="text-center text-sm text-muted-foreground">
							Remember your password?{" "}
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
  )
}

export default ForgotPasswordPage