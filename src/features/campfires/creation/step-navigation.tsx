"use client";

import { type Control, useWatch } from "react-hook-form";
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

/**
 * Render step indicators and navigation controls for a multi-step form.
 *
 * Watches the form's `name` and `description` fields to enable/disable the Next button
 * and switches the final action to a Create button that reflects submission state.
 *
 * @param step - Current 1-based step index
 * @param totalSteps - Total number of steps in the flow
 * @param control - react-hook-form Control for the form (used to watch `name` and `description`)
 * @param onNext - Handler invoked to advance to the next step
 * @param onPrev - Handler invoked to go back to the previous step
 * @param onSubmit - Handler invoked to submit the form on the final step
 * @param isSubmitting - True while the form submission is in progress
 * @returns The navigation UI as JSX for the current step state
 */
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
            key={`step-indicator-${i + 1}`}
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
