import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, Truck, RefreshCw, Headphones } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, React.ElementType> = {
  Sparkles,
  Truck,
  RefreshCw,
  Headphones,
};

const Features = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGPathElement>(null);

  const features = [
    { id: 'quality', icon: 'Sparkles' },
    { id: 'delivery', icon: 'Truck' },
    { id: 'returns', icon: 'RefreshCw' },
    { id: 'support', icon: 'Headphones' },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Line drawing animation
      if (lineRef.current) {
        const length = lineRef.current.getTotalLength();
        gsap.set(lineRef.current, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });

        gsap.to(lineRef.current, {
          strokeDashoffset: 0,
          duration: 2,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        });
      }

      // Feature cards animation
      const cards = featuresRef.current?.querySelectorAll('.feature-card');
      if (cards) {
        cards.forEach((card, i) => {
          gsap.fromTo(
            card,
            { scale: 0, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.6,
              delay: i * 0.2,
              ease: 'back.out(1.7)',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 60%',
                toggleActions: 'play none none reverse',
              },
            }
          );

          // Continuous breathing animation
          gsap.to(card.querySelector('.icon-container'), {
            scale: 1.05,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: i * 0.3,
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-24 bg-[#fff9ed] overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-pattern opacity-30" />

      <div className="relative w-full section-padding">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-[#f6b638]/20 rounded-full text-sm font-semibold text-[#f58a1f] mb-4">
            Our Promise
          </span>
          <h2
            className="text-4xl sm:text-5xl font-bold text-[#211e0f] mb-4"
            style={{ fontFamily: 'Rowdies, cursive' }}
          >
            {t('features.title')}
          </h2>
        </div>

        {/* Features Grid with Connecting Line */}
        <div className="relative">
          {/* SVG Connecting Line - Desktop only */}
          <svg
            className="absolute top-1/2 left-0 w-full h-4 -translate-y-1/2 hidden lg:block"
            preserveAspectRatio="none"
          >
            <path
              ref={lineRef}
              d="M 100 8 Q 300 8 400 8 Q 500 8 600 8 Q 700 8 800 8 Q 900 8 1000 8 Q 1100 8 1200 8"
              fill="none"
              stroke="#f6b638"
              strokeWidth="3"
              strokeLinecap="round"
              className="opacity-50"
            />
          </svg>

          {/* Feature Cards */}
          <div
            ref={featuresRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature) => {
              const IconComponent = iconMap[feature.icon];
              return (
                <div
                  key={feature.id}
                  className="feature-card relative"
                >
                  <div className="relative bg-white rounded-3xl p-8 shadow-lg 
                                hover:shadow-2xl transition-all duration-500 
                                hover:-translate-y-2 text-center group">
                    {/* Icon */}
                    <div
                      className="icon-container w-20 h-20 bg-[#f6b638] rounded-2xl 
                                flex items-center justify-center mx-auto mb-6
                                group-hover:bg-[#f58a1f] transition-colors duration-300
                                shadow-lg shadow-[#f6b638]/30"
                    >
                      <IconComponent className="w-10 h-10 text-[#211e0f]" />
                    </div>

                    {/* Content */}
                    <h3
                      className="text-xl font-bold text-[#211e0f] mb-3
                               group-hover:text-[#f58a1f] transition-colors duration-300"
                      style={{ fontFamily: 'Rowdies, cursive' }}
                    >
                      {t(`features.${feature.id}.title`)}
                    </h3>
                    <p className="text-[#211e0f]/60">
                      {t(`features.${feature.id}.description`)}
                    </p>

                    {/* Decorative dot */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 
                                  w-4 h-4 bg-[#f6b638] rounded-full 
                                  opacity-0 group-hover:opacity-100 
                                  transition-opacity duration-300" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
