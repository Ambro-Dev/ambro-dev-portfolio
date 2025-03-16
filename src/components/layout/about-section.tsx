import { SectionHeading } from "@/components/ambro-ui/section-heading";
import { RevealText } from "@/components/ambro-ui/reveal-text";
import { Card3D } from "@/components/ambro-ui/card-3d";
import { AnimatedSection } from "@/components/ambro-ui/animated-section";
import { AnimatedGradientBorder } from "@/components/ambro-ui/animated-gradient-border";

export const AboutMeSection = () => {
  return (
    <section className="py-24 px-6 relative bg-gradient-to-b from-gray-900 to-gray-950">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection animation="slideUp">
          <SectionHeading
            title="O mnie"
            subtitle="DevOps Engineer & Fullstack Developer"
            alignment="center"
            size="xl"
            gradient
            highlightWords={[2]}
            animation="fade"
            delay={0.2}
          />
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-12 mt-16">
          <AnimatedSection animation="slideLeft" delay={0.3}>
            <Card3D
              interactive
              interactiveStrength={10}
              glowEffect
              glowColor="rgba(99, 102, 241, 0.5)"
              shadow
              bgColor="bg-gray-900/80"
              borderColor="border-indigo-500/20"
              height="100%"
            >
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-6 text-white bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                  Moja wizja
                </h3>
                <div className="text-gray-200 mb-6 text-lg">
                  <RevealText staggerLines delay={0.5}>
                    <span>
                      Tworzenie rozwiązań technologicznych, które łączą
                    </span>
                    <span>
                      niezawodną infrastrukturę z nowoczesnymi aplikacjami,
                    </span>
                    <span>umożliwiając firmom szybszy rozwój i innowacje.</span>
                  </RevealText>
                </div>
                <p className="text-gray-300 mt-auto">
                  Posiadam wieloletnie doświadczenie zarówno w obszarze DevOps,
                  jak i tworzenia aplikacji webowych, co pozwala mi oferować
                  kompleksowe rozwiązania technologiczne dostosowane do
                  indywidualnych potrzeb biznesowych.
                </p>
              </div>
            </Card3D>
          </AnimatedSection>

          <AnimatedSection animation="slideRight" delay={0.4}>
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-8">
                Dlaczego warto mnie wybrać
              </h3>

              <div className="space-y-6">
                {[
                  {
                    title: "Kompleksowa wiedza",
                    desc: "Łączę kompetencje w obszarze DevOps i programowania Fullstack, co pozwala na holistyczne podejście do projektów.",
                    icon: "🔄",
                  },
                  {
                    title: "Doświadczenie praktyczne",
                    desc: "Posiadam wieloletnie doświadczenie w zarządzaniu serwerami, automatyzacji procesów IT oraz tworzeniu aplikacji webowych.",
                    icon: "⚙️",
                  },
                  {
                    title: "Podejście zorientowane na cel",
                    desc: "Koncentruję się na dostarczaniu rozwiązań, które realnie wspierają cele biznesowe i przynoszą wymierną wartość.",
                    icon: "🎯",
                  },
                  {
                    title: "Ciągły rozwój",
                    desc: "Nieustannie poszerzam swoją wiedzę o najnowsze technologie i najlepsze praktyki w branży IT.",
                    icon: "📈",
                  },
                ].map((item, index) => (
                  <AnimatedGradientBorder
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    key={index}
                    borderWidth={2}
                    borderColor="from-indigo-500 via-purple-500 to-pink-500"
                    glowEffect
                    glowIntensity={8}
                    animated
                    backgroundColor="bg-gray-900/90"
                    className="hover:scale-102 transition-transform duration-300"
                  >
                    <div className="p-5 flex items-start">
                      <div className="text-2xl mr-4">{item.icon}</div>
                      <div>
                        <h4 className="font-bold mb-2 text-white">
                          {item.title}
                        </h4>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </AnimatedGradientBorder>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default AboutMeSection;
