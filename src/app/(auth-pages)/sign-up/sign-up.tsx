"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { IconMail, IconUser } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { signUpAction } from "@/actions/auth";
import { Checkbox } from "@/components/molecule-ui/checkbox";
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
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldSet,
} from "@/components/ui/field";
import { AuthHeader } from "@/features/auth/auth-form-wrapper";
import { signupSchema } from "@/validation";

type SignUpFormValues = z.infer<typeof signupSchema>;

export default function SignUpPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors, isValid },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
      email: "",
      password: "",
      terms: false as unknown as true,
    },
  });

  const signUpMutation = useMutation({
    mutationFn: async (data: SignUpFormValues) => {
      const res = await signUpAction({
        username: data.username,
        email: data.email,
        password: data.password,
      });

      if (!res.success) {
        throw new Error(res.message);
      }

      return res;
    },
    onSuccess: (res) => {
      toast.success(res.message);
      router.push("/sign-in");
    },
    onError: (error) => {
      setError("root", { message: error.message });
      toast.error(error.message);
    },
  });

  return (
    <motion.div
      key="sign-up"
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
        subtitleClassName="text-xl sm:text-4xl"
      />
      <Card className="w-full md:max-w-md">
        <CardHeader className="max-sm:px-3">
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>
            Enter your credentials to create an account
          </CardDescription>
        </CardHeader>
        <CardContent className="max-sm:px-3">
          <form
            id="signup-form"
            onSubmit={handleSubmit((values: SignUpFormValues) =>
              signUpMutation.mutate(values),
            )}
          >
            <FieldSet>
              <FieldGroup>
                {/* Username Field */}
                <FormInput
                  {...register("username")}
                  id="username"
                  type="text"
                  label="Username"
                  placeholder="Enter your username"
                  required
                  disabled={signUpMutation.isPending}
                  leftAddon={
                    <IconUser className="size-4 text-muted-foreground" />
                  }
                  rightAddon={
                    <ResponsiveInfoTrigger
                      content={
                        <p>Definitely not the name your mommy gave you 🙂‍↕️</p>
                      }
                    />
                  }
                  error={errors.username?.message}
                />

                {/* Email Field */}
                <FormInput
                  {...register("email")}
                  id="email"
                  type="email"
                  label="Email"
                  placeholder="you@example.com"
                  required
                  disabled={signUpMutation.isPending}
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
                  disabled={signUpMutation.isPending}
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

              <FieldGroup>
                <Controller
                  name="terms"
                  control={control}
                  render={({ field }) => (
                    <Field orientation="horizontal">
                      <Checkbox
                        id="sign-up-form-agree-to-terms"
                        checked={field.value}
                        onCheckedChange={(checked) =>
                          field.onChange(checked === true)
                        }
                        disabled={signUpMutation.isPending}
                      />
                      <FieldDescription className="text-xs font-extralight">
                        I am not in crisis or suicidal and I agree to the Xolace{" "}
                        <Link href="/terms" className="underline">
                          Terms of Service
                        </Link>{" "}
                        &{" "}
                        <Link href="/privacy" className="underline">
                          Privacy Policy
                        </Link>
                      </FieldDescription>
                    </Field>
                  )}
                />
                {errors.terms?.message && (
                  <FieldError>{errors.terms.message}</FieldError>
                )}
              </FieldGroup>

              {/* Server error */}
              {errors.root?.message && (
                <p className="text-sm font-medium text-destructive">
                  {errors.root.message}
                </p>
              )}
            </FieldSet>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 max-sm:px-3">
          <Button
            type="submit"
            form="signup-form"
            className="w-full"
            disabled={!isValid || signUpMutation.isPending}
          >
            {signUpMutation.isPending ? "Creating account..." : "Sign Up"}
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
