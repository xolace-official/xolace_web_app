/** biome-ignore-all lint/a11y/noLabelWithoutControl: just a demo */
"use client";

import {
  Ban,
  FileKey,
  KeyRound,
  Lock,
  ScanFace,
  Shield,
  TextQuote,
  TriangleAlert,
  X,
} from "lucide-react";
import { useState } from "react";
import {
  AnimatedDrawer,
  type StepConfig,
  useAnimatedDrawer,
} from "@/components/builders/animated-drawer";
import { Button } from "@/components/ui/button";

// =============================================================================
// STEP IDS - Type-safe step identifiers
// =============================================================================

type WalletSettingsStep = "default" | "key" | "phrase" | "remove";

const WALLET_STEPS: StepConfig<WalletSettingsStep>[] = [
  { id: "default", title: "Wallet Settings" },
  { id: "key", title: "Private Key" },
  { id: "phrase", title: "Recovery Phrase" },
  { id: "remove", title: "Remove Wallet" },
];

// =============================================================================
// STEP CONTENT COMPONENTS
// =============================================================================

function DefaultStepContent() {
  const { goToStep, close } = useAnimatedDrawer<WalletSettingsStep>();

  return (
    <AnimatedDrawer.Body>
      <div className="flex items-center justify-between w-full mb-6">
        <h2 className="text-lg font-medium text-foreground">Wallet Settings</h2>
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full hover:bg-muted"
          onClick={close}
        >
          <X className="text-muted-foreground" size={18} />
        </Button>
      </div>

      <div className="flex flex-col items-start gap-4">
        <button
          type="button"
          onClick={() => goToStep("key")}
          className="bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium flex items-center gap-2 w-full rounded-2xl px-4 py-3.5 transition-colors"
        >
          <Lock size={20} />
          View Private Key
        </button>
        <button
          type="button"
          onClick={() => goToStep("phrase")}
          className="bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium flex items-center gap-2 w-full rounded-2xl px-4 py-3.5 transition-colors"
        >
          <KeyRound size={20} />
          View Recovery Phrase
        </button>
        <button
          type="button"
          onClick={() => goToStep("remove")}
          className="bg-destructive/10 hover:bg-destructive/20 text-destructive font-medium flex items-center gap-2 w-full rounded-2xl px-4 py-3.5 transition-colors"
        >
          <TriangleAlert size={20} />
          Remove Wallet
        </button>
      </div>
    </AnimatedDrawer.Body>
  );
}

function PrivateKeyStepContent() {
  const { goBack, close } = useAnimatedDrawer<WalletSettingsStep>();

  return (
    <AnimatedDrawer.Body className="space-y-4">
      <div className="flex justify-between">
        <FileKey size={24} className="text-foreground" />
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full hover:bg-muted"
          onClick={close}
        >
          <X className="text-muted-foreground" size={18} />
        </Button>
      </div>

      <h2 className="font-medium text-xl text-foreground">Private Key</h2>

      <p className="text-muted-foreground font-light text-lg">
        Your private key is a cryptographic key that proves ownership of your
        wallet. Treat it with the same security as your bank account details.
      </p>

      <div className="border-t border-border space-y-5 text-muted-foreground text-lg">
        <div className="flex items-center gap-4 mt-5">
          <Shield size={20} />
          <h3>Store it in a secure location</h3>
        </div>
        <div className="flex items-center gap-4">
          <TextQuote size={20} />
          <h3>Never share with anyone</h3>
        </div>
        <div className="flex items-center gap-4">
          <Ban size={20} />
          <h3>We cannot recover it for you</h3>
        </div>
      </div>

      <div className="flex items-center justify-start gap-4 pt-2">
        <Button
          onClick={goBack}
          className="w-36 h-12 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-3xl text-lg transition-colors"
        >
          Cancel
        </Button>
        <Button
          onClick={goBack}
          className="w-42 h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-3xl text-lg flex items-center gap-3 transition-colors"
        >
          <ScanFace size={20} />
          Show Key
        </Button>
      </div>
    </AnimatedDrawer.Body>
  );
}

function RecoveryPhraseStepContent() {
  const { goBack, close } = useAnimatedDrawer<WalletSettingsStep>();

  return (
    <AnimatedDrawer.Body className="space-y-4">
      <div className="flex justify-between">
        <FileKey size={24} className="text-foreground" />
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full hover:bg-muted"
          onClick={close}
        >
          <X className="text-muted-foreground" size={18} />
        </Button>
      </div>

      <h2 className="font-medium text-xl text-foreground">Recovery Phrase</h2>

      <p className="text-muted-foreground font-light text-lg">
        Your recovery phrase is the master key to your wallet. Write it down and
        store it securely. Anyone with this phrase can access your funds.
      </p>

      <div className="border-t border-border space-y-5 text-muted-foreground text-lg">
        <div className="flex items-center gap-4 mt-5">
          <Shield size={20} />
          <h3>Store it in a secure location</h3>
        </div>
        <div className="flex items-center gap-4">
          <TextQuote size={20} />
          <h3>Never share with anyone</h3>
        </div>
        <div className="flex items-center gap-4">
          <Ban size={20} />
          <h3>We cannot recover it for you</h3>
        </div>
      </div>

      <div className="flex items-center justify-start gap-4 pt-2">
        <Button
          onClick={goBack}
          className="w-36 h-12 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-3xl text-lg transition-colors"
        >
          Cancel
        </Button>
        <Button
          onClick={goBack}
          className="w-42 h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-3xl text-lg flex items-center gap-3 transition-colors"
        >
          <ScanFace size={20} />
          Show Phrase
        </Button>
      </div>
    </AnimatedDrawer.Body>
  );
}

function RemoveWalletStepContent() {
  const { goBack, close } = useAnimatedDrawer<WalletSettingsStep>();

  return (
    <AnimatedDrawer.Body className="space-y-4">
      <div className="flex justify-between">
        <TriangleAlert size={24} className="text-destructive" />
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full hover:bg-muted"
          onClick={close}
        >
          <X className="text-muted-foreground" size={18} />
        </Button>
      </div>

      <h2 className="font-medium text-xl text-foreground">Remove Wallet?</h2>

      <p className="text-muted-foreground font-light text-lg">
        This action cannot be undone. Make sure you&apos;ve backed up your
        recovery phrase before proceeding. You&apos;ll lose access to all funds
        if you don&apos;t have a backup.
      </p>

      <div className="flex items-center justify-start gap-4 pt-2">
        <Button
          onClick={goBack}
          className="w-36 h-12 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-3xl text-lg transition-colors"
        >
          Cancel
        </Button>
        <Button
          onClick={close}
          className="w-36 h-12 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-3xl text-lg transition-colors"
        >
          Remove
        </Button>
      </div>
    </AnimatedDrawer.Body>
  );
}

// =============================================================================
// MAIN DEMO COMPONENT
// =============================================================================

export function DemoAnimatedDrawer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        className="mt-5 px-6 rounded-full bg-card py-2 font-medium text-card-foreground border border-border transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring md:font-medium"
        onClick={() => setIsOpen(true)}
      >
        Open Animated Drawer
      </Button>

      <AnimatedDrawer<WalletSettingsStep>
        open={isOpen}
        onOpenChange={setIsOpen}
        steps={WALLET_STEPS}
        initialStep="default"
        onStepChange={(stepId, direction) => {
          console.log(`Step changed to: ${stepId} (${direction})`);
        }}
      >
        <AnimatedDrawer.Content showHandle={false} maxWidth="361px">
          {/* Using StepContainer for automatic step transitions */}
          <AnimatedDrawer.StepContainer animate={false}>
            <AnimatedDrawer.Step stepId="default">
              <DefaultStepContent />
            </AnimatedDrawer.Step>

            <AnimatedDrawer.Step stepId="key">
              <PrivateKeyStepContent />
            </AnimatedDrawer.Step>

            <AnimatedDrawer.Step stepId="phrase">
              <RecoveryPhraseStepContent />
            </AnimatedDrawer.Step>

            <AnimatedDrawer.Step stepId="remove">
              <RemoveWalletStepContent />
            </AnimatedDrawer.Step>
          </AnimatedDrawer.StepContainer>
        </AnimatedDrawer.Content>
      </AnimatedDrawer>
    </>
  );
}

// =============================================================================
// SIMPLE SINGLE-STEP DEMO
// =============================================================================

export function DemoSimpleDrawer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        className="rounded-full"
        onClick={() => setIsOpen(true)}
      >
        Open Simple Drawer
      </Button>

      <AnimatedDrawer open={isOpen} onOpenChange={setIsOpen}>
        <AnimatedDrawer.Content>
          <AnimatedDrawer.Body>
            <div className="flex items-center justify-between w-full mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                Simple Drawer
              </h2>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => setIsOpen(false)}
              >
                <X size={18} />
              </Button>
            </div>
            <p className="text-muted-foreground">
              This is a simple single-step drawer. It animates its height
              automatically based on content.
            </p>
          </AnimatedDrawer.Body>
          <AnimatedDrawer.Footer>
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button className="flex-1" onClick={() => setIsOpen(false)}>
              Confirm
            </Button>
          </AnimatedDrawer.Footer>
        </AnimatedDrawer.Content>
      </AnimatedDrawer>
    </>
  );
}

// =============================================================================
// DEMO WITH BUILT-IN HEADER
// =============================================================================

type OnboardingStep = "welcome" | "profile" | "preferences" | "complete";

const ONBOARDING_STEPS: StepConfig<OnboardingStep>[] = [
  { id: "welcome", title: "Welcome", description: "Let's get you started" },
  { id: "profile", title: "Profile", description: "Tell us about yourself" },
  {
    id: "preferences",
    title: "Preferences",
    description: "Customize your experience",
  },
  { id: "complete", title: "All Done!", description: "You're ready to go" },
];

function OnboardingContent() {
  const { currentStep, goToStep, close } = useAnimatedDrawer<OnboardingStep>();

  const stepContent: Record<OnboardingStep, React.ReactNode> = {
    welcome: (
      <div className="text-center py-8">
        <div className="text-5xl mb-4">👋</div>
        <h3 className="text-xl font-semibold mb-2">Welcome aboard!</h3>
        <p className="text-muted-foreground mb-6">
          We&apos;re excited to have you here. Let&apos;s set up your account.
        </p>
        <Button onClick={() => goToStep("profile")} className="w-full">
          Get Started
        </Button>
      </div>
    ),
    profile: (
      <div className="py-4 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Display Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            className="w-full px-4 py-2 rounded-lg border border-border bg-background"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Bio</label>
          <textarea
            placeholder="Tell us about yourself"
            className="w-full px-4 py-2 rounded-lg border border-border bg-background resize-none"
            rows={3}
          />
        </div>
        <Button onClick={() => goToStep("preferences")} className="w-full">
          Continue
        </Button>
      </div>
    ),
    preferences: (
      <div className="py-4 space-y-4">
        <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
          <span>Dark Mode</span>
          <div className="w-10 h-6 bg-primary rounded-full" />
        </div>
        <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
          <span>Notifications</span>
          <div className="w-10 h-6 bg-muted rounded-full" />
        </div>
        <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
          <span>Email Updates</span>
          <div className="w-10 h-6 bg-primary rounded-full" />
        </div>
        <Button onClick={() => goToStep("complete")} className="w-full">
          Finish Setup
        </Button>
      </div>
    ),
    complete: (
      <div className="text-center py-8">
        <div className="text-5xl mb-4">🎉</div>
        <h3 className="text-xl font-semibold mb-2">You&apos;re all set!</h3>
        <p className="text-muted-foreground mb-6">
          Your account is ready. Start exploring now.
        </p>
        <Button onClick={close} className="w-full">
          Let&apos;s Go
        </Button>
      </div>
    ),
  };

  return <AnimatedDrawer.Body>{stepContent[currentStep]}</AnimatedDrawer.Body>;
}

export function DemoOnboardingDrawer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="default"
        className="rounded-full"
        onClick={() => setIsOpen(true)}
      >
        Open Onboarding Flow
      </Button>

      <AnimatedDrawer<OnboardingStep>
        open={isOpen}
        onOpenChange={setIsOpen}
        steps={ONBOARDING_STEPS}
        initialStep="welcome"
      >
        <AnimatedDrawer.Content showHeader showHandle={false} maxWidth="400px">
          <OnboardingContent />
        </AnimatedDrawer.Content>
      </AnimatedDrawer>
    </>
  );
}

// =============================================================================
// COMBINED DEMO EXPORT
// =============================================================================

export function AnimatedDrawerShowcase() {
  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <h1 className="text-2xl font-bold mb-4">Animated Drawer Demos</h1>

      <div className="flex flex-wrap gap-4 justify-center">
        <DemoSimpleDrawer />
        <DemoAnimatedDrawer />
        <DemoOnboardingDrawer />
      </div>
    </div>
  );
}
