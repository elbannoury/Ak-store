import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { testimonials } from '@/data';

gsap.registerPlugin(ScrollTrigger);

const Testimonials = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.testimonial-header',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        goToNext();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [activeIndex, isAnimating]);

  const goToNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToPrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const getCardStyle = (index: number) => {
    const diff = index - activeIndex;
    const normalizedDiff = ((diff + testimonials.length) % testimonials.length);
    
    if (normalizedDiff === 0) {
      return {
        transform: 'translateX(0) scale(1) rotateY(0deg)',
        opacity: 1,
        zIndex: 10,
      };
    } else if (normalizedDiff === 1 || normalizedDiff === -testimonials.length + 1) {
      return {
        transform: 'translateX(80%) scale(0.85) rotateY(-25deg)',
        opacity: 0.5,
        zIndex: 5,
      };
    } else if (normalizedDiff === testimonials.length - 1 || normalizedDiff === -1) {
      return {
        transform: 'translateX(-80%) scale(0.85) rotateY(25deg)',
        opacity: 0.5,
        zIndex: 5,
      };
    }
    return {
      transform: 'translateX(0) scale(0.7)',
      opacity: 0,
      zIndex: 0,
    };
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-24 bg-white overflow-hidden"
    >
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-[#f6b638]/10 rounded-full blur-xl" />
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-[#f58a1f]/10 rounded-full blur-xl" />

      <div className="relative w-full section-padding">
        {/* Section Header */}
        <div className="testimonial-header text-center mb-16">
          <span className="inline-block px-4 py-2 bg-[#f6b638]/20 rounded-full text-sm font-semibold text-[#f58a1f] mb-4">
            Testimonials
          </span>
          <h2
            className="text-4xl sm:text-5xl font-bold text-[#211e0f] mb-4"
            style={{ fontFamily: 'Rowdies, cursive' }}
          >
            {t('testimonials.title')}
          </h2>
          <p className="text-lg text-[#211e0f]/70 max-w-2xl mx-auto">
            {t('testimonials.subtitle')}
          </p>
        </div>

        {/* 3D Carousel */}
        <div 
          className="relative h-[400px] flex items-center justify-center"
          style={{ perspective: '1000px' }}
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="absolute w-full max-w-lg transition-all duration-500 ease-out"
              style={{
                ...getCardStyle(index),
                transformStyle: 'preserve-3d',
              }}
            >
              <div className="bg-[#fff9ed] rounded-3xl p-8 shadow-xl">
                {/* Quote Icon */}
                <Quote className="w-12 h-12 text-[#f6b638]/30 mb-4" />

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-[#f6b638] fill-[#f6b638]" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-lg text-[#211e0f]/80 mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover border-3 border-[#f6b638]"
                  />
                  <div>
                    <h4 className="font-bold text-[#211e0f]">{testimonial.name}</h4>
                    <p className="text-sm text-[#211e0f]/60">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={goToPrev}
            className="w-12 h-12 bg-[#f6b638] hover:bg-[#f58a1f] rounded-full 
                     flex items-center justify-center transition-colors duration-300
                     shadow-lg shadow-[#f6b638]/30"
          >
            <ChevronLeft className="w-6 h-6 text-[#211e0f]" />
          </button>

          {/* Dots */}
          <div className="flex gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!isAnimating) {
                    setIsAnimating(true);
                    setActiveIndex(index);
                    setTimeout(() => setIsAnimating(false), 500);
                  }
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? 'bg-[#f6b638] w-8'
                    : 'bg-[#f6b638]/30 hover:bg-[#f6b638]/50'
                }`}
              />
            ))}
          </div>

          <button
            onClick={goToNext}
            className="w-12 h-12 bg-[#f6b638] hover:bg-[#f58a1f] rounded-full 
                     flex items-center justify-center transition-colors duration-300
                     shadow-lg shadow-[#f6b638]/30"
          >
            <ChevronRight className="w-6 h-6 text-[#211e0f]" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
