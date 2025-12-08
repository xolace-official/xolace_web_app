"use client";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandWhatsapp,
} from "@tabler/icons-react";
import { ChevronsDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { CtaButton } from "@/components/shared/layout/cta-button";
import { Separator } from "@/components/ui/separator";

const footerColumns = [
  {
    title: "Industries",
    links: ["Health Service", "Software", "Mental Health"],
  },
  {
    title: "Resources",
    links: ["Help Center", "FAQ", "Tutorials", "Blog"],
  },
  {
    title: "Comparisons",
    links: [
      "Heyflow alternative",
      "Google Forms Alternative",
      "ClickFunnels Alternative",
    ],
  },
  {
    title: "Legal",
    links: ["About Us", "Imprint", "Terms & Conditions", "Payment Terms"],
  },
];

const socialPlatforms: { name: string; url: string; icon: React.ReactNode }[] =
  [
    {
      name: "WhatsApp",
      url: "",
      icon: <IconBrandWhatsapp />,
    },
    {
      name: "Instagram",
      url: "",
      icon: <IconBrandInstagram />,
    },
    {
      name: "Facebook",
      url: "",
      icon: <IconBrandFacebook />,
    },
    {
      name: "LinkedIn",
      url: "",
      icon: <IconBrandLinkedin />,
    },
  ];

export const FooterSection = () => {
  const router = useRouter();

  return (
    <footer id={"footer"} className="relative w-full">
      {/* CTA Card */}
      <div className="relative z-80 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto -mb-32">
        <div className="bg-gradient-to-br from-accent/20 via-accent/50 to-accent/100 rounded-3xl shadow-2xl p-8 md:p-16 border">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-sm md:text-base text-foreground mb-4">
              Try xolace.app now
            </p>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-8">
              Start involving your thought today.
            </h2>
            <CtaButton
              label={"Get started for free"}
              onClick={() => router.push("/sign-up")}
            />
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="w-full pt-48 pb-4 bg-muted dark:bg-card px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-12 mb-12">
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link href="/" className="font-bold text-lg flex items-center">
              <ChevronsDown className="bg-gradient-to-tr border-secondary from-primary via-primary/70 to-primary rounded-lg w-9 h-9 mr-2 border" />
              XOLACE
            </Link>
            <p className="text-sm text-foreground/70 mt-2">
              &copy; {new Date().getFullYear()} All rights reserved.
            </p>
          </div>

          {footerColumns.map((col) => (
            <div key={col.title} className="flex flex-col gap-3">
              <h3 className="font-bold text-base mb-2">{col.title}</h3>
              {col.links.map((link) => (
                <Link
                  key={link}
                  href="#"
                  className="text-sm text-foreground/70 hover:text-foreground-100 transition-colors mb-2"
                >
                  {link}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <Separator className="my-8 bg-foreground" />

        {/* Bottom Bar */}
        <div className="flex flex-row justify-between items-center gap-4">
          <div className="flex gap-2">
            <p className="px-4 py-2 text-sm  rounded-md border border-foreground/50">
              EN
            </p>
          </div>

          <div className="flex gap-4">
            {socialPlatforms.map((platform) => (
              <Link key={platform.name} href={platform.url} className="">
                {platform.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
