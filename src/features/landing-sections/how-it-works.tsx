"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { CtaButton } from "@/components/shared/layout/cta-button";

interface HowItWorksItem {
  id: string;
  title: string;
  description: string[];
  image: string;
  cta: string;
  imagePosition: "left" | "right";
}

const howItWorksList: HowItWorksItem[] = [
  {
    id: "spark",
    title: "From Spark to Strength",
    description: [
      "A thought. A confession. A moment too heavy to hold alone. You release it into the circle, and the fire catches it with quiet understanding. Kindlers and Guides turn your Spark into an Ember reflecting back lived wisdom, warmth, and perspective that helps you breathe easier.",
      "Mini-campfires form around shared experiences. You’re not posting for attention you’re gathering with people who genuinely resonate.",
      "Daily prompts, gentle emotional wins, and a space built for resilience help you strengthen your inner world one ember at a time.",
    ],
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    cta: "Make A Spark",
    imagePosition: "left",
  },
  {
    id: "deeper",
    title: "Go Deeper When Ready",
    description: [
      "When you’re ready to go further, private 1-on-1 sessions open a deeper layer of support. Connect with licensed professionals and experienced guides including therapists, counselors, mentors, and wellness practitioners who help reduce stress and support mental and emotional wellbeing.",
      "These conversations are human, grounded, and pressure-free, meeting you exactly where you are. There’s no timeline and no expectation just a confidential space to explore, heal, and grow with guidance you can trust.",
    ],
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    cta: "Explore Guided Support",
    imagePosition: "right",
  },
];

export function HowItWorksSection() {
  const router = useRouter();

  return (
    <section id="howItWorks" className="section">
      <div className="section-parent-header">
        <h2 className="section-header text-center">
          Built With the Architecture of Empathy.
        </h2>
        <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground mb-8">
          Healing isn’t linear. Connection isn’t loud. Here, every step is
          gentle, intentional, and shaped around what your heart can carry
          today.
        </h3>
      </div>

      <div className="flex flex-col gap-8 md:gap-12">
        {howItWorksList.map((step) => {
          const isImageLeft = step.imagePosition === "left";

          return (
            <div
              key={step.id}
              className="flex flex-col items-center justify-center md:flex-row gap-2 md:gap-8"
            >
              <div
                className={`w-full md:w-1/2 ${isImageLeft ? "flex " : "flex md:hidden"}`}
              >
                <Image
                  src={step.image}
                  alt={step.title}
                  width={400}
                  height={400}
                  className="w-full h-[400px] object-cover"
                />
              </div>

              <div className="w-full md:w-1/2 space-y-4 md:space-y-8">
                <h3 className="text-3xl md:text-4xl font-bold">{step.title}</h3>
                <p className="text-muted-foreground flex flex-col gap-4 md:gap-8">
                  {step.description.map((desc) => (
                    <p key={desc}>{desc}</p>
                  ))}
                </p>
                <CtaButton
                  label={step.cta}
                  onClick={() => router.push("/feed")}
                />
              </div>

              <div
                className={`w-full md:w-1/2 ${!isImageLeft ? "hidden md:flex" : "hidden"}`}
              >
                <Image
                  src={step.image}
                  alt={step.title}
                  width={400}
                  height={400}
                  className="w-full h-[400px] object-cover"
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
