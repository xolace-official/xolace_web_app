"use client";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ChevronLeft, X } from "lucide-react";
import { AnimatePresence, motion, type Transition } from "motion/react";
import * as React from "react";
import useMeasure from "react-use-measure";
import { Drawer as DrawerPrimitive } from "vaul";
import { cn } from "@/lib/utils";

// =============================================================================
// TYPES
// =============================================================================

type DrawerDirection = "top" | "bottom" | "left" | "right";

interface StepConfig<T extends string = string> {
  id: T;
  title?: string;
  description?: string;
}

interface AnimatedDrawerContextValue<T extends string = string> {
  open: boolean;
  setOpen: (open: boolean) => void;
  currentStep: T;
  steps: StepConfig<T>[];
  direction: "forward" | "backward";
  goToStep: (stepId: T) => void;
  goBack: () => void;
  canGoBack: boolean;
  close: () => void;
  history: T[];
}

interface AnimatedDrawerProps<T extends string = string> {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  /** Initial step ID for multi-step drawers */
  initialStep?: T;
  /** Step configuration for multi-step drawers */
  steps?: StepConfig<T>[];
  /** Called when step changes */
  onStepChange?: (stepId: T, direction: "forward" | "backward") => void;
  /** Drawer direction (vaul prop) */
  direction?: DrawerDirection;
  /** Should close on outside click */
  dismissible?: boolean;
  /** Additional vaul drawer props */
  shouldScaleBackground?: boolean;
  modal?: boolean;
  nested?: boolean;
}

interface AnimatedDrawerContentProps
  extends Omit<
    React.ComponentProps<typeof DrawerPrimitive.Content>,
    "asChild"
  > {
  /** Custom overlay className */
  overlayClassName?: string;
  /** Whether to show the drag handle */
  showHandle?: boolean;
  /** Maximum width of the drawer */
  maxWidth?: string;
  /** Custom animation transition */
  transition?: Transition;
  /** Whether to show the header with back/close buttons */
  showHeader?: boolean;
  /** Custom close button */
  closeButton?: React.ReactNode;
  /** Custom back button */
  backButton?: React.ReactNode;
}

interface AnimatedDrawerStepProps<T extends string = string> {
  stepId: T;
  children: React.ReactNode;
  className?: string;
}

// =============================================================================
// CONTEXT
// =============================================================================

const AnimatedDrawerContext =
  React.createContext<AnimatedDrawerContextValue | null>(null);

function useAnimatedDrawer<T extends string = string>() {
  const context = React.useContext(AnimatedDrawerContext);
  if (!context) {
    throw new Error(
      "useAnimatedDrawer must be used within an AnimatedDrawerProvider",
    );
  }
  return context as unknown as AnimatedDrawerContextValue<T>;
}

// =============================================================================
// ROOT COMPONENT
// =============================================================================

function AnimatedDrawerRoot<T extends string = string>({
  children,
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
  initialStep,
  steps = [],
  onStepChange,
  direction = "bottom",
  dismissible = true,
  shouldScaleBackground = false,
  modal = true,
  nested = false,
}: AnimatedDrawerProps<T>) {
  // Controlled vs uncontrolled open state
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = React.useCallback(
    (newOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [isControlled, onOpenChange],
  );

  // Step management
  const defaultStep = (initialStep ?? steps[0]?.id ?? "default") as T;
  const [currentStep, setCurrentStep] = React.useState<T>(defaultStep);
  const [history, setHistory] = React.useState<T[]>([defaultStep]);
  const [animationDirection, setAnimationDirection] = React.useState<
    "forward" | "backward"
  >("forward");

  // Reset to initial step when drawer closes
  React.useEffect(() => {
    if (!open) {
      // Small delay to allow close animation to complete
      const timer = setTimeout(() => {
        setCurrentStep(defaultStep);
        setHistory([defaultStep]);
        setAnimationDirection("forward");
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open, defaultStep]);

  const goToStep = React.useCallback(
    (stepId: T) => {
      setAnimationDirection("forward");
      setCurrentStep(stepId);
      setHistory((prev) => [...prev, stepId]);
      onStepChange?.(stepId, "forward");
    },
    [onStepChange],
  );

  const goBack = React.useCallback(() => {
    if (history.length <= 1) return;

    setAnimationDirection("backward");
    const newHistory = [...history];
    newHistory.pop();
    const previousStep = newHistory[newHistory.length - 1];
    setCurrentStep(previousStep);
    setHistory(newHistory);
    onStepChange?.(previousStep, "backward");
  }, [history, onStepChange]);

  const canGoBack = history.length > 1;

  const close = React.useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const contextValue: AnimatedDrawerContextValue<T> = React.useMemo(
    () => ({
      open,
      setOpen,
      currentStep,
      steps,
      direction: animationDirection,
      goToStep,
      goBack,
      canGoBack,
      close,
      history,
    }),
    [
      open,
      setOpen,
      currentStep,
      steps,
      animationDirection,
      goToStep,
      goBack,
      canGoBack,
      close,
      history,
    ],
  );

  return (
    <AnimatedDrawerContext.Provider
      value={contextValue as unknown as AnimatedDrawerContextValue}
    >
      <DrawerPrimitive.Root
        open={open}
        onOpenChange={setOpen}
        direction={direction}
        dismissible={dismissible}
        shouldScaleBackground={shouldScaleBackground}
        modal={modal}
        nested={nested}
      >
        {children}
      </DrawerPrimitive.Root>
    </AnimatedDrawerContext.Provider>
  );
}

// =============================================================================
// TRIGGER
// =============================================================================

const AnimatedDrawerTrigger = React.forwardRef<
  React.ComponentRef<typeof DrawerPrimitive.Trigger>,
  React.ComponentProps<typeof DrawerPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Trigger
    ref={ref}
    data-slot="animated-drawer-trigger"
    className={className}
    {...props}
  />
));
AnimatedDrawerTrigger.displayName = "AnimatedDrawerTrigger";

// =============================================================================
// OVERLAY
// =============================================================================

const AnimatedDrawerOverlay = React.forwardRef<
  React.ComponentRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentProps<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    data-slot="animated-drawer-overlay"
    className={cn(
      "fixed inset-0 z-50 bg-black/50",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
  />
));
AnimatedDrawerOverlay.displayName = "AnimatedDrawerOverlay";

// =============================================================================
// CONTENT
// =============================================================================

const defaultTransition: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 35,
  mass: 0.8,
};

const AnimatedDrawerContent = React.forwardRef<
  React.ComponentRef<typeof DrawerPrimitive.Content>,
  AnimatedDrawerContentProps
>(
  (
    {
      className,
      children,
      overlayClassName,
      showHandle = true,
      maxWidth = "420px",
      transition = defaultTransition,
      showHeader = false,
      closeButton,
      backButton,
      ...props
    },
    ref,
  ) => {
    const [measureRef, bounds] = useMeasure();
    const { canGoBack, goBack, close, currentStep, steps } =
      useAnimatedDrawer();

    // Find current step config
    const currentStepConfig = steps.find((s) => s.id === currentStep);

    return (
      <DrawerPrimitive.Portal>
        <AnimatedDrawerOverlay className={overlayClassName} />
        <DrawerPrimitive.Content
          ref={ref}
          data-slot="animated-drawer-content"
          asChild
          aria-describedby={undefined}
          className={cn(
            "fixed inset-x-4 bottom-4 z-50",
            "mx-auto overflow-hidden rounded-3xl",
            "bg-background outline-none",
            "md:mx-auto md:w-full",
            className,
          )}
          style={{ maxWidth }}
          {...props}
        >
          <motion.div
            animate={{ height: bounds.height > 0 ? bounds.height : "auto" }}
            transition={transition}
          >
            <VisuallyHidden>
              <DrawerPrimitive.Title>
                {currentStepConfig?.title ?? "Drawer"}
              </DrawerPrimitive.Title>
              {currentStepConfig?.description && (
                <DrawerPrimitive.Description>
                  {currentStepConfig.description}
                </DrawerPrimitive.Description>
              )}
            </VisuallyHidden>

            <div ref={measureRef}>
              {/* Optional handle for bottom drawers */}
              {showHandle && (
                <div className="flex justify-center pt-3 pb-1">
                  <div className="h-1.5 w-12 rounded-full bg-muted-foreground/30" />
                </div>
              )}

              {/* Optional header with navigation */}
              {showHeader && (
                <AnimatedDrawerHeader>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      {canGoBack &&
                        (backButton ?? (
                          <button
                            type="button"
                            onClick={goBack}
                            className="rounded-full p-1.5 hover:bg-muted transition-colors"
                            aria-label="Go back"
                          >
                            <ChevronLeft className="h-5 w-5 text-muted-foreground" />
                          </button>
                        ))}
                      {currentStepConfig?.title && (
                        <h2 className="text-lg font-semibold text-foreground">
                          {currentStepConfig.title}
                        </h2>
                      )}
                    </div>
                    {closeButton ?? (
                      <button
                        type="button"
                        onClick={close}
                        className="rounded-full p-1.5 hover:bg-muted transition-colors"
                        aria-label="Close drawer"
                      >
                        <X className="h-5 w-5 text-muted-foreground" />
                      </button>
                    )}
                  </div>
                  {currentStepConfig?.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {currentStepConfig.description}
                    </p>
                  )}
                </AnimatedDrawerHeader>
              )}

              {children}
            </div>
          </motion.div>
        </DrawerPrimitive.Content>
      </DrawerPrimitive.Portal>
    );
  },
);
AnimatedDrawerContent.displayName = "AnimatedDrawerContent";

// =============================================================================
// HEADER
// =============================================================================

function AnimatedDrawerHeader({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="animated-drawer-header"
      className={cn("px-6 py-4 border-b border-border", className)}
      {...props}
    >
      {children}
    </div>
  );
}

// =============================================================================
// BODY
// =============================================================================

function AnimatedDrawerBody({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="animated-drawer-body"
      className={cn("p-6", className)}
      {...props}
    >
      {children}
    </div>
  );
}

// =============================================================================
// FOOTER
// =============================================================================

function AnimatedDrawerFooter({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="animated-drawer-footer"
      className={cn(
        "flex items-center gap-3 px-6 py-4 border-t border-border",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// =============================================================================
// STEP - For multi-step drawers
// =============================================================================

const stepVariants = {
  enter: (direction: "forward" | "backward") => ({
    x: direction === "forward" ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: "forward" | "backward") => ({
    x: direction === "forward" ? "-100%" : "100%",
    opacity: 0,
  }),
};

const stepTransition: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 35,
  mass: 0.8,
};

function AnimatedDrawerStep<T extends string = string>({
  stepId,
  children,
  className,
}: AnimatedDrawerStepProps<T>) {
  const { currentStep, direction } = useAnimatedDrawer<T>();

  if (currentStep !== stepId) return null;

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={stepId}
        custom={direction}
        variants={stepVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={stepTransition}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// =============================================================================
// STEP CONTAINER - Wraps multiple steps with AnimatePresence
// =============================================================================

function AnimatedDrawerStepContainer({
  children,
  className,
  animate = true,
}: {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}) {
  const { currentStep, direction } = useAnimatedDrawer();

  // Filter to only show the current step
  const activeChild = React.Children.toArray(children).find((child) => {
    if (React.isValidElement(child) && child.type === AnimatedDrawerStep) {
      return (child.props as { stepId: string }).stepId === currentStep;
    }
    return false;
  });

  const animateProps = {
    variants: stepVariants,
    initial: "enter",
    animate: "center",
    exit: "exit",
  };

  return (
    <div className={cn("overflow-hidden", className)}>
      <AnimatePresence mode="wait" custom={direction}>
        {activeChild && React.isValidElement(activeChild) && (
          <motion.div
            key={(activeChild.props as { stepId: string }).stepId}
            custom={direction}
            {...(animate ? animateProps : {})}
            transition={stepTransition}
          >
            {(activeChild.props as { children: React.ReactNode }).children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// =============================================================================
// CLOSE BUTTON
// =============================================================================

const AnimatedDrawerClose = React.forwardRef<
  React.ComponentRef<typeof DrawerPrimitive.Close>,
  React.ComponentProps<typeof DrawerPrimitive.Close>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Close
    ref={ref}
    data-slot="animated-drawer-close"
    className={className}
    {...props}
  />
));
AnimatedDrawerClose.displayName = "AnimatedDrawerClose";

// =============================================================================
// TITLE & DESCRIPTION (for accessibility)
// =============================================================================

const AnimatedDrawerTitle = React.forwardRef<
  React.ComponentRef<typeof DrawerPrimitive.Title>,
  React.ComponentProps<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    data-slot="animated-drawer-title"
    className={cn("text-lg font-semibold text-foreground", className)}
    {...props}
  />
));
AnimatedDrawerTitle.displayName = "AnimatedDrawerTitle";

const AnimatedDrawerDescription = React.forwardRef<
  React.ComponentRef<typeof DrawerPrimitive.Description>,
  React.ComponentProps<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    data-slot="animated-drawer-description"
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
AnimatedDrawerDescription.displayName = "AnimatedDrawerDescription";

// =============================================================================
// COMPOUND COMPONENT EXPORT
// =============================================================================

export const AnimatedDrawer = Object.assign(AnimatedDrawerRoot, {
  Trigger: AnimatedDrawerTrigger,
  Content: AnimatedDrawerContent,
  Header: AnimatedDrawerHeader,
  Body: AnimatedDrawerBody,
  Footer: AnimatedDrawerFooter,
  Step: AnimatedDrawerStep,
  StepContainer: AnimatedDrawerStepContainer,
  Close: AnimatedDrawerClose,
  Title: AnimatedDrawerTitle,
  Description: AnimatedDrawerDescription,
});

export {
  AnimatedDrawerRoot,
  AnimatedDrawerTrigger,
  AnimatedDrawerContent,
  AnimatedDrawerOverlay,
  AnimatedDrawerHeader,
  AnimatedDrawerBody,
  AnimatedDrawerFooter,
  AnimatedDrawerStep,
  AnimatedDrawerStepContainer,
  AnimatedDrawerClose,
  AnimatedDrawerTitle,
  AnimatedDrawerDescription,
  useAnimatedDrawer,
};

export type {
  AnimatedDrawerProps,
  AnimatedDrawerContentProps,
  AnimatedDrawerStepProps,
  AnimatedDrawerContextValue,
  StepConfig,
  DrawerDirection,
};
