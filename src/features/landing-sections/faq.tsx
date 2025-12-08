"use client";
import { Plus } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import ContactUsForm from "@/features/landing-sections/contact-us-form";

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

// Hardcoded frequently asked questions.
const FAQList: FAQProps[] = [
  {
    question: "What exactly is Xolace?",
    answer:
      "It’s a quiet circle built for emotional clarity, reflection, and connection. You share a Spark, the community responds with Embers, and you grow from the warmth of perspectives rooted in lived experience not algorithms.",
    value: "item-1",
  },
  {
    question: "Who gets to see my Spark?",
    answer:
      "Only your Circle real people intentionally gathered around shared experiences. Nothing is public, nothing is broadcast for attention. Your words glow where they’re held with care.",
    value: "item-3",
  },
  {
    question: "What makes Xolace different from social media?",
    answer:
      "No noise. No performance. No chasing attention. Instead, you get slow conversation, thoughtful reflections, tiny emotional wins, and a community that listens instead of reacts.",
    value: "item-5",
  },
  {
    question: "How does safety and anonymity work?",
    answer:
      "You choose what you reveal and when. Your identity is protected, and every Spark is moderated through intention, not surveillance. Respect is the law of the circle.",
    value: "item-6",
  },
  {
    question: "Does Xolace cost anything?",
    answer:
      "The core experience Sparks, Embers, and Circles is free. Optional deeper sessions with Guides may have a fee, but only if you choose them.",
    value: "item-7",
  },
];

export const FAQSection = () => {
  return (
    <section id="faq" className="section">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Side - FAQ Accordion */}
          <div className={"flex flex-col gap-4"}>
            <div className={"section-parent-header gap-4"}>
              <h2 className="text-lg text-primary tracking-wider font-semibold">
                FAQS
              </h2>
              <h1 className="section-header">Common Questions</h1>
            </div>

            <Accordion type="single" collapsible className="space-y-2">
              {FAQList.map(({ question, answer, value }, index) => (
                <div key={value}>
                  <AccordionItem value={value} className="border-none">
                    <AccordionTrigger className="text-left hover:no-underline py-4 px-0 text-xl md:text-2xl font-semibold hover:text-primary transition-colors [&[data-state=open]>svg]:rotate-45">
                      <div className="flex items-center gap-4 flex-1">
                        <span className="flex-1">{question}</span>
                        <Plus className="h-6 w-6 text-primary shrink-0 transition-transform duration-300" />
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="text-muted-foreground pb-5 pt-2 text-base leading-relaxed">
                      {answer}
                    </AccordionContent>
                  </AccordionItem>
                  {index < FAQList.length - 1 && <Separator className="my-2" />}
                </div>
              ))}
            </Accordion>
          </div>

          {/*Right side - contact us form*/}
          <div className="relative">
            <div className="absolute -inset-8 bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-3xl opacity-60"></div>

            <div className="relative bg-card border-2 border-border rounded-2xl overflow-hidden shadow-2xl">
              <ContactUsForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
