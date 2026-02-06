"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { helpFaqs } from "./help-center-data";

export function FaqSection() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFaqs = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return helpFaqs;

    return helpFaqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(term) ||
        faq.answer.toLowerCase().includes(term),
    );
  }, [searchTerm]);

  return (
    <div className="space-y-6">
      {/* Search */}
      <InputGroup>
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupInput
          type="text"
          placeholder="Search for help..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>

      {/* FAQ List */}
      <div className="rounded-lg border bg-card">
        {filteredFaqs.length > 0 ? (
          <Accordion type="single" collapsible className="px-4">
            {filteredFaqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="px-4 py-8 text-center text-muted-foreground">
            <p>No results found for "{searchTerm}"</p>
            <p className="text-sm mt-1">Try a different search term</p>
          </div>
        )}
      </div>
    </div>
  );
}
