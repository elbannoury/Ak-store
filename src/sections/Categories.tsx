import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { categories } from '@/data';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

const Categories = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current?.querySelectorAll('.category-card');
      if (cards) {
        // Initial stacked state
        gsap.set(cards, {
          rotation: (i: number) => (i - 1.5) * 5,
          x: (i: number) => (i - 1.5) * 20,
        });

        // Fan out animation on scroll
        gsap.to(cards, {
          rotation: 0,
          x: 0,
          duration: 1,
          stagger: 0.1,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/products?category=${categoryId}`);
  };

  const handleViewAllProducts = () => {
    navigate('/products');
  };

  return (
    <section
      id="shop"
      ref={sectionRef}
      className="relative w-full py-24 bg-[#fff9ed] overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-pattern opacity-30" />

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-[#f6b638]/20 rounded-full blur-xl" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-[#f58a1f]/20 rounded-full blur-xl" />

      <div className="relative w-full section-padding">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-[#f6b638]/20 rounded-full text-sm font-semibold text-[#f58a1f] mb-4">
            Browse Collection
          </span>
          <h2
            className="text-4xl sm:text-5xl font-bold text-[#211e0f] mb-4"
            style={{ fontFamily: 'Rowdies, cursive' }}
          >
            {t('categories.title')}
          </h2>
          <p className="text-lg text-[#211e0f]/70 max-w-2xl mx-auto">
            {t('categories.subtitle')}
          </p>
        </div>

        {/* Category Cards */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {categories.map((category) => (
            <div
              key={category.id}
              className="category-card group relative"
              onClick={() => handleCategoryClick(category.id)}
            >
              <div
                className="relative overflow-hidden rounded-3xl bg-white shadow-lg 
                         hover:shadow-2xl transition-all duration-500 cursor-pointer"
              >
                {/* Image */}
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 
                             group-hover:scale-110"
                  />
                  {/* Overlay */}
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-[#211e0f]/80 
                             via-[#211e0f]/20 to-transparent opacity-60 
                             group-hover:opacity-80 transition-opacity duration-500"
                  />
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <h3
                        className="text-2xl font-bold text-white mb-1 
                                 group-hover:text-[#f6b638] transition-colors duration-300"
                        style={{ fontFamily: 'Rowdies, cursive' }}
                      >
                        {t(`categories.${category.id}`)}
                      </h3>
                      <p className="text-white/70 text-sm">
                        {category.itemCount} items
                      </p>
                    </div>

                    {/* Arrow Button */}
                    <div
                      className="w-12 h-12 bg-[#f6b638] rounded-full flex items-center justify-center
                               transform translate-y-4 opacity-0 group-hover:translate-y-0 
                               group-hover:opacity-100 transition-all duration-500"
                    >
                      <ArrowRight className="w-5 h-5 text-[#211e0f]" />
                    </div>
                  </div>
                </div>

                {/* Hover Border Effect */}
                <div
                  className="absolute inset-0 border-4 border-[#f6b638] rounded-3xl opacity-0 
                           group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                />
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button 
            onClick={handleViewAllProducts}
            className="btn-secondary inline-flex items-center gap-2 group"
          >
            View All Products
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Categories;
