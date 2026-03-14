import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Star, 
  Heart, 
  Share2, 
  Truck,
  Shield,
  RefreshCw,
  Minus,
  Plus,
  MessageCircle,
  Ruler
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { whatsappService } from '@/services/whatsappService';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import type { Product } from '@/types';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { addItem, items } = useCartStore();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  // Load product and all products
  useEffect(() => {
    const loadProduct = async () => {
      let products: Product[] = [];
      const savedProducts = localStorage.getItem('ak-products');
      
      if (savedProducts) {
        products = JSON.parse(savedProducts);
      } else {
        const { products: initialProducts } = await import('@/data');
        products = initialProducts;
        localStorage.setItem('ak-products', JSON.stringify(products));
      }
      
      setAllProducts(products);
      
      const foundProduct = products.find((p: Product) => p.id === id);
      if (foundProduct) {
        setProduct(foundProduct);
        setSelectedSize(foundProduct.sizes?.[0] || '');
        setSelectedColor(foundProduct.colors?.[0] || '');
      }
    };

    loadProduct();

    // Listen for product updates
    const handleProductsUpdated = () => {
      loadProduct();
    };
    window.addEventListener('productsUpdated', handleProductsUpdated);

    return () => {
      window.removeEventListener('productsUpdated', handleProductsUpdated);
    };
  }, [id]);

  const isInCart = items.some((item) => item.id === id);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#fff9ed] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#211e0f] mb-4">{t('common.error')}</h1>
          <p className="text-gray-500 mb-6">Product not found</p>
          <Button onClick={() => navigate('/products')} className="btn-primary">
            {t('cart.continueShopping')}
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: `${product.name}${selectedSize ? ` (${selectedSize})` : ''}${selectedColor ? ` - ${selectedColor}` : ''}`,
      price: product.price,
      image: product.image,
      category: product.category,
      size: selectedSize,
    });
    toast.success(`${product.name} ${t('products.addToCart')}`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  const handleWhatsAppOrder = () => {
    whatsappService.quickOrder(
      [{ ...product, quantity, category: product.category }],
      product.price * quantity
    );
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} on AK Kids!`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-[#fff9ed]">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg shadow-sm">
        <div className="w-full section-padding py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-[#211e0f] hover:text-[#f58a1f] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">{t('common.back')}</span>
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`p-3 rounded-full transition-colors ${
                  isWishlisted ? 'bg-red-100 text-red-500' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleShare}
                className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="w-full section-padding py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg">
              <img
                src={product.images?.[selectedImage] || product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.isSale && (
                <span className="absolute top-4 left-4 px-4 py-2 bg-[#f87171] text-white font-bold rounded-full">
                  {t('products.sale')}
                </span>
              )}
              {product.isNew && (
                <span className="absolute top-4 left-4 px-4 py-2 bg-[#4ade80] text-white font-bold rounded-full">
                  {t('products.new')}
                </span>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {(product.images?.length || 0) > 1 && (
              <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2">
                {product.images?.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-[#f6b638] ring-2 ring-[#f6b638]/30'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-[#f6b638]/20 text-[#f58a1f] text-sm font-semibold rounded-full capitalize">
                  {t(`categories.${product.category}`)}
                </span>
                {product.sku && (
                  <span className="text-sm text-gray-500">{t('productDetail.sku')}: {product.sku}</span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#211e0f] mb-2" style={{ fontFamily: 'Rowdies, cursive' }}>
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${
                        i < (product.rating || 5)
                          ? 'text-[#f6b638] fill-[#f6b638]'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-500">({product.rating || 5}.0)</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-3xl sm:text-4xl font-bold text-[#f58a1f]">
                {product.price} MAD
              </span>
              {product.originalPrice && (
                <span className="text-xl sm:text-2xl text-gray-400 line-through">
                  {product.originalPrice} MAD
                </span>
              )}
              {product.originalPrice && (
                <span className="px-3 py-1 bg-green-100 text-green-600 font-semibold rounded-full text-sm">
                  {t('products.sale')} {product.originalPrice - product.price} MAD
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              {product.description}
            </p>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <label className="block font-semibold text-[#211e0f] mb-3">
                  {t('productDetail.color')}: <span className="text-gray-500">{selectedColor}</span>
                </label>
                <div className="flex gap-2 sm:gap-3 flex-wrap">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 sm:px-4 py-2 rounded-xl border-2 text-sm transition-all ${
                        selectedColor === color
                          ? 'border-[#f6b638] bg-[#f6b638]/10'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block font-semibold text-[#211e0f]">
                    {t('productDetail.size')}: <span className="text-gray-500">{selectedSize}</span>
                  </label>
                  <button
                    onClick={() => setShowSizeGuide(true)}
                    className="text-sm text-[#f58a1f] hover:underline flex items-center gap-1"
                  >
                    <Ruler className="w-4 h-4" />
                    {t('productDetail.sizeGuide')}
                  </button>
                </div>
                <div className="flex gap-2 sm:gap-3 flex-wrap">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl border-2 font-semibold text-sm transition-all ${
                        selectedSize === size
                          ? 'border-[#f6b638] bg-[#f6b638] text-[#211e0f]'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="block font-semibold text-[#211e0f] mb-3">
                {t('productDetail.quantity')}
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="text-xl sm:text-2xl font-bold w-10 sm:w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                onClick={handleAddToCart}
                className="flex-1 btn-primary py-4 sm:py-6 text-base sm:text-lg flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                {isInCart ? t('cart.added') : t('products.addToCart')}
              </Button>
              <Button
                onClick={handleBuyNow}
                className="flex-1 bg-[#211e0f] hover:bg-[#f58a1f] text-white font-bold py-4 sm:py-6 text-base sm:text-lg rounded-full transition-all"
              >
                {t('productDetail.buyNow')}
              </Button>
            </div>

            {/* WhatsApp Order */}
            <Button
              onClick={handleWhatsAppOrder}
              variant="outline"
              className="w-full border-green-500 text-green-600 hover:bg-green-50 py-3 sm:py-4 text-base flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              {t('productDetail.orderWhatsApp')}
            </Button>

            {/* Features */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 sm:pt-6 border-t">
              <div className="text-center">
                <Truck className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2 text-[#f6b638]" />
                <p className="text-xs sm:text-sm text-gray-600">{t('productDetail.freeDelivery')}</p>
              </div>
              <div className="text-center">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2 text-[#f6b638]" />
                <p className="text-xs sm:text-sm text-gray-600">{t('productDetail.securePayment')}</p>
              </div>
              <div className="text-center">
                <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2 text-[#f6b638]" />
                <p className="text-xs sm:text-sm text-gray-600">{t('productDetail.easyReturns')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 sm:mt-16">
            <h2 className="text-xl sm:text-2xl font-bold text-[#211e0f] mb-6 sm:mb-8" style={{ fontFamily: 'Rowdies, cursive' }}>
              {t('products.youMayAlsoLike')}
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((related) => (
                <div
                  key={related.id}
                  onClick={() => navigate(`/product/${related.id}`)}
                  className="cursor-pointer group"
                >
                  <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={related.image}
                        alt={related.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <div className="p-3 sm:p-4">
                      <h3 className="font-semibold text-[#211e0f] group-hover:text-[#f58a1f] transition-colors text-sm sm:text-base line-clamp-1">
                        {related.name}
                      </h3>
                      <p className="text-[#f58a1f] font-bold text-sm sm:text-base">{related.price} MAD</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Size Guide Modal */}
      <Dialog open={showSizeGuide} onOpenChange={setShowSizeGuide}>
        <DialogContent className="sm:max-w-[600px] bg-[#fff9ed]">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Rowdies, cursive' }}>
              {t('sizeGuide.title')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Size Chart */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#f6b638]/20">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">{t('sizeGuide.age')}</th>
                    <th className="px-4 py-3 text-left font-semibold">{t('sizeGuide.height')}</th>
                    <th className="px-4 py-3 text-left font-semibold">{t('sizeGuide.weight')}</th>
                    <th className="px-4 py-3 text-left font-semibold">{t('sizeGuide.chest')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="px-4 py-3">0-3M</td>
                    <td className="px-4 py-3">50-56</td>
                    <td className="px-4 py-3">3-5</td>
                    <td className="px-4 py-3">38-42</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">3-6M</td>
                    <td className="px-4 py-3">56-68</td>
                    <td className="px-4 py-3">5-7</td>
                    <td className="px-4 py-3">42-46</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">6-12M</td>
                    <td className="px-4 py-3">68-80</td>
                    <td className="px-4 py-3">7-10</td>
                    <td className="px-4 py-3">46-50</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">1-2Y</td>
                    <td className="px-4 py-3">80-92</td>
                    <td className="px-4 py-3">10-13</td>
                    <td className="px-4 py-3">50-54</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">2-3Y</td>
                    <td className="px-4 py-3">92-98</td>
                    <td className="px-4 py-3">13-15</td>
                    <td className="px-4 py-3">54-56</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">4-5Y</td>
                    <td className="px-4 py-3">104-110</td>
                    <td className="px-4 py-3">16-19</td>
                    <td className="px-4 py-3">58-60</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">6-7Y</td>
                    <td className="px-4 py-3">116-122</td>
                    <td className="px-4 py-3">20-24</td>
                    <td className="px-4 py-3">62-64</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">8-9Y</td>
                    <td className="px-4 py-3">128-134</td>
                    <td className="px-4 py-3">25-30</td>
                    <td className="px-4 py-3">66-68</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="bg-[#f6b638]/10 rounded-xl p-4">
              <h4 className="font-semibold mb-2">{t('sizeGuide.howToMeasure')}</h4>
              <p className="text-sm text-gray-600">{t('sizeGuide.measureDesc')}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductDetail;
