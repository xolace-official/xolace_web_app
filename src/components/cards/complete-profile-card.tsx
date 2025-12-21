import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { MinimalCard, MinimalCardContent } from "@/components/ui/minimal-card";
import { cn } from "@/lib/utils";
import { MotionDiv } from "../shared/motion-wrappers";

// Simple Circular Progress Component
// TODO: Any data fetching should be done in the circular progress component
const CircularProgress = ({
  value,
  size = 60,
  strokeWidth = 4,
  className,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
        role="img"
        aria-label={`Progress: ${value}%`}
      >
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-muted/30"
        />
        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-primary transition-all duration-1000 ease-out"
        />
      </svg>
      <span className="absolute text-xs font-semibold text-foreground">
        {value}%
      </span>
    </div>
  );
};

export async function CompleteProfileCard({
  className,
}: {
  className?: string;
}) {
  "use cache";
  return (
    <MotionDiv
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn("w-full", className)}
    >
      <MinimalCard className="relative overflow-hidden bg-card border-border/50 shadow-sm hover:border-border transition-colors">
        <MinimalCardContent className="p-5 flex items-center justify-between gap-4">
          <div className="flex flex-col gap-3 max-w-[70%]">
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                Complete your profile
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Unlock the full experience. You're almost there, just a few more
                steps to stand out.
              </p>
            </div>

            <Button
              asChild
              size="sm"
              variant="outline"
              className="w-fit gap-2 h-8 text-xs font-medium rounded-full bg-transparent border-primary/20 hover:bg-primary/5 hover:text-primary hover:border-primary/50 transition-all"
            >
              <Link href="/settings/account">
                Continue Setup
                <ArrowRight className="size-3" />
              </Link>
            </Button>
          </div>

          <div className="shrink-0 flex items-center justify-center p-2">
            <CircularProgress value={65} size={64} strokeWidth={5} />
          </div>
        </MinimalCardContent>
      </MinimalCard>
    </MotionDiv>
  );
}
