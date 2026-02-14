"use client";

import { useMutation } from "@tanstack/react-query";
import { MailCheck } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { resendOtpAction, verifyOtpAction } from "@/actions/auth";
import { AnimatedOTPInput } from "@/components/smoothui/animated-o-t-p-input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separators } from "@/components/ui/separators";
import { AuthHeader } from "@/features/auth/auth-form-wrapper";

const RESEND_COOLDOWN = 60;

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCountdown = useCallback(() => {
    setCountdown(RESEND_COOLDOWN);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // Start countdown on mount
  useEffect(() => {
    startCountdown();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startCountdown]);

  const verifyMutation = useMutation({
    mutationFn: async (token: string) => {
      const res = await verifyOtpAction({ email, token });
      if (!res.success) throw new Error(res.message);
      return res;
    },
    onSuccess: () => {
      toast.success("Email verified! Welcome to Xolace.");
      router.push("/feed");
    },
    onError: (error) => {
      toast.error(error.message);
      setOtp("");
    },
  });

  const resendMutation = useMutation({
    mutationFn: async () => {
      const res = await resendOtpAction({ email });
      if (!res.success) throw new Error(res.message);
      return res;
    },
    onSuccess: (res) => {
      toast.success(res.message);
      startCountdown();
      setOtp("");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleComplete = (value: string) => {
    verifyMutation.mutate(value);
  };

  // Redirect if no email present
  useEffect(() => {
    if (!email) {
      router.replace("/sign-up");
    }
  }, [email, router]);

  if (!email) {
    return null;
  }

  const canResend = countdown === 0 && !resendMutation.isPending;

  return (
    <motion.div
      key="verify-otp"
      initial={{ opacity: 0.2 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0.2 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <AuthHeader title="Almost there!" subtitle="Verify Your Email" />
      <Card className="w-full md:max-w-md">
        <CardHeader className="max-sm:px-3">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-muted p-2">
              <MailCheck className="size-6 text-primary" />
            </div>
            <div>
              <CardTitle>Enter verification code</CardTitle>
              <CardDescription>
                We sent a 6-digit code to{" "}
                <span className="font-medium text-foreground">{email}</span>
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-4 max-sm:px-3">
          <AnimatedOTPInput
            maxLength={6}
            value={otp}
            onChange={setOtp}
            onComplete={handleComplete}
            aria-label="Verification code"
          />

          {verifyMutation.isError && (
            <p className="text-sm font-medium text-destructive">
              {verifyMutation.error.message}
            </p>
          )}

          <Button
            className="w-full"
            disabled={otp.length !== 6 || verifyMutation.isPending}
            onClick={() => verifyMutation.mutate(otp)}
          >
            {verifyMutation.isPending ? "Verifying..." : "Verify Email"}
          </Button>

          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>Didn&apos;t receive the code?</span>
            {canResend ? (
              <button
                type="button"
                className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
                onClick={() => resendMutation.mutate()}
              >
                Resend
              </button>
            ) : (
              <span className="tabular-nums">Resend in {countdown}s</span>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 max-sm:px-3">
          <Separators
            label={
              <div className="rounded-full border border-dashed px-4 py-1 text-xs">
                Need help?
              </div>
            }
            gradient
          />

          <div className="flex flex-col gap-2 text-center text-sm text-muted-foreground">
            <Link
              href="/support"
              className="underline underline-offset-4 hover:text-primary"
            >
              Having trouble? Contact support
            </Link>
            <Link
              href="/sign-up"
              className="underline underline-offset-4 hover:text-primary"
            >
              I no longer have access to this email
            </Link>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
