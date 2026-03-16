import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Star, Minus, Plus, ShoppingCart, MessageCircle, Heart, Share2 } from 'lucide-react';
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold">{t('productDetail.notFound')}</h2>
        <Button onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('common.backToHome')}
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* زر الرجوع */}
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('common.back')}
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* قسم الصور */}
          <div className="space-y-4">
            {/* الصورة الرئيسية */}
            <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.isSale && (
                <Badge className="absolute top-4 left-4 bg-red-500">
                  {t('products.sale')}
                </Badge>
              )}
              {product.isNew && (
                <Badge className="absolute top-4 right-4 bg-green-500">
                  {t('products.new')}
                </Badge>
              )}
            </div>

            {/* معرض الصور المصغرة */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-primary' : 'border-transparent'
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
            <div>
              <Badge variant="secondary" className="mb-2">
                {t(`categories.${product.category}`)}
              </Badge>
              {product.sku && (
                <p className="text-sm text-muted-foreground mb-2">
                  {t('productDetail.sku')}: {product.sku}
                </p>
              )}
              <h1 className="text-3xl font-bold">{product.name}</h1>
              
              {/* التقييم */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex">
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
                <span className="text-sm text-muted-foreground">
                  ({product.rating || 5}.0)
                </span>
              </div>
            </div>

            {/* السعر */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-primary">
                {product.price} MAD
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    {product.originalPrice} MAD
                  </span>
                  <Badge variant="destructive">
                    {t('products.sale')} {product.originalPrice - product.price} MAD
                  </Badge>
                </>
              )}
            </div>

            <Separator />

            {/* الوصف */}
            <div>
              <h3 className="font-semibold mb-2">{t('productDetail.description')}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* اختيار اللون */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">
                  {t('productDetail.color')}: {selectedColor}
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                        selectedColor === color
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
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
              <div>
                <h3 className="font-semibold mb-3">
                  {t('productDetail.size')}: {selectedSize}
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 rounded-lg border-2 transition-colors ${
                        selectedSize === size
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* الكمية */}
            <div>
              <h3 className="font-semibold mb-3">{t('productDetail.quantity')}</h3>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* أزرار الإجراء */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                <ShoppingCart className="mr-2 h-5 w-5" />
                {t('productDetail.addToCart')}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white border-green-600"
                onClick={handleWhatsAppOrder}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                {t('productDetail.whatsappOrder')}
              </Button>
            </div>

            {/* المميزات */}
            <div className="grid grid-cols-3 gap-4 pt-6 text-center text-sm">
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium">{t('productDetail.freeDelivery')}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium">{t('productDetail.securePayment')}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium">{t('productDetail.easyReturns')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
