"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useCreateCampfireMutation } from "@/hooks/campfires/use-create-campfire";
import { generateCampfireSlug } from "@/lib/utils";
import { toFile } from "@/utils/helpers/uploadImageToBucket";
import {
  type CampfireLane,
  type CampfireRealm,
  type CampfireRule,
  CampfireVisibility,
  campfireFieldsByStep,
  FullFormSchema,
  type FullFormType,
} from "@/validation/create-campfire";
import CampfirePreviewCard from "./campfire-preview-card";
import RulesEditor from "./rules-editor";
import { StepConfirm, StepConfirmTerms } from "./step-confirm";
import StepFormFields from "./step-form-fields";
import StepNavigation from "./step-navigation";

const TOTAL_STEPS = campfireFieldsByStep.length + 2;

const STEP_TITLES = [
  {
    title: "Start your Campfire",
    description:
      "A name and description to help people understand what your campfire is all about.",
  },
  {
    title: "Define the Purpose & Visibility",
    description:
      "Purpose of your campfire help campers understand what to expect from your campfire.",
  },
  {
    title: "Customize Your Campfire Appearance",
    description: "Customize the appearance of your Campfire.",
  },
  {
    title: "Add Rules",
    description:
      "Set expectations or regulations for your campfire. You can always edit these rules later.",
  },
  {
    title: "Confirm your Campfire",
    description: "Review your campfire details and confirm before creating.",
  },
];

interface CreateCampfireModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateCampfireModal = ({
  open,
  onOpenChange,
}: CreateCampfireModalProps) => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [wordCount, setWordCount] = useState(0);

  const [bannerBlob, setBannerBlob] = useState<Blob | null>(null);
  const [iconBlob, setIconBlob] = useState<Blob | null>(null);
  const [bannerBlobType, setBannerBlobType] = useState("");
  const [iconBlobType, setIconBlobType] = useState("");

  const [rules, setRules] = useState<CampfireRule[]>([]);

  const createCampfireMutation = useCreateCampfireMutation();

  const form = useForm<FullFormType>({
    resolver: zodResolver(FullFormSchema),
    defaultValues: {
      name: "",
      description: "",
      visibility: CampfireVisibility.Public,
      realm: "" as CampfireRealm,
      lane: "" as CampfireLane,
      rules: [],
      icon_url: "",
      banner_url: "",
    },
    mode: "onTouched",
  });

  const handleFinalSubmit = async (data: FullFormType) => {
    const formData = new FormData();
    const generatedSlug = generateCampfireSlug(data.name);
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("visibility", data.visibility);
    formData.append("realm", data.realm);
    formData.append("lane", data.lane);
    formData.append("rules", JSON.stringify(rules));
    formData.append("slug", generatedSlug);

    if (iconBlob) {
      formData.append(
        "icon",
        toFile(iconBlob, `icon_${Date.now()}`, iconBlobType),
      );
    }
    if (bannerBlob) {
      formData.append(
        "banner",
        toFile(bannerBlob, `banner_${Date.now()}`, bannerBlobType),
      );
    }

    createCampfireMutation.mutate(formData, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onSuccess: (result: {
        success: boolean;
        data?: any;
        message?: string;
      }) => {
        if (result.success) {
          form.reset();
          setStep(1);
          onOpenChange(false);
          router.push(`/x/${generatedSlug}`);
        }
      },
      onError: (error: Error) => {
        toast.error(error.message || "Failed to create campfire");
        setStep(TOTAL_STEPS);
      },
    });
  };

  const nextStep = async () => {
    if (step === 4) {
      setStep((prev) => prev + 1);
      return;
    }

    if (step < 1 || step - 1 >= campfireFieldsByStep.length) {
      if (step < TOTAL_STEPS) {
        setStep((prev) => prev + 1);
      }
      return;
    }

    if (step === 2) {
      if (!form.getValues("realm")) {
        toast.error("Please select a realm");
        return;
      }
      if (!form.getValues("lane")) {
        toast.error("Please select a lane");
        return;
      }
    }

    const currentStepFields = campfireFieldsByStep[step - 1];
    const fieldsToValidate = currentStepFields.map((f) => f.name);

    const isValid = await form.trigger(
      fieldsToValidate as (keyof FullFormType)[],
    );

    if (isValid) {
      if (step < TOTAL_STEPS) {
        setStep((prev) => prev + 1);
      }
    } else {
      toast.error(`Validation failed for step ${step}`);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset();
      setStep(1);
      setBannerBlob(null);
      setIconBlob(null);
      setBannerBlobType("");
      setIconBlobType("");
      setRules([]);
      setWordCount(0);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        className="w-full max-w-[95vw] sm:max-w-[750px] rounded-2xl!  sm:rounded-3xl"
      >
        <DialogHeader className={`${step === 4 ? "mb-5" : "mb-3"}`}>
          <DialogTitle>{STEP_TITLES[step - 1].title}</DialogTitle>
          <DialogDescription>
            {STEP_TITLES[step - 1].description}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <div className="w-full space-y-4">
            <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-12">
              <div className="order-2 col-span-1 md:order-1 md:col-span-7">
                <div className="max-h-[30vh] md:max-h-[calc(100vh-280px)] overflow-y-auto space-y-4 pr-2">
                  {step < 4 ? (
                    <StepFormFields
                      step={step}
                      form={form}
                      bannerBlob={bannerBlob}
                      setBannerBlob={setBannerBlob}
                      iconBlob={iconBlob}
                      setIconBlob={setIconBlob}
                      bannerBlobType={bannerBlobType}
                      setBannerBlobType={setBannerBlobType}
                      iconBlobType={iconBlobType}
                      setIconBlobType={setIconBlobType}
                      wordCount={wordCount}
                      setWordCount={setWordCount}
                    />
                  ) : null}
                  {step === 4 ? (
                    <div className="space-y-6">
                      <RulesEditor rules={rules} onChange={setRules} />
                    </div>
                  ) : null}
                  {step === 5 ? <StepConfirm /> : null}
                </div>
              </div>

              <CampfirePreviewCard step={step} control={form.control} />
            </div>

            {step === 5 ? <StepConfirmTerms /> : null}
            <StepNavigation
              step={step}
              totalSteps={TOTAL_STEPS}
              control={form.control}
              onNext={nextStep}
              onPrev={prevStep}
              onSubmit={() => form.handleSubmit(handleFinalSubmit)()}
              isSubmitting={createCampfireMutation.isPending}
            />
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCampfireModal;
