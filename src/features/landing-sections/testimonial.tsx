"use client";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { CtaButton } from "@/components/shared/layout/cta-button";
import { useRouter } from "next/navigation";

interface Props {
  id: string;
  quote: string;
  name: string;
  role: string;
  image: string;
  rating: number;
}
//Hardcoded testimonials
const testimonials: Props[] = [
  {
    id: "animaK",
    quote:
      "I came here carrying things I never had words for. Somehow, strangers felt like warm lanterns—reflecting me back to myself with honesty and grace.",
    name: "Amina K.",
    role: "Fire starter",
    image: "https://i.pravatar.cc/150?img=47",
    rating: 5,
  },
  {
    id: "danielO",
    quote:
      "The first Spark I shared felt scary. But the response… it was like someone cupped their hands around my fear and whispered, 'You’re not alone.'",
    name: "Daniel O.",
    role: "Kindler",
    image: "https://i.pravatar.cc/150?img=32",
    rating: 5,
  },
  {
    id: "linaS",
    quote:
      "Every Ember I received carried a softness I didn’t know I needed. This isn’t an app—it’s a living, breathing circle of people who actually care.",
    name: "Lina S.",
    role: "Guide",
    image: "https://i.pravatar.cc/150?img=21",
    rating: 5,
  },
  {
    id: "kwesiA",
    quote:
      "There’s something rare here. No noise. No judgment. Just humans meeting humans in the quiet places we usually hide.",
    name: "Kwesi A.",
    role: "Circle Member",
    image: "https://i.pravatar.cc/150?img=14",
    rating: 5,
  },
  {
    id: "mayaF",
    quote:
      "The mini-campfires changed everything. I finally saw my experience reflected by others walking their own difficult roads—and somehow my path felt lighter.",
    name: "Maya F.",
    role: "Camper",
    image: "https://i.pravatar.cc/150?img=55",
    rating: 5,
  },
];

export const TestimonialSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  };

  const getCardStyle = (index: number) => {
    const diff =
      (index - currentIndex + testimonials.length) % testimonials.length;

    if (diff === 0) {
      // Current card - on top, centered
      return {
        transform: "translateX(0%) translateY(0%) scale(1) rotate(0deg)",
        opacity: 1,
        zIndex: 30,
      };
    } else if (diff === 1) {
      // Next card - behind, slightly to the right and rotated
      return {
        transform: "translateX(60%) translateY(8%) scale(0.92) rotate(8deg)",
        opacity: 0.6,
        zIndex: 20,
      };
    } else if (diff === testimonials.length - 1) {
      // Previous card - behind, slightly to the left and rotated
      return {
        transform: "translateX(-60%) translateY(8%) scale(0.92) rotate(-8deg)",
        opacity: 0.6,
        zIndex: 20,
      };
    } else {
      // Hidden cards
      return {
        transform: "translateX(0%) translateY(20%) scale(0.85)",
        opacity: 0,
        zIndex: 10,
      };
    }
  };

  return (
    <section id="testimonials" className="section">
      <div className="w-full max-w-6xl mx-auto">
        <h2 className="section-header text-center">
          Hear What Our 150+ Campers Say
        </h2>

        <div className="relative h-[550px] md:h-[500px] flex items-center justify-center  overflow-hidden">
          <button
            onClick={prev}
            type={"button"}
            className="absolute left-0 md:left-4 z-40 w-12 h-12 md:w-14 md:h-14 rounded-full bg-background shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          <button
            onClick={next}
            type={"button"}
            className="absolute right-0 md:right-4 z-40 w-12 h-12 md:w-14 md:h-14 rounded-full bg-background shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          {/* Cards Stack */}
          <div className="relative w-full max-w-3xl h-full flex items-center justify-center overflow-hidden md:overflow-visible">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className="absolute w-full max-w-xl md:max-w-xl transition-all duration-700 ease-out "
                style={getCardStyle(index)}
              >
                <div className="bg-card rounded-2xl md:rounded-3xl shadow-2xl p-8 md:p-12 min-h-[420px] flex flex-col border">
                  {/*Rating stars */}
                  <div className="flex gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={`${testimonial.name}-star-${i}`}
                        className="w-5 h-5 fill-primary text-primary"
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-xl font-medium leading-relaxed mb-4 flex-grow">
                    "{testimonial.quote}"
                  </p>

                  {/* Author Info */}
                  <div className="flex items-center gap-4 mt-auto">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      height={20}
                      width={20}
                      className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover border-2"
                    />
                    <div className="flex flex-col">
                      <h4 className="text-lg font-bold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 ">
          {testimonials.map(({ id }, index) => (
            <button
              key={id}
              type={"button"}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-8 bg-primary"
                  : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
        <div className={"pt-4 md:pt-8 flex items-end justify-end mx-auto"}>
          <CtaButton
            label={"Read More Here"}
            onClick={() => router.push("/feed")}
          />
        </div>
      </div>
    </section>
  );
};
