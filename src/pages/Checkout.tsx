import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeft, 
  ShoppingBag, 
  MapPin, 
  Phone, 
  User, 
  MessageSquare,
  Check,
  Loader2,
  MessageCircle,
  Truck
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { whatsappService } from '@/services/whatsappService';
import { googleSheetsService } from '@/services/googleSheetsService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const Checkout = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { items, getTotalPrice, clearCart } = useCartStore();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');

  const totalPrice = getTotalPrice();
  const shippingCost = totalPrice > 500 ? 0 : 30;
  const finalTotal = totalPrice + shippingCost;

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-[#fff9ed] flex items-center justify-center">
        <div className="text-center px-4">
          <ShoppingBag className="w-16 h-16 sm:w-20 sm:h-20 text-[#f6b638] mx-auto mb-4" />
          <h1 className="text-2xl sm:text-3xl font-bold text-[#211e0f] mb-4">{t('cart.empty')}</h1>
          <p className="text-gray-600 mb-6">{t('products.subtitle')}</p>
          <Button onClick={() => navigate('/products')} className="btn-primary">
            {t('cart.continueShopping')}
          </Button>
        </div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-[#fff9ed] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-6 sm:p-8 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#211e0f] mb-2" style={{ fontFamily: 'Rowdies, cursive' }}>
            {t('checkout.orderSuccess')}
          </h1>
          <p className="text-gray-600 mb-4">
            {t('checkout.thankYou')}
          </p>
          {orderId && (
            <p className="text-sm text-gray-500 mb-6">
              {t('checkout.orderId')}: <span className="font-mono font-semibold">{orderId}</span>
            </p>
          )}
          <div className="space-y-3">
            <Button onClick={() => navigate('/')} className="w-full btn-primary">
              {t('cart.continueShopping')}
            </Button>
            <Button onClick={() => navigate('/products')} variant="outline" className="w-full">
              {t('products.title')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.address || !formData.city) {
      toast.error(t('checkout.required'));
      return;
    }

    setIsSubmitting(true);

    try {
      const newOrderId = `AK-${Date.now()}`;
      setOrderId(newOrderId);

      await googleSheetsService.submitOrder(
        items,
        formData,
        finalTotal
      );

      whatsappService.sendOrderViaWeb(items, formData, finalTotal);

      toast.success(t('checkout.orderSuccess'));
      setOrderComplete(true);
      clearCart();
    } catch (error) {
      console.error('Order error:', error);
      toast.error(t('common.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppOnly = () => {
    if (!formData.name || !formData.phone) {
      toast.error(t('checkout.required'));
      return;
    }
    whatsappService.sendOrderViaWeb(items, { 
      ...formData, 
      address: formData.address || 'To be confirmed', 
      city: formData.city || 'To be confirmed' 
    }, finalTotal);
  };

  return (
    <div className="min-h-screen bg-[#fff9ed]">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-lg shadow-sm">
        <div className="w-full section-padding py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-[#211e0f]" style={{ fontFamily: 'Rowdies, cursive' }}>
              {t('checkout.title')}
            </h1>
          </div>
        </div>
      </div>

      <div className="w-full section-padding py-6 sm:py-8">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Order Form */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-5 sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-[#211e0f] mb-4 sm:mb-6" style={{ fontFamily: 'Rowdies, cursive' }}>
              {t('checkout.deliveryInfo')}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('checkout.fullName')} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={t('checkout.fullName')}
                    className="pl-12 py-3 rounded-xl"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('checkout.phone')} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g., 0612345678"
                    className="pl-12 py-3 rounded-xl"
                    required
                  />
                </div>
              </div>

              {/* Email (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('checkout.email')}
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className="py-3 rounded-xl"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('checkout.address')} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder={t('checkout.address')}
                    className="pl-12 py-3 rounded-xl"
                    required
                  />
                </div>
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('checkout.city')} <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="e.g., Casablanca"
                  className="py-3 rounded-xl"
                  required
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('checkout.notes')}
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder={t('checkout.notes')}
                    rows={3}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 
                             focus:border-[#f6b638] focus:ring-2 focus:ring-[#f6b638]/20 
                             resize-none"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="space-y-3 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary py-5 sm:py-6 text-base sm:text-lg flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {t('checkout.processing')}
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      {t('checkout.placeOrder')}
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  onClick={handleWhatsAppOnly}
                  variant="outline"
                  className="w-full border-green-500 text-green-600 hover:bg-green-50 py-4 sm:py-5 
                           text-base flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  {t('cart.orderWhatsApp')}
                </Button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-5 sm:p-8">
              <h2 className="text-lg sm:text-xl font-bold text-[#211e0f] mb-4 sm:mb-6" style={{ fontFamily: 'Rowdies, cursive' }}>
                {t('checkout.orderSummary')}
              </h2>

              {/* Items */}
              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 max-h-48 sm:max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 sm:gap-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-[#211e0f] text-sm sm:text-base truncate">{item.name}</h4>
                      <p className="text-xs sm:text-sm text-gray-500">{t('productDetail.quantity')}: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-[#f58a1f] text-sm sm:text-base">
                      {item.price * item.quantity} MAD
                    </p>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="border-t pt-4 space-y-2 sm:space-y-3">
                <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                  <span>{t('cart.subtotal')}</span>
                  <span>{totalPrice} MAD</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                  <span>{t('cart.shipping')}</span>
                  <span>{shippingCost === 0 ? t('checkout.freeShipping') : `${shippingCost} MAD`}</span>
                </div>
                {shippingCost === 0 && (
                  <p className="text-xs sm:text-sm text-green-600">{t('checkout.freeShipping')}</p>
                )}
                <div className="flex justify-between text-lg sm:text-xl font-bold text-[#211e0f] pt-3 border-t">
                  <span>{t('cart.total')}</span>
                  <span className="text-[#f58a1f]">{finalTotal} MAD</span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-[#f6b638]/10 rounded-2xl p-4 sm:p-6">
              <h3 className="font-semibold text-[#211e0f] mb-3">{t('checkout.cashOnDelivery')}</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                </div>
                <div>
                  <p className="font-medium text-[#211e0f] text-sm sm:text-base">{t('checkout.cashOnDelivery')}</p>
                  <p className="text-xs sm:text-sm text-gray-600">{t('checkout.payOnReceive')}</p>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              <div className="text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-1 sm:mb-2 shadow-sm">
                  <Check className="w-5 h-5 sm:w-6 sm:h-6 text-[#f6b638]" />
                </div>
                <p className="text-xs text-gray-600">{t('checkout.secureOrder')}</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-1 sm:mb-2 shadow-sm">
                  <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-[#f6b638]" />
                </div>
                <p className="text-xs text-gray-600">{t('checkout.fastDelivery')}</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-1 sm:mb-2 shadow-sm">
                  <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-[#f6b638]" />
                </div>
                <p className="text-xs text-gray-600">{t('checkout.support')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
