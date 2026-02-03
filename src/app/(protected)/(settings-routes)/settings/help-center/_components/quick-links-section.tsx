import Link from "next/link";
import { InfoIcon, ShieldIcon, MailIcon, ExternalLinkIcon } from "lucide-react";
import { SettingsPanel, SettingsPanelSection } from "@/components/settings";

const quickLinks = [
  {
    href: "/about",
    label: "About Xolace",
    description: "Learn about our story and mission",
    icon: InfoIcon,
    external: false,
  },
  {
    href: "/policies",
    label: "Policies",
    description: "Privacy policy and terms of service",
    icon: ShieldIcon,
    external: false,
  },
  {
    href: "mailto:xolace25@gmail.com",
    label: "Email Us",
    description: "xolace25@gmail.com",
    icon: MailIcon,
    external: true,
  },
];

const socialLinks = [
  {
    href: "https://whatsapp.com/channel/0029Vb68RgXGpLHPmY1pL73s",
    label: "WhatsApp",
  },
  {
    href: "https://www.instagram.com/xolaceinc/",
    label: "Instagram",
  },
  {
    href: "https://x.com/xolaceinc",
    label: "X (Twitter)",
  },
];

export function QuickLinksSection() {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold">Quick Links</h2>

      <SettingsPanel>
        {quickLinks.map((link) => (
          <SettingsPanelSection
            key={link.href}
            title={
              <span className="flex items-center gap-2">
                <link.icon className="size-4 text-muted-foreground" />
                {link.label}
              </span>
            }
            description={link.description}
          >
            <Link
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLinkIcon className="size-4" />
            </Link>
          </SettingsPanelSection>
        ))}
      </SettingsPanel>

      {/* Social Links */}
      <div className="rounded-lg border bg-card px-4 py-3">
        <p className="text-sm font-medium mb-2">Follow us</p>
        <div className="flex flex-wrap gap-3">
          {socialLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
