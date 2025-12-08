"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CtaButton } from "@/components/shared/layout/cta-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Iphone15Pro from "@/components/ui/shadcn-io/iphone-15-pro";
import { RollingText } from "@/components/ui/shadcn-io/rolling-text";
import { Safari } from "@/components/ui/shadcn-io/safari";

export const HeroSection = () => {
  const router = useRouter();
  return (
    <section id={"hero"} className="w-full relative">
      <div className="sticky top-0 flex overflow-hidden section mb-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-primary/20 rounded-full blur-3xl"></div>
          <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-2xl"></div>
        </div>
        <div className="text-center space-y-8 max-w-screen-md mx-auto py-6 md:py-12 px-4 z-10 relative">
          <Badge variant="outline" className="text-sm py-2">
            <span className="mr-2 text-primary">
              <Badge>New</Badge>
            </span>
            <span> Feature is out now! </span>
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold flex flex-wrap items-center justify-center gap-x-3">
            <RollingText
              text="The Internet"
              transition={{ duration: 0.6, delay: 0, ease: "easeOut" }}
            />
            <RollingText
              text="Inner"
              className={"text-primary"}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            />
            <RollingText
              text="Voice"
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            />
          </h1>

          <p className="max-w-screen-sm mx-auto text-xl text-muted-foreground">
            A Place That Feels Like Exhaling. Not a feed. Not a clinic. A
            digital campfire built for the moments you never say out loud.
          </p>

          <div className="flex flex-col md:flex-row place-items-center justify-center gap-4">
            <CtaButton
              label={"Join the Circle"}
              onClick={() => router.push("/sign-up")}
            />

            <Button
              asChild
              variant="secondary"
              className="w-5/6 md:w-1/4 font-bold"
            >
              <Link
                href="https://github.com/nobruf/shadcn-landing-page.git"
                target="_blank"
              >
                Learn How It Works
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="relative z-20 bg-background">
        <div className="lg:max-w-screen-xl mx-auto px-4 -mt-18">
          <div className="relative group">
            <div className="absolute top-2 lg:-top-8 left-1/2 transform -translate-x-1/2 w-[80%] mx-auto h-24 lg:h-80 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="hidden md:block bg-card rounded-3xl p-8">
              <Safari
                url="xolace.app"
                className="size-full"
                height={600}
                mode={"default"}
                videoSrc="https://videos.pexels.com/video-files/27180348/12091515_2560_1440_50fps.mp4"
              />
            </div>
            <div className={"flex md:hidden items-center justify-center "}>
              <Iphone15Pro
                className="w-[60vw] max-w-[250px] max-h-[400px] sm:w-full sm:max-w-[300px] sm:max-h-[500px] md:max-h-[600px]"
                videoSrc="https://videos.pexels.com/video-files/27180348/12091515_2560_1440_50fps.mp4"
              />
            </div>
            <div className="absolute bottom-0 left-0 w-full h-20 md:h-28 bg-gradient-to-b from-background/0 via-background/50 to-background rounded-b-xl pointer-events-none"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
