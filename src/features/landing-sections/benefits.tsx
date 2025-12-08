"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BenefitsProps {
  icon: string;
  title: string;
  description: string;
}

const benefitList: BenefitsProps[] = [
  {
    icon: "UserCheck",
    title: "Anonymous by Design",
    description:
      "Share as yourself or stay hidden. Sparks let you express raw, honest moments without pressure, persona, or judgment.",
  },
  {
    icon: "Users",
    title: "Community That Leans In",
    description:
      "Kindlers gather around your story, not your image. Real support, real understanding, real connection—no performance.",
  },
  {
    icon: "HeartHandshake",
    title: "Guides Who Feel Human",
    description:
      "Verified professionals sit in the circle with you. No ads, no scripts, no sponsorships—just presence and empathy.",
  },
  {
    icon: "Video",
    title: "A Feed That Teaches",
    description:
      "Experience Stories from vetted Mentors offer real wisdom and lived insight. Not algorithm bait—just resonance.",
  },
];

export const BenefitsSection = () => {
  return (
    <section id="benefits" className="section">
      <div className="flex flex-col gap-4">
        <h2 className={"section-parent-header section-header text-center"}>
          At The Heart Of Xolace
        </h2>

        <div className="grid md:grid-cols-4 gap-4 md:gap-8 w-full">
          {benefitList.map(({ title, description }) => (
            <Card
              key={title}
              className="bg-muted/50 dark:bg-card hover:bg-background transition-all delay-75 group/number"
            >
              <CardHeader className={"space-y-2"}>
                <div className="flex justify-between">
                  <Image
                    src="/vercel.svg"
                    alt="RadixLogo"
                    className="h-full w-full rounded-md object-cover"
                    width={200}
                    height={200}
                  />
                </div>

                <CardTitle>{title}</CardTitle>
              </CardHeader>

              <CardContent className="text-muted-foreground">
                {description}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
