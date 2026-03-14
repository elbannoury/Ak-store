import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, Shield, Smile, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Image reveal animation
      gsap.fromTo(
        imageRef.current,
        { clipPath: 'circle(0% at 50% 50%)', opacity: 0 },
        {
          clipPath: 'circle(100% at 50% 50%)',
          opacity: 1,
          duration: 1.5,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Content slide up animation
      const contentElements = contentRef.current?.querySelectorAll('.animate-item');
      if (contentElements) {
        gsap.fromTo(
          contentElements,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 60%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const features = [
    { icon: Heart, text: t('about.features.quality') },
    { icon: Shield, text: t('about.features.design') },
    { icon: Smile, text: t('about.features.comfort') },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full py-24 bg-white overflow-hidden"
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#f6b638]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#f58a1f]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="w-full section-padding">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Side */}
          <div ref={imageRef} className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="/about-image.jpg"
                alt="Happy kids with AK Kids clothes"
                className="w-full h-[500px] object-cover"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#211e0f]/30 to-transparent" />
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-6 -right-6 bg-[#f6b638] rounded-2xl p-6 shadow-xl">
              <p className="text-4xl font-bold text-[#211e0f]">5+</p>
              <p className="text-sm font-semibold text-[#211e0f]/80">Years of<br />Excellence</p>
            </div>

            {/* Decorative shapes */}
            <div className="absolute -top-4 -left-4 w-24 h-24 border-4 border-[#f6b638] rounded-2xl -z-10" />
            <div className="absolute -bottom-4 right-20 w-16 h-16 bg-[#f58a1f]/20 rounded-full -z-10" />
          </div>

          {/* Content Side */}
          <div ref={contentRef} className="lg:pl-8">
            <span className="animate-item inline-block px-4 py-2 bg-[#f6b638]/20 rounded-full text-sm font-semibold text-[#f58a1f] mb-4">
              About AK Kids
            </span>

            <h2
              className="animate-item text-4xl sm:text-5xl font-bold text-[#211e0f] mb-6"
              style={{ fontFamily: 'Rowdies, cursive' }}
            >
              {t('about.title')}
            </h2>

            <p className="animate-item text-lg text-[#211e0f]/70 mb-8 leading-relaxed">
              {t('about.description')}
            </p>

            {/* Features */}
            <div className="animate-item space-y-4 mb-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-[#fff9ed] rounded-xl 
                           hover:bg-[#f6b638]/10 transition-colors duration-300 group"
                >
                  <div className="w-12 h-12 bg-[#f6b638] rounded-xl flex items-center justify-center
                                group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-6 h-6 text-[#211e0f]" />
                  </div>
                  <span className="font-semibold text-[#211e0f]">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <a
              href="#shop"
              className="animate-item btn-primary inline-flex items-center gap-2 group"
            >
              {t('about.cta')}
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
