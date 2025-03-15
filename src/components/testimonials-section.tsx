import { SectionHeading } from "@/components/ambro-ui/section-heading";
import { AnimatedSection } from "@/components/ambro-ui/animated-section";
import { AnimatedGradientBorder } from "@/components/ambro-ui/animated-gradient-border";
import Image from "next/image";

interface Testimonial {
  quote: string;
  author: string;
  position: string;
  image: string;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export default function TestimonialsSection({
  testimonials,
}: TestimonialsSectionProps) {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection animation="fadeIn">
          <SectionHeading
            title="Opinie klientów"
            subtitle="Co moi klienci mówią o współpracy ze mną"
            alignment="center"
            size="xl"
            gradient
            animation="fade"
          />
        </AnimatedSection>

        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <AnimatedSection
              key={testimonial.author}
              animation="fadeIn"
              delay={0.1 * index}
            >
              <AnimatedGradientBorder
                borderWidth={1}
                borderColor="from-indigo-500 via-purple-500 to-pink-500"
                glowEffect
                glowIntensity={5}
                animated
                backgroundColor="bg-gray-900/30"
                hoverEffect
              >
                <div className="p-6">
                  <div className="mb-4">
                    {/* Quote marks */}
                    <svg
                      className="w-8 h-8 text-indigo-400/50"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <title>Quote</title>
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>

                  <p className="text-gray-300 mb-6 italic">
                    {testimonial.quote}
                  </p>

                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.author}
                        className="w-full h-full object-cover"
                        width={100}
                        height={100}
                      />
                    </div>
                    <div>
                      <p className="font-medium">{testimonial.author}</p>
                      <p className="text-sm text-gray-400">
                        {testimonial.position}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedGradientBorder>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
