"use client";

import {
  DoorOpen,
  Goal,
  MonitorSmartphone,
  Newspaper,
  PictureInPicture,
  Users,
} from "lucide-react";
import type React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SlapProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
}

const slapList: SlapProps[] = [
  {
    icon: MonitorSmartphone,
    title: "Designed For Real Life",
    description: `Healing doesn't schedule itself. So we shaped Xolace to follow you from sunrise thoughts to the quiet questions that find you at night.`,
  },
  {
    icon: Users,
    title: "You're Not Alone",
    description: `Every whisper, every confession, every trembling truth someone out there carries a piece of your story too. Here, your echoes return as understanding.`,
  },
  {
    icon: Goal,
    title: "Built Around Your Journey",
    description: `No noise, no clutter. Only the words, voices, and guidance that lift your spirit gently back into its own light.`,
  },
  {
    icon: PictureInPicture,
    title: "Calm You Can Feel",
    description: `Soft colors, grounded visuals, spaces that feel like exhaling. Design that holds you, not overwhelms you.`,
  },
  {
    icon: DoorOpen,
    title: "A Door You Only Need to Open Once",
    description: `One step toward clarity. One moment of courage. One breath that begins again.`,
  },
  {
    icon: Newspaper,
    title: "Honesty at First Sight",
    description: `We speak plainly, because healing blooms where truth is allowed to grow.`,
  },
];

export const EmotionalSlapSection = () => {
  return (
    <section id="emotionalSlap" className="section">
      <div className={"section-parent-header"}>
        <h2 className="section-header text-center">
          The Internet Was Never Built For Your Heart
        </h2>
        <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground ">
          You weren’t meant to heal on platforms built to distract you. You
          weren’t meant to open your heart inside places made to break it. So we
          built something different.
        </h3>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {slapList.map(({ icon: IconComponent, title, description }) => (
          <div key={title}>
            <Card className="h-full bg-background border-0 shadow-none">
              <CardHeader className="flex justify-center items-center">
                <div className="bg-primary/20 p-2 rounded-full ring-8 ring-primary/10">
                  <IconComponent className="w-10 h-10" />
                </div>

                <CardTitle>{title}</CardTitle>
              </CardHeader>

              <CardContent className="text-muted-foreground text-center">
                {description}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
};
