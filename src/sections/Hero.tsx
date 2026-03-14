import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import gsap from 'gsap';

const Hero = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const kidImageRef = useRef<HTMLDivElement>(null);
  const babyImageRef = useRef<HTMLDivElement>(null);
  const shapesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation - 3D flip and drop
      const chars = titleRef.current?.querySelectorAll('.char');
      if (chars) {
        gsap.fromTo(
          chars,
          { rotateX: 90, y: -100, opacity: 0 },
          {
            rotateX: 0,
            y: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.05,
            ease: 'elastic.out(1, 0.5)',
            delay: 0.3,
          }
        );
      }

      // Kid image animation
      gsap.fromTo(
        kidImageRef.current,
        { x: 200, rotate: -10, opacity: 0 },
        {
          x: 0,
          rotate: 5,
          opacity: 1,
          duration: 1.4,
          ease: 'power3.out',
          delay: 0.4,
        }
      );

      // Baby image animation
      gsap.fromTo(
        babyImageRef.current,
        { x: -200, rotate: 10, opacity: 0 },
        {
          x: 0,
          rotate: -5,
          opacity: 1,
          duration: 1.4,
          ease: 'power3.out',
          delay: 0.6,
        }
      );

      // Shapes animation
      const shapes = shapesRef.current?.querySelectorAll('.shape');
      if (shapes) {
        gsap.fromTo(
          shapes,
          { scale: 0, rotate: 0 },
          {
            scale: 1,
            rotate: 180,
            duration: 1,
            stagger: 0.1,
            ease: 'back.out(1.7)',
            delay: 0.8,
          }
        );
      }

      // Continuous floating animations
      gsap.to(kidImageRef.current, {
        y: -15,
        rotation: -5,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to(babyImageRef.current, {
        y: -10,
        rotation: 5,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.5,
      });

      // Shapes continuous rotation
      if (shapes) {
        shapes.forEach((shape, i) => {
          gsap.to(shape, {
            rotation: 360,
            duration: 20 + i * 5,
            repeat: -1,
            ease: 'none',
          });
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Mouse move 3D tilt effect
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(container, {
        rotateY: x * 10,
        rotateX: -y * 10,
        duration: 0.5,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(container, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.5,
        ease: 'power2.out',
      });
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const handleShopCollection = () => {
    navigate('/products');
  };

  const handleExploreMore = () => {
    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const titleChars = t('hero.title').split('');

  return (
    <section
      id="home"
      className="relative min-h-screen w-full overflow-hidden bg-[#fff9ed] pt-24 pb-12"
      style={{ perspective: '1000px' }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-pattern opacity-50" />

      {/* Floating Shapes */}
      <div ref={shapesRef} className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="shape absolute top-20 left-[10%] w-16 h-16 bg-[#f6b638]/30 rounded-full" />
        <div className="shape absolute top-40 right-[15%] w-12 h-12 bg-[#f58a1f]/30 rounded-lg rotate-45" />
        <div className="shape absolute bottom-32 left-[20%] w-20 h-20 bg-[#f6b638]/20 rounded-full" />
        <div className="shape absolute top-1/3 right-[8%] w-8 h-8 bg-[#f58a1f]/40 rounded-full" />
        <div className="shape absolute bottom-20 right-[25%] w-14 h-14 bg-[#f6b638]/25 rounded-lg rotate-12" />
        <div className="shape absolute top-28 left-[5%] w-6 h-6 bg-[#f58a1f]/30 rounded-full" />
      </div>

      {/* Main Content Container */}
      <div
        ref={containerRef}
        className="relative w-full section-padding min-h-[calc(100vh-6rem)] flex items-center"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="w-full grid lg:grid-cols-3 gap-8 items-center">
          {/* Baby Image - Left */}
          <div
            ref={babyImageRef}
            className="hidden lg:block relative z-10"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="relative">
              <img
                src="/hero-baby.png"
                alt="AK Baby"
                className="w-full max-w-[350px] mx-auto drop-shadow-2xl transition-transform duration-300 hover:scale-105"
              />
              {/* Glow effect */}
              <div className="absolute inset-0 bg-[#f6b638]/20 blur-3xl -z-10 rounded-full scale-75" />
            </div>
          </div>

          {/* Center Content */}
          <div className="text-center z-20">
            {/* Sparkle badges */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="inline-flex items-center gap-1 px-4 py-2 bg-[#f6b638]/20 rounded-full text-sm font-semibold text-[#211e0f]">
                <Sparkles className="w-4 h-4 text-[#f58a1f]" />
                New Collection
              </span>
            </div>

            {/* Main Title */}
            <h1
              ref={titleRef}
              className="text-6xl sm:text-7xl lg:text-8xl font-bold text-[#211e0f] mb-4"
              style={{ fontFamily: 'Rowdies, cursive', perspective: '500px' }}
            >
              {titleChars.map((char, i) => (
                <span
                  key={i}
                  className="char inline-block"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </h1>

            {/* Subtitle */}
            <p className="text-xl sm:text-2xl text-[#f58a1f] font-bold mb-4">
              {t('hero.subtitle')}
            </p>

            {/* Description */}
            <p className="text-lg text-[#211e0f]/70 max-w-md mx-auto mb-8">
              {t('hero.description')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                onClick={handleShopCollection}
                className="btn-primary flex items-center gap-2 text-lg group"
              >
                {t('hero.ctaPrimary')}
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
              <Button
                onClick={handleExploreMore}
                variant="outline"
                className="btn-secondary flex items-center gap-2 text-lg"
              >
                {t('hero.ctaSecondary')}
              </Button>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 mt-12">
              <div className="text-center">
                <p className="text-3xl font-bold text-[#f6b638]">10K+</p>
                <p className="text-sm text-[#211e0f]/60">Happy Kids</p>
              </div>
              <div className="w-px h-12 bg-[#f6b638]/30" />
              <div className="text-center">
                <p className="text-3xl font-bold text-[#f6b638]">200+</p>
                <p className="text-sm text-[#211e0f]/60">Products</p>
              </div>
              <div className="w-px h-12 bg-[#f6b638]/30" />
              <div className="text-center">
                <p className="text-3xl font-bold text-[#f6b638]">4.9</p>
                <p className="text-sm text-[#211e0f]/60">Rating</p>
              </div>
            </div>
          </div>

          {/* Kid Image - Right */}
          <div
            ref={kidImageRef}
            className="relative z-10"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="relative">
              <img
                src="/hero-kid.png"
                alt="AK Kids"
                className="w-full max-w-[400px] mx-auto drop-shadow-2xl transition-transform duration-300 hover:scale-105"
              />
              {/* Glow effect */}
              <div className="absolute inset-0 bg-[#f58a1f]/20 blur-3xl -z-10 rounded-full scale-75" />
            </div>
          </div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
