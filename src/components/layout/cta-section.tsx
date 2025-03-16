import { EnhancedButton } from "@/components/ambro-ui/enhanced-button";
import { GradientText } from "@/components/ambro-ui/gradient-text";
import { RevealText } from "@/components/ambro-ui/reveal-text";
import { AnimatedSection } from "@/components/ambro-ui/animated-section";
import { FloatingBubbles } from "@/components/ambro-ui/floating-bubbles";

export default function CTASection() {
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <FloatingBubbles
          count={20}
          color="rgba(99, 102, 241, 0.2)"
          maxSize={150}
          minSize={30}
          interactive={false}
        />
      </div>
      <div className="max-w-4xl mx-auto relative z-10">
        <AnimatedSection animation="fadeIn">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <GradientText
                from="indigo-500"
                via="purple-500"
                to="pink-500"
                glowEffect
              >
                Gotowy na transformację technologiczną?
              </GradientText>
            </h2>

            <div className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              <RevealText>
                Skontaktuj się ze mną, aby omówić, jak mogę pomóc w rozwoju
                Twojego biznesu poprzez nowoczesne rozwiązania DevOps i
                aplikacje webowe.
              </RevealText>
            </div>

            <EnhancedButton
              variant="tech"
              size="xl"
              href="/kontakt"
              magneticEffect
              glowOnHover
              rippleEffect
              animatedBg
            >
              Rozpocznij projekt
            </EnhancedButton>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
