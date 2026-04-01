import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Star, 
  Eye, 
  ArrowRight 
} from 'lucide-react';
import { products as initialProducts } from '@/data';
import { useCartStore } from '@/store/cartStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Product } from '@/types';

gsap.registerPlugin(ScrollTrigger);

const Products = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  const loadProducts = () => {
    const savedProducts = localStorage.getItem('ak-products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(initialProducts);
    }
  };

  useEffect(() => {
    loadProducts();

    const handleProductsUpdated = () => {
      loadProducts();
    };

    window.addEventListener('productsUpdated', handleProductsUpdated);
    return () => {
      window.removeEventListener('productsUpdated', handleProductsUpdated);
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = gridRef.current?.querySelectorAll('.product-card');
      if (items) {
        items.forEach((item, i) => {
          gsap.fromTo(
            item,
            { y: i % 2 === 0 ? 60 : 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [products]); // Re-run animation when products change

  const handleAddToCart = (product: Product, e?: React.MouseEvent) => {
    e?.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image || (product.images && product.images[0]) || '',
      category: product.category,
    });
    toast.success(`${product.name} ${t('products.addToCart')}`);
  };

  const handleViewProduct = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const handleViewAllProducts = () => {
    navigate('/products');
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-24 bg-white overflow-hidden"
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#f6b638]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#f58a1f]/10 rounded-full blur-3xl" />

      <div className="relative w-full section-padding">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-[#f6b638]/20 rounded-full text-sm font-semibold text-[#f58a1f] mb-4">
            {t('products.title')}
          </span>
          <h2
            className="text-4xl sm:text-5xl font-bold text-[#211e0f] mb-4"
            style={{ fontFamily: 'Rowdies, cursive' }}
          >
            {t('products.title')}
          </h2>
          <p className="text-lg text-[#211e0f]/70 max-w-2xl mx-auto">
            {t('products.subtitle')}
          </p>
        </div>

        {/* Products Grid - 4 columns on desktop, 2 on mobile */}
        <div
          ref={gridRef}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {products.slice(0, 8).map((product) => (
            <div
              key={product.id}
              className="product-card group"
            >
              <div 
                className="relative bg-[#fff9ed] rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg 
                          hover:shadow-2xl transition-all duration-500 cursor-pointer"
                onClick={() => handleViewProduct(product.id)}
              >
                {/* Image Container */}
                <div className="relative h-48 sm:h-64 overflow-hidden bg-white">
                  <img
                    src={product.image || (product.images && product.images[0])}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 
                             group-hover:scale-110"
                  />

                  {/* Badges */}
                  <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex flex-col gap-1 sm:gap-2">
                    {product.isNew && (
                      <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-[#4ade80] text-white text-xs font-bold rounded-full">
                        {t('products.new')}
                      </span>
                    )}
                    {product.isSale && (
                      <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-[#f87171] text-white text-xs font-bold rounded-full">
                        {t('products.sale')}
                      </span>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex flex-col gap-1 sm:gap-2 
                                opacity-0 group-hover:opacity-100 transform translate-x-2 sm:translate-x-4 
                                group-hover:translate-x-0 transition-all duration-500">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(product);
                      }}
                      className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center
                               shadow-lg hover:bg-[#f6b638] transition-colors duration-300"
                    >
                      <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-[#211e0f]" />
                    </button>
                  </div>

                  {/* Add to Cart Button - Slides up on hover */}
                  <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 
                                transform translate-y-full group-hover:translate-y-0 
                                transition-transform duration-500">
                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      className="w-full bg-[#f6b638] hover:bg-[#f58a1f] text-[#211e0f] font-bold 
                               py-2 sm:py-3 rounded-xl flex items-center justify-center gap-1 sm:gap-2 
                               transition-colors duration-300 text-sm sm:text-base"
                    >
                      <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline">{t('products.addToCart')}</span>
                      <span className="sm:hidden">{t('cart.addToCart')}</span>
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-3 sm:p-5">
                  <div className="flex items-start justify-between mb-1 sm:mb-2">
                    <h3 className="font-bold text-[#211e0f] text-sm sm:text-base group-hover:text-[#f58a1f] 
                                 transition-colors duration-300 line-clamp-1">
                      {product.name}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <span className="text-base sm:text-xl font-bold text-[#f58a1f]">
                        {product.price} MAD
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs sm:text-sm text-[#211e0f]/40 line-through">
                          {product.originalPrice} MAD
                        </span>
                      )}
                    </div>
                    {product.rating && (
                      <div className="flex items-center gap-0.5 sm:gap-1">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 text-[#f6b638] fill-[#f6b638]" />
                        <span className="text-xs sm:text-sm text-[#211e0f]/60">{product.rating}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button 
            onClick={handleViewAllProducts}
            className="btn-primary inline-flex items-center gap-2 group"
          >
            {t('categories.viewAll')}
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </div>
      </div>

      {/* Quick View Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="sm:max-w-[600px] bg-[#fff9ed] border-[#f6b638]/20">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Rowdies, cursive' }}>
              {selectedProduct?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="rounded-2xl overflow-hidden bg-white">
                <img
                  src={selectedProduct.image || (selectedProduct.images && selectedProduct.images[0])}
                  alt={selectedProduct.name}
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-4">
                  {selectedProduct.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-[#f6b638] fill-[#f6b638]" />
                      <span className="font-semibold">{selectedProduct.rating}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl font-bold text-[#f58a1f]">
                    {selectedProduct.price} MAD
                  </span>
                  {selectedProduct.originalPrice && (
                    <span className="text-lg text-[#211e0f]/40 line-through">
                      {selectedProduct.originalPrice} MAD
                    </span>
                  )}
                </div>
                {selectedProduct.sizes && (
                  <div className="mb-4">
                    <p className="text-sm text-[#211e0f]/60 mb-2">{t('productDetail.availableSizes')}:</p>
                    <div className="flex gap-2">
                      {selectedProduct.sizes.map((size) => (
                        <span
                          key={size}
                          className="px-3 py-1 bg-white rounded-lg text-sm font-medium
                                   border border-[#f6b638]/30"
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="space-y-3">
                  <Button
                    onClick={() => {
                      handleAddToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    className="w-full btn-primary flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {t('products.addToCart')}
                  </Button>
                  <Button
                    onClick={() => handleViewProduct(selectedProduct.id)}
                    variant="outline"
                    className="w-full border-[#f6b638] text-[#211e0f] hover:bg-[#f6b638]/10"
                  >
                    <Eye className="w-5 h-5 mr-2" />
                    {t('products.viewDetails')}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Products;
