"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { IconMail } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { signInAction } from "@/actions/auth";
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
import { Separators } from "@/components/ui/separators";
import { AnonymousSignIn } from "@/features/auth/anonymous-sign-in";
import { AuthHeader } from "@/features/auth/auth-form-wrapper";
import { signinSchema } from "@/validation";

type SignInFormValues = z.infer<typeof signinSchema>;

export default function SignInPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signinSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signInMutation = useMutation({
    mutationFn: async (data: SignInFormValues) => {
      const res = await signInAction(data);

      if (!res.success) {
        throw new Error(res.message);
      }

      return res;
    },
    onSuccess: () => {
      toast.success("Welcome back!");
      router.push("/feed");
    },
    onError: (error) => {
      setError("root", { message: error.message });
      toast.error(error.message);
    },
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
      <AuthHeader title="Holla 👋," subtitle="Welcome Back" />
      <Card className="w-full md:max-w-md">
        <CardHeader className="max-sm:px-3">
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="max-sm:px-3">
          <form
            id="signin-form"
            onSubmit={handleSubmit((values: SignInFormValues) =>
              signInMutation.mutate(values),
            )}
          >
            <FieldGroup>
              {/* Email Field */}
              <FormInput
                {...register("email")}
                id="email"
                type="email"
                label="Email"
                placeholder="you@example.com"
                required
                disabled={signInMutation.isPending}
                leftAddon={
                  <IconMail className="size-4 text-muted-foreground" />
                }
                error={errors.email?.message}
              />

              {/* Password Field */}
              <FormInput
                {...register("password")}
                id="password"
                type="password"
                label="Password"
                placeholder="Enter your password"
                required
                enablePasswordToggle
                showForgotPasswordLink
                disabled={signInMutation.isPending}
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
            </FieldGroup>

            {/* Server error */}
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
            form="signin-form"
            className="w-full"
            disabled={!isValid || signInMutation.isPending}
          >
            {signInMutation.isPending ? "Signing in..." : "Sign In"}
          </Button>

          <Separators
            label={
              <div className="rounded-full border border-dashed px-4 py-1">
                OR
              </div>
            }
            gradient
          />

          <AnonymousSignIn />

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
