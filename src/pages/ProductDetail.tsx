import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Star, Minus, Plus, ShoppingCart, MessageCircle, Heart, Truck, Shield, RotateCcw, Copy, Check } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useCartStore } from '@/store/cartStore';
import { useProducts } from '@/hooks/useProducts';
import type { Product } from '@/types';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { addItem } = useCartStore();
  const { products, isLoading } = useProducts();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [copied, setCopied] = useState(false);

  // جلب بيانات المنتج
  useEffect(() => {
    if (!isLoading && id) {
      const foundProduct = products.find((p: Product) => p.id === id);
      
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
    }
  }, [id, products, isLoading]);

  // إضافة إلى السلة
  const handleAddToCart = () => {
    if (!product) return;
    
    addItem({
      id: product.id,
      name: `${product.name}${selectedSize ? ` (${selectedSize})` : ''}${selectedColor ? ` - ${selectedColor}` : ''}`,
      price: product.price,
      image: (product.images && product.images[0]) || product.image || '',
      category: product.category,
      size: selectedSize,
    });
    toast.success(`${product.name} ${t('products.addToCart')}`);
  };

  // نسخ رابط المنتج
  const handleShareLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  // إرسال عبر WhatsApp
  const handleWhatsAppOrder = () => {
    if (!product) return;
    const message = `Hi, I'm interested in ${product.name} (${product.price} MAD)`;
    const whatsappUrl = `https://wa.me/212XXXXXXXXX?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-[#f6b638] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <div className="min-h-screen flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold text-[#211e0f] mb-4">Product Not Found</h1>
          <Button onClick={() => navigate('/products')} className="btn-primary">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Products
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="section-padding py-6 border-b">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#f58a1f] hover:text-[#f6b638] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
        </div>

        <div className="section-padding py-12">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div>
              <div className="bg-[#fff9ed] rounded-2xl overflow-hidden mb-4 aspect-square flex items-center justify-center">
                <img
                  src={(product.images && product.images[selectedImage]) || product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === idx ? 'border-[#f6b638]' : 'border-gray-200'
                      }`}
                    >
                      <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <div className="mb-4 flex items-center gap-2">
                {product.isNew && <Badge className="bg-[#4ade80] text-white">New</Badge>}
                {product.isSale && <Badge className="bg-[#f87171] text-white">Sale</Badge>}
              </div>

              <h1 className="text-4xl font-bold text-[#211e0f] mb-2" style={{ fontFamily: 'Rowdies, cursive' }}>
                {product.name}
              </h1>

              {product.rating && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating || 0)
                            ? 'fill-[#f6b638] text-[#f6b638]'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600">({product.rating} stars)</span>
                </div>
              )}

              <Separator className="my-4" />

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-[#f58a1f]">{product.price} MAD</span>
                  {product.originalPrice && (
                    <span className="text-xl text-gray-400 line-through">{product.originalPrice} MAD</span>
                  )}
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>
              )}

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-[#211e0f] mb-3">Color</label>
                  <div className="flex gap-3">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                          selectedColor === color
                            ? 'border-[#f6b638] bg-[#f6b638]/10'
                            : 'border-gray-200 hover:border-[#f6b638]'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-[#211e0f] mb-3">Size</label>
                  <div className="flex gap-3">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                          selectedSize === size
                            ? 'border-[#f6b638] bg-[#f6b638]/10'
                            : 'border-gray-200 hover:border-[#f6b638]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#211e0f] mb-3">Quantity</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 border border-gray-200 rounded-lg hover:bg-gray-100"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="text-xl font-semibold w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 border border-gray-200 rounded-lg hover:bg-gray-100"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mb-8">
                <Button
                  onClick={handleAddToCart}
                  className="w-full btn-primary py-4 text-lg"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  onClick={handleWhatsAppOrder}
                  variant="outline"
                  className="w-full py-4 text-lg border-[#f6b638] text-[#f6b638] hover:bg-[#f6b638]/10"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Order via WhatsApp
                </Button>
              </div>

              {/* Features */}
              <div className="space-y-3 pt-6 border-t">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-[#f6b638]" />
                  <span className="text-gray-600">Free shipping on orders over 500 MAD</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-[#f6b638]" />
                  <span className="text-gray-600">Secure checkout with SSL encryption</span>
                </div>
                <div className="flex items-center gap-3">
                  <RotateCcw className="w-5 h-5 text-[#f6b638]" />
                  <span className="text-gray-600">30-day money-back guarantee</span>
                </div>
              </div>

              {/* Share Buttons */}
              <div className="mt-8 pt-6 border-t flex gap-3">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                    isFavorite
                      ? 'bg-red-50 border-red-200 text-red-600'
                      : 'border-gray-200 text-gray-600 hover:border-red-200'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                  Favorite
                </button>
                <button
                  onClick={handleShareLink}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:border-[#f6b638]"
                >
                  {copied ? (
                    <>
                      <Check className="w-5 h-5 text-green-600" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      Share
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
