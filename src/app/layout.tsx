import type { Metadata, Viewport } from "next";
import { Nunito, PT_Sans } from "next/font/google";
import "./globals.css";

import { TooltipProvider } from "@/components/animate-ui/components/animate/tooltip";
import { MotionProvider } from "@/providers/motion-provider";
// Providers
import { ThemeProvider } from "@/providers/theme-provider";
import { ToastProvider } from "@/providers/toast-provider";

export const viewport: Viewport = {
  maximumScale: 1,
};

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    template: "%s | Xolace",
    default: "Xolace", // a default is required when creating a template
  },
  applicationName: "Xolace",
  description:
    "Xolace is a social platform designed for users to share their thoughts, stories, and experiences freely, fostering peer to peer engagement, self-expression and professional mental healthcare support in a unique, user-centered, community-like space",
  keywords: [
    "Xolace",
    "Social",
    "Platform",
    "Thoughts",
    "Stories",
    "Experiences",
    "Fostering",
    "Engagement",
    "Self-Expression",
    "Unique",
    "User-Centered",
    "Space",
    "Communities",
    "Healthcare",
    "Mental healthcare",
    "Professional Support",
  ],
  creator: "Xolace Inc.",
  publisher: "Xolace Inc.",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title:
      "Xolace | Social experiencing platform with a touch of mental health support",
    description:
      "Xolace is a social platform designed for users to share their thoughts, stories, and experiences freely, fostering peer to peer engagement, self-expression and professional mental healthcare support in a unique, user-centered, community-like space",
    url: "https://xolace.app",
    siteName: "Xolace",
    images: [
      {
        url: "/assets/images/mas.webp",
        width: 1200,
        height: 630,
        alt: "Xolace OG Banner",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const ptSans = PT_Sans({
  variable: "--font-pt-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`min-h-screen bg-background ${nunito.variable} ${ptSans.variable} antialiased scroll-smooth relative`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider>
            <MotionProvider>
              <TooltipProvider>
                <div className="texture" />
                {children}
              </TooltipProvider>
            </MotionProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
