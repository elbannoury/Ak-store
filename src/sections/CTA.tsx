import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

const CTA = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Elastic scale animation
      gsap.fromTo(
        boxRef.current,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: 'elastic.out(1, 0.5)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Floating sparkles
      const sparkles = sectionRef.current?.querySelectorAll('.sparkle');
      if (sparkles) {
        sparkles.forEach((sparkle, i) => {
          gsap.to(sparkle, {
            y: -20,
            rotation: 360,
            duration: 3 + i * 0.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleShopNow = () => {
    navigate('/products');
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-24 bg-[#fff9ed] overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-pattern opacity-50" />

      {/* Floating Sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        <Sparkles className="sparkle absolute top-20 left-[10%] w-8 h-8 text-[#f6b638]/40" />
        <Sparkles className="sparkle absolute top-40 right-[15%] w-6 h-6 text-[#f58a1f]/40" />
        <Sparkles className="sparkle absolute bottom-32 left-[20%] w-10 h-10 text-[#f6b638]/30" />
        <Sparkles className="sparkle absolute bottom-20 right-[25%] w-7 h-7 text-[#f58a1f]/30" />
      </div>

      <div className="relative w-full section-padding">
        <div
          ref={boxRef}
          className="relative max-w-4xl mx-auto"
        >
          {/* Main CTA Box */}
          <div className="relative bg-gradient-to-br from-[#f6b638] to-[#f58a1f] rounded-3xl p-12 md:p-16 overflow-hidden">
            {/* Decorative Circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="absolute top-1/2 right-10 w-8 h-8 bg-white/20 rounded-full" />
            <div className="absolute bottom-10 left-1/3 w-6 h-6 bg-white/20 rounded-full" />

            {/* Content */}
            <div className="relative text-center">
              <h2
                className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#211e0f] mb-4"
                style={{ fontFamily: 'Rowdies, cursive' }}
              >
                {t('cta.title')}
              </h2>
              <p className="text-lg text-[#211e0f]/80 max-w-xl mx-auto mb-8">
                {t('cta.description')}
              </p>

              <Button
                onClick={handleShopNow}
                className="inline-flex items-center gap-3 bg-[#211e0f] text-white 
                         font-bold px-8 py-6 rounded-full text-lg
                         hover:bg-white hover:text-[#211e0f] 
                         transition-all duration-300 hover:scale-105 
                         hover:shadow-xl group"
              >
                {t('cta.button')}
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </div>
          </div>

          {/* Decorative Elements Around Box */}
          <div className="absolute -top-4 -left-4 w-16 h-16 border-4 border-[#f6b638] rounded-2xl -z-10" />
          <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-[#f58a1f]/20 rounded-full -z-10" />
        </div>
      </div>
    </section>
  );
};

export default CTA;
