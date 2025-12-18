import Image from "next/image";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { POST_CARD_MEDIA_BLUR_DATA_URL } from "@/constants";
import { cn } from "@/lib/utils";
import type { PostCardMediaType } from "../post-card";

const BlurredContainedImage = ({
  src,
  alt,
  sizes,
  className,
}: PostCardMediaType & { sizes: string; className?: string }) => {
  return (
    <div
      className={cn("relative size-full overflow-hidden bg-muted", className)}
    >
      <Image
        src={src}
        alt=""
        aria-hidden="true"
        fill
        sizes={sizes}
        className="pointer-events-none select-none object-cover opacity-30 blur-2xl scale-[1.15] transform-gpu"
        priority={false}
      />

      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-background/0 via-background/0 to-background/20" />

      <Image
        src={src}
        alt={alt}
        placeholder="blur"
        blurDataURL={POST_CARD_MEDIA_BLUR_DATA_URL}
        fill
        sizes={sizes}
        className="object-contain"
        priority={false}
      />
    </div>
  );
};

export const PostCardMedia = ({ media }: { media: PostCardMediaType[] }) => {
  if (media.length === 0) return null;

  if (media.length === 1) {
    const item = media[0];
    return (
      <div className="relative mt-4 overflow-hidden rounded-3xl">
        <div className="relative aspect-16/10 w-full">
          <BlurredContainedImage
            src={item.src}
            alt={item.alt}
            sizes="(min-width: 768px) 640px, 100vw"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <Carousel className="relative">
        <CarouselContent className="ml-0">
          {media.map((item) => (
            <CarouselItem key={item.src} className="pl-0">
              <div className="relative overflow-hidden rounded-[20px]">
                <div className="relative aspect-16/10 w-full">
                  <BlurredContainedImage
                    src={item.src}
                    alt={item.alt}
                    sizes="(min-width: 768px) 640px, 100vw"
                  />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 top-1/2 -translate-y-1/2 bg-background/70 backdrop-blur" />
        <CarouselNext className="right-2 top-1/2 -translate-y-1/2 bg-background/70 backdrop-blur" />
      </Carousel>
    </div>
  );
};
