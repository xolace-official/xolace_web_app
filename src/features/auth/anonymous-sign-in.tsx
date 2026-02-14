"use client";

import { useMutation } from "@tanstack/react-query";
import {
  AlertTriangle,
  CheckCircle2,
  Key,
  Shield,
  ShieldAlert,
  VenetianMask,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signInAnonymouslyAction } from "@/actions/auth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export function AnonymousSignIn() {
  const router = useRouter();

  const anonymousMutation = useMutation({
    mutationFn: async () => {
      const res = await signInAnonymouslyAction();
      if (!res.success) {
        throw new Error(res.message);
      }
      return res;
    },
    onSuccess: () => {
      router.push("/feed");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full"
          disabled={anonymousMutation.isPending}
        >
          {anonymousMutation.isPending
            ? "Entering ghost mode..."
            : "Sign In Anonymously"}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="w-full max-w-[95%] sm:max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-muted p-2">
              <VenetianMask className="size-6 text-primary" />
            </div>
            <AlertDialogTitle className="text-left text-xl font-bold">
              Anonymous Sign-In
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            Jump in, no strings attached. Signing in anonymously lets you:
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="mt-4 space-y-3 text-sm text-muted-foreground">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-500" />
            <span>Post, vote, and comment freely</span>
          </div>

          <div className="border-t pt-3">
            <p className="mb-2 flex items-center gap-2 font-medium text-foreground">
              <AlertTriangle className="size-4" />
              Important limitations:
            </p>
            <ul className="space-y-2 pl-1">
              <li className="flex items-start gap-2">
                <XCircle className="mt-0.5 size-5 shrink-0 text-destructive/80" />
                <span>Account can&apos;t be deleted or recovered if lost</span>
              </li>
              <li className="flex items-start gap-2">
                <Key className="mt-0.5 size-5 shrink-0 text-amber-500/80" />
                <span>
                  Browser data = your only key (clear it and it&apos;s gone)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldAlert className="mt-0.5 size-5 shrink-0 text-amber-600/80" />
                <span>Anonymous access is temporary and non-transferable</span>
              </li>
            </ul>
          </div>
        </div>

        <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
          <AlertDialogCancel>Sign up Instead</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => anonymousMutation.mutate()}
            disabled={anonymousMutation.isPending}
          >
            <Shield className="mr-2 size-4" />
            Enter Ghost Mode
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
