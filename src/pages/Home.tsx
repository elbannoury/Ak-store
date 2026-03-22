import { useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import Hero from '@/sections/Hero';
import Categories from '@/sections/Categories';
import Products from '@/sections/Products';
import Features from '@/sections/Features';
import About from '@/sections/About';
import CTA from '@/sections/CTA';
import Testimonials from '@/sections/Testimonials';
import { products } from '@/data';

const Home = () => {
  // Initialize localStorage with products on component mount
  useEffect(() => {
    const savedProducts = localStorage.getItem('ak-products');
    if (!savedProducts) {
      localStorage.setItem('ak-products', JSON.stringify(products));
    }
  }, []);

  return (
    <MainLayout>
      <Hero />
      <Categories />
      <Products />
      <Features />
      <About />
      <CTA />
      <Testimonials />
    </MainLayout>
  );
};

export default Home;
