"use client";

import { useWatch, type Control } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { FullFormType } from "@/validation/create-campfire";

interface StepNavigationProps {
  step: number;
  totalSteps: number;
  control: Control<FullFormType>;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export default function StepNavigation({
  step,
  totalSteps,
  control,
  onNext,
  onPrev,
  onSubmit,
  isSubmitting,
}: StepNavigationProps) {
  const name = useWatch({ control, name: "name" });
  const description = useWatch({ control, name: "description" });

  const isNextDisabled =
    (step === 1 && name.length < 2) || description.length < 5;

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center justify-center space-x-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-2 w-2 rounded-full",
              i + 1 === step ? "bg-accent" : "bg-muted-foreground",
            )}
          />
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between space-x-4">
        {step > 1 ? (
          <Button
            type="button"
            variant="outline"
            className="rounded-full px-8"
            onClick={onPrev}
          >
            Back
          </Button>
        ) : null}
        {step < totalSteps ? (
          <Button
            type="button"
            className="rounded-full px-8"
            onClick={onNext}
            disabled={isNextDisabled}
          >
            Next
          </Button>
        ) : (
          <Button
            type="button"
            disabled={isSubmitting}
            className="rounded-full px-8"
            onClick={onSubmit}
          >
            {isSubmitting ? "Creating..." : "Create"}
          </Button>
        )}
      </div>
    </div>
  );
}
