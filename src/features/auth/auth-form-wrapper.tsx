"use client";

import { HeartPulse } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  imageSrc: string;
};

export function AuthFormWrapper({ children, imageSrc }: Props) {
  return (
    <div className="grid lg:grid-cols-5 w-full min-h-screen">
      <div className="relative size-full lg:col-span-2">
        <div className="absolute inset-4 lg:right-2 rounded-2xl overflow-hidden">
          <div className="h-full flex flex-col gap-6 justify-between py-8 md:p-8">
            <motion.div
              animate={{ height: "auto" }}
              className="md:max-w-md w-full mx-auto grow flex flex-col justify-center max-lg:px-1"
            >
              <AnimatePresence mode="sync">{children}</AnimatePresence>
            </motion.div>

            <div className="text-balance text-center text-xs text-gray-600 [&_button]:underline [&_button]:underline-offset-4 hover:[&_button]:text-gray-900">
              If you are in a crisis or any other person may be in danger -
              don't use this app.{" "}
              <Link
                className="underline underline-offset-3 text-primary font-semibold"
                href="https://www.nami.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                These resources
              </Link>{" "}
              can provide you with immediate help.
            </div>
          </div>
        </div>

        <div className="absolute top-3 md:top-10 left-5 md:left-10 z-10 flex gap-4 items-center">
          <HeartPulse size={32} className="text-primary" />
        </div>
      </div>

      <div className="hidden lg:block lg:col-span-3 relative size-full">
        <motion.div
          initial={{ opacity: 0.6, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-4 lg:left-2 bg-primary rounded-2xl overflow-hidden"
        >
          <Image
            src={imageSrc}
            alt="auth hero background"
            className="size-full object-cover rounded-2xl overflow-hidden"
            fill
            priority
            loading="eager"
            unoptimized
          />
        </motion.div>
      </div>
    </div>
  );
}

export function AuthHeader({
  title,
  subtitle,
  description,
  titleClassName,
  subtitleClassName,
}: {
  title: string;
  subtitle?: string;
  description?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}) {
  return (
    <div className="flex flex-col items-start">
      <h1
        className={cn("text-4xl font-bold text-foreground/90", titleClassName)}
      >
        {title}
      </h1>
      {subtitle && (
        <h2 className={cn("text-2xl font-bold sm:text-5xl", subtitleClassName)}>
          {subtitle}
        </h2>
      )}
      {description && (
        <p className="text-balance text-gray-600">{description}</p>
      )}
    </div>
  );
}
