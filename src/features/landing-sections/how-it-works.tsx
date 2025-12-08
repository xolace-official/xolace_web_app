"use client";

import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Iphone15Pro from "@/components/ui/shadcn-io/iphone-15-pro";

type HowItWorksProps = {
  step: number;
  title: string;
  description: string;
};

export const howItWorksList: HowItWorksProps[] = [
  {
    step: 1,
    title: "Ignite a Spark",
    description:
      "A thought. A confession. A moment too heavy to hold alone. You release it into the circle, and the fire catches it with quiet understanding.",
  },
  {
    step: 2,
    title: "The Circle Responds",
    description:
      "Kindlers and Guides turn your Spark into an Ember—reflecting back lived wisdom, warmth, and perspective that helps you breathe easier.",
  },
  {
    step: 3,
    title: "Follow the Glow",
    description:
      "Mini-campfires form around shared experiences. You’re not posting for attention—you’re gathering with people who genuinely resonate.",
  },
  {
    step: 4,
    title: "Grow at Your Pace",
    description:
      "Daily prompts, gentle emotional wins, and a space built for resilience help you strengthen your inner world one ember at a time.",
  },
  {
    step: 5,
    title: "Go Deeper When Ready",
    description:
      "Private, optional 1-on-1 sessions with Guides—human, grounded, and free from the cold clinical distance—wait whenever you choose to step closer.",
  },
];

const videoList = [
  "https://videos.pexels.com/video-files/27180348/12091515_2560_1440_50fps.mp4",
  "https://videos.pexels.com/video-files/27180348/12091515_2560_1440_50fps.mp4",
  "https://videos.pexels.com/video-files/27180348/12091515_2560_1440_50fps.mp4",
];

export const HowItWorksSection = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(false);

  useEffect(() => {
    // Change video every 5 seconds
    const interval = setInterval(() => {
      setIsRotating(true);

      // After rotation animation (1 second), change video
      setTimeout(() => {
        setCurrentVideoIndex((prev) => (prev + 1) % videoList.length);
        setIsRotating(false);
      }, 1000);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="howItWorks" className={"section"}>
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

      <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16 w-full">
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <div
            className="transition-transform duration-1000 ease-in-out"
            style={{
              transform: isRotating ? "rotateY(360deg)" : "rotateY(0deg)",
              transformStyle: "preserve-3d",
            }}
          >
            <Iphone15Pro
              key={currentVideoIndex}
              className="w-[60vw] max-w-[250px] max-h-[400px] sm:w-full sm:max-w-[300px] sm:max-h-[500px] md:max-h-[600px]"
              videoSrc={videoList[currentVideoIndex]}
            />
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col gap-5">
          {howItWorksList.map((item) => (
            <div key={item.step} className="flex gap-4 items-start">
              <span className="text-muted-foreground font-semibold text-sm pt-1">
                {item.step}.
              </span>
              <div className="flex flex-col gap-1">
                <h2 className="text-xl font-semibold">{item.title}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
          <Button className="w-fit font-bold group/arrow ml-8 mt-8">
            Step Into the Circle
            <ArrowRight className="size-5 ml-2 group-hover/arrow:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};
