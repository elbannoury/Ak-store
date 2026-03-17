import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Star, Minus, Plus, ShoppingCart, MessageCircle, Heart, Share2, Truck, Shield, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { products as initialProducts } from '@/data';
import { useCartStore } from '@/store/cartStore';

// نوع بيانات المنتج
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image?: string;
  images: string[];
  category: string;
  sku?: string;
  rating?: number;
  isSale?: boolean;
  isNew?: boolean;
  colors?: string[];
  sizes?: string[];
  stock?: number;
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { addItem } = useCartStore();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  // جلب بيانات المنتج
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        
        // جلب البيانات من localStorage أو البيانات الأولية
        const savedProducts = localStorage.getItem('ak-products');
        const allProducts = savedProducts ? JSON.parse(savedProducts) : initialProducts;
        
        const foundProduct = allProducts.find((p: Product) => p.id === id);
        
        if (foundProduct) {
          // تأكد من وجود images حتى لو كانت صورة واحدة
          if (!foundProduct.images || foundProduct.images.length === 0) {
            foundProduct.images = [foundProduct.image || ''];
          }
          setProduct(foundProduct);
          if (foundProduct.colors?.length) {
            setSelectedColor(foundProduct.colors[0]);
          }
          if (foundProduct.sizes?.length) {
            setSelectedSize(foundProduct.sizes[0]);
          }
        }
      } catch (error) {
        toast.error('Error loading product');
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // إضافة إلى السلة
  const handleAddToCart = () => {
    if (!product) return;
    
    addItem({
      id: product.id,
      name: `${product.name}${selectedSize ? ` (${selectedSize})` : ''}${selectedColor ? ` - ${selectedColor}` : ''}`,
      price: product.price,
      image: product.images[0] || '',
      category: product.category,
      size: selectedSize,
    });
    toast.success(`${product.name} ${t('products.addToCart')}`);
  };

  // الطلب عبر واتساب
  const handleWhatsAppOrder = () => {
    if (!product) return;
    
    const cartItem = {
      id: product.id,
      name: `${product.name}${selectedSize ? ` (${selectedSize})` : ''}${selectedColor ? ` - ${selectedColor}` : ''}`,
      price: product.price,
      image: product.images[0] || '',
      category: product.category,
      quantity: quantity,
      size: selectedSize,
    };
    
    // استخدام خدمة واتساب الموجودة في المشروع
    import('@/services/whatsappService').then(({ whatsappService }) => {
      whatsappService.quickOrder([cartItem], product.price * quantity);
      toast.success('Opening WhatsApp to complete your order!');
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fff9ed]">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#f6b638] border-t-[#f58a1f]"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#fff9ed]">
        <h2 className="text-2xl font-bold text-[#211e0f]">{t('productDetail.notFound')}</h2>
        <Button onClick={() => navigate('/')} className="btn-primary">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('common.backToHome')}
        </Button>
      </div>
    );
  }

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#fff9ed]">
      <div className="container-custom px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        {/* زر الرجوع */}
        <button 
          onClick={() => navigate(-1)} 
          className="inline-flex items-center gap-2 text-[#211e0f] hover:text-[#f58a1f] transition-colors mb-8 group"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold">{t('common.back')}</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* قسم الصور */}
          <div className="space-y-4">
            {/* الصورة الرئيسية */}
            <div className="relative aspect-square bg-white rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 group">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* الشارات */}
              <div className="absolute top-6 left-6 flex flex-col gap-3">
                {product.isSale && (
                  <div className="bg-red-500 text-white px-4 py-2 rounded-full font-bold shadow-lg animate-pulse">
                    -{discountPercentage}%
                  </div>
                )}
                {product.isNew && (
                  <Badge className="bg-green-500 text-white font-bold text-sm px-4 py-2 rounded-full shadow-lg">
                    {t('products.new')}
                  </Badge>
                )}
              </div>

              {/* أزرار الإجراء السريعة */}
              <div className="absolute top-6 right-6 flex flex-col gap-3">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 ${
                    isFavorite 
                      ? 'bg-red-500 text-white' 
                      : 'bg-white text-[#211e0f] hover:bg-red-500 hover:text-white'
                  }`}
                >
                  <Heart className={`h-6 w-6 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={() => toast.info('Share functionality coming soon!')}
                  className="w-12 h-12 rounded-full bg-white text-[#211e0f] flex items-center justify-center shadow-lg hover:bg-[#f6b638] hover:text-white transition-all duration-300 hover:scale-110"
                >
                  <Share2 className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* معرض الصور المصغرة */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-3 transition-all duration-300 hover:scale-110 ${
                      selectedImage === index 
                        ? 'border-[#f6b638] shadow-lg ring-2 ring-[#f6b638]/50' 
                        : 'border-gray-200 hover:border-[#f6b638]'
                    }`}
                  >
                    <img src={image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* قسم التفاصيل */}
          <div className="space-y-6">
            {/* العنوان والتصنيف */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Badge className="bg-[#f6b638]/20 text-[#f58a1f] font-semibold px-4 py-1.5 rounded-full">
                  {t(`categories.${product.category}`)}
                </Badge>
                {product.sku && (
                  <span className="text-sm text-[#211e0f]/60">SKU: {product.sku}</span>
                )}
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#211e0f] leading-tight">
                {product.name}
              </h1>
              
              {/* التقييم */}
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < (product.rating || 5)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold text-[#211e0f]">
                  {product.rating || 5}.0
                </span>
                <span className="text-sm text-[#211e0f]/60">(124 reviews)</span>
              </div>
            </div>

            <Separator className="bg-[#f6b638]/20" />

            {/* السعر */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-4">
                <span className="text-4xl sm:text-5xl font-bold text-[#f58a1f]">
                  {product.price} MAD
                </span>
                {product.originalPrice && (
                  <span className="text-2xl text-[#211e0f]/40 line-through font-semibold">
                    {product.originalPrice} MAD
                  </span>
                )}
              </div>
              {product.originalPrice && (
                <p className="text-sm text-green-600 font-semibold">
                  Save {product.originalPrice - product.price} MAD ({discountPercentage}% off)
                </p>
              )}
            </div>

            {/* الوصف */}
            <div className="bg-white rounded-2xl p-6 border border-[#f6b638]/10">
              <h3 className="font-bold text-lg text-[#211e0f] mb-3">{t('productDetail.description')}</h3>
              <p className="text-[#211e0f]/70 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* اختيار اللون */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-bold text-lg text-[#211e0f]">
                  {t('productDetail.color')}: <span className="text-[#f58a1f]">{selectedColor}</span>
                </h3>
                <div className="flex gap-3 flex-wrap">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-5 py-3 rounded-xl font-semibold border-2 transition-all duration-300 hover:scale-105 ${
                        selectedColor === color
                          ? 'border-[#f6b638] bg-[#f6b638]/10 text-[#211e0f] shadow-lg'
                          : 'border-gray-300 bg-white text-[#211e0f] hover:border-[#f6b638]'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* اختيار المقاس */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-bold text-lg text-[#211e0f]">
                  {t('productDetail.size')}: <span className="text-[#f58a1f]">{selectedSize}</span>
                </h3>
                <div className="flex gap-3 flex-wrap">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-14 h-14 rounded-xl font-bold border-2 transition-all duration-300 hover:scale-105 flex items-center justify-center ${
                        selectedSize === size
                          ? 'border-[#f6b638] bg-[#f6b638]/10 text-[#211e0f] shadow-lg'
                          : 'border-gray-300 bg-white text-[#211e0f] hover:border-[#f6b638]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* الكمية */}
            <div className="space-y-3">
              <h3 className="font-bold text-lg text-[#211e0f]">{t('productDetail.quantity')}</h3>
              <div className="flex items-center gap-4 bg-white rounded-2xl p-4 w-fit border border-[#f6b638]/10">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="w-10 h-10 rounded-lg bg-[#f6b638]/10 text-[#f58a1f] hover:bg-[#f6b638] hover:text-white disabled:opacity-50 transition-all flex items-center justify-center font-bold"
                >
                  <Minus className="h-5 w-5" />
                </button>
                <span className="text-2xl font-bold text-[#211e0f] w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg bg-[#f6b638]/10 text-[#f58a1f] hover:bg-[#f6b638] hover:text-white transition-all flex items-center justify-center font-bold"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* أزرار الإجراء */}
            <div className="space-y-3 pt-6">
              <button
                onClick={handleAddToCart}
                className="w-full bg-[#f6b638] hover:bg-[#f58a1f] text-[#211e0f] font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 hover:shadow-xl hover:scale-105 text-lg"
              >
                <ShoppingCart className="h-6 w-6" />
                {t('productDetail.addToCart')}
              </button>
              
              <button
                onClick={handleWhatsAppOrder}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 hover:shadow-xl hover:scale-105 text-lg"
              >
                <MessageCircle className="h-6 w-6" />
                WhatsApp
              </button>
            </div>

            {/* المميزات */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              <div className="bg-white rounded-2xl p-4 text-center border border-[#f6b638]/10 hover:shadow-lg transition-all">
                <Truck className="h-8 w-8 text-[#f6b638] mx-auto mb-2" />
                <p className="font-semibold text-[#211e0f] text-sm">{t('productDetail.freeDelivery')}</p>
              </div>
              <div className="bg-white rounded-2xl p-4 text-center border border-[#f6b638]/10 hover:shadow-lg transition-all">
                <Shield className="h-8 w-8 text-[#f6b638] mx-auto mb-2" />
                <p className="font-semibold text-[#211e0f] text-sm">{t('productDetail.securePayment')}</p>
              </div>
              <div className="bg-white rounded-2xl p-4 text-center border border-[#f6b638]/10 hover:shadow-lg transition-all">
                <RotateCcw className="h-8 w-8 text-[#f6b638] mx-auto mb-2" />
                <p className="font-semibold text-[#211e0f] text-sm">{t('productDetail.easyReturns')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
