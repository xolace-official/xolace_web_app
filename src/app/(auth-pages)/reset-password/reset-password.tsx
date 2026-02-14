"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, KeyRound } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { resetPasswordAction } from "@/actions/auth";
import { FormInput } from "@/components/shared/auth/form-input";
import { ResponsiveInfoTrigger } from "@/components/shared/responsive-info-trigger";
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
import { AuthHeader } from "@/features/auth/auth-form-wrapper";
import { resetPasswordSchema } from "@/validation";

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const resetMutation = useMutation({
    mutationFn: async (data: ResetPasswordValues) => {
      const res = await resetPasswordAction(data);

      if (!res.success) {
        throw new Error(res.message);
      }

      return res;
    },
    onSuccess: (res) => {
      toast.success(res.message);
    },
    onError: (error) => {
      setError("root", { message: error.message });
      toast.error(error.message);
    },
  });

  // Success state
  if (resetMutation.isSuccess) {
    return (
      <motion.div
        key="reset-password-success"
        initial={{ opacity: 0.2 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0.2 }}
        transition={{ duration: 0.4 }}
        className="w-full"
      >
        <AuthHeader title="All set!" subtitle="Password updated" />
        <Card className="w-full md:max-w-md">
          <CardHeader className="max-sm:px-3">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-muted p-2">
                <CheckCircle2 className="size-6 text-primary" />
              </div>
              <div>
                <CardTitle>Password changed</CardTitle>
                <CardDescription>
                  Your password has been updated successfully. You can now sign
                  in with your new password.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardFooter className="flex flex-col gap-3 max-sm:px-3">
            <Button asChild className="w-full">
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="reset-password"
      initial={{ opacity: 0.2 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0.2 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <AuthHeader title="Set a new password" subtitle="Almost done" />
      <Card className="w-full md:max-w-md">
        <CardHeader className="max-sm:px-3">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-muted p-2">
              <KeyRound className="size-6 text-primary" />
            </div>
            <div>
              <CardTitle>Reset Password</CardTitle>
              <CardDescription>
                Choose a strong password you haven&apos;t used before.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="max-sm:px-3">
          <form
            id="reset-password-form"
            onSubmit={handleSubmit((values: ResetPasswordValues) =>
              resetMutation.mutate(values),
            )}
          >
            <FieldGroup>
              <FormInput
                {...register("password")}
                id="password"
                type="password"
                label="New Password"
                placeholder="Enter your new password"
                required
                enablePasswordToggle
                disabled={resetMutation.isPending}
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
                error={errors.password?.message}
              />

              <FormInput
                {...register("confirmPassword")}
                id="confirmPassword"
                type="password"
                label="Confirm Password"
                placeholder="Confirm your new password"
                required
                enablePasswordToggle
                disabled={resetMutation.isPending}
                error={errors.confirmPassword?.message}
              />
            </FieldGroup>

            {errors.root?.message && (
              <p className="mt-3 text-sm font-medium text-destructive">
                {errors.root.message}
              </p>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 max-sm:px-3">
          <Button
            type="submit"
            form="reset-password-form"
            className="w-full"
            disabled={!isValid || resetMutation.isPending}
          >
            {resetMutation.isPending ? "Updating..." : "Update Password"}
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
  );
}
