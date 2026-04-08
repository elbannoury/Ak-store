import { useState, useEffect, useCallback } from 'react';
import { products as initialProducts } from '@/data';
import { supabase } from '@/lib/supabaseClient';
import type { Product } from '@/types';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: supabaseError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (supabaseError) throw supabaseError;

      if (data && data.length > 0) {
        // تنظيف البيانات وتحويل الأنواع
        const cleanedData = data.map(p => ({
          ...p,
          price: Number(p.price),
          originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
          rating: p.rating ? Number(p.rating) : undefined,
        })) as Product[];
        
        setProducts(cleanedData);
        localStorage.setItem('ak-products', JSON.stringify(cleanedData));
      } else {
        // محاولة استرجاع من localStorage
        const savedProducts = localStorage.getItem('ak-products');
        if (savedProducts) {
          setProducts(JSON.parse(savedProducts));
        } else {
          // استخدام البيانات الافتراضية
          setProducts(initialProducts);
          localStorage.setItem('ak-products', JSON.stringify(initialProducts));
        }
      }
    } catch (err: any) {
      console.error('Failed to load products:', err);
      setError(err.message || 'Failed to load products');
      
      // محاولة استرجاع من localStorage عند الفشل
      const savedProducts = localStorage.getItem('ak-products');
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      } else {
        setProducts(initialProducts);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();

    // الاستماع لحدث تحديث المنتجات
    const handleProductsUpdated = () => {
      loadProducts();
    };

    window.addEventListener('productsUpdated', handleProductsUpdated);
    return () => {
      window.removeEventListener('productsUpdated', handleProductsUpdated);
    };
  }, [loadProducts]);

  return { products, isLoading, error, refetch: loadProducts };
};
