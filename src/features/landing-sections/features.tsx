"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

enum ProService {
  YES = 1,
  NO = 0,
}
interface ServiceProps {
  title: string;
  pro: ProService;
  description: string;
}
const serviceList: ServiceProps[] = [
  {
    title: "Access to Qualified Professionals",
    description:
      "Connect with licensed therapists and mental health professionals.",
    pro: 1,
  },
  {
    title: "Real-time Messaging & Peer Support",
    description:
      "Chat instantly with peers who understand your experiences and provide mutual support.",
    pro: 0,
  },
  {
    title: "Mentor Support",
    description:
      "Connect with mentors who've walked similar paths and can guide you through your journey.",
    pro: 1,
  },
  {
    title: "Privacy & Anonymity Options",
    description:
      "Control your identity and information with flexible privacy settings designed for your safety.",
    pro: 0,
  },
];

export const FeaturesSection = () => {
  return (
    <section id="whyXolace" className="section">
      <div className={"section-parent-header"}>
        <h2 className="section-header text-center">What Makes Us Different</h2>

        <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground">
          Xolace combines professional mental health support with a safe,
          anonymous community - offering comprehensive care that traditional
          therapy and social platforms can't match alone.
        </h3>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-8 w-full lg:w-[60%] mx-auto">
        {serviceList.map(({ title, description, pro }) => (
          <Card
            key={title}
            className="bg-muted/60 dark:bg-card h-full relative"
          >
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <Badge
              data-pro={ProService.YES === pro}
              variant="secondary"
              className="absolute -top-2 -right-3 data-[pro=false]:hidden"
            >
              PRO
            </Badge>
          </Card>
        ))}
      </div>
    </section>
  );
};
