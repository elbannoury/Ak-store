import { useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, ShoppingBag, Trash2, ArrowRight, MessageCircle, X } from 'lucide-react';
import { useCartStore, type CartItem } from '@/store/cartStore';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { whatsappService } from '@/services/whatsappService';
import { toast } from 'sonner';

const CartItemRow = ({ item, onUpdateQuantity, onRemove }: { 
  item: CartItem, 
  onUpdateQuantity: (id: string, q: number) => void, 
  onRemove: (id: string) => void 
}) => {
  return (
    <div
      className="flex gap-4 p-4 bg-white rounded-2xl shadow-sm border border-[#f6b638]/10 
               hover:shadow-md transition-all duration-300 animate-in fade-in slide-in-from-right-4"
    >
      {/* Product Image */}
      <div className="w-20 h-20 bg-[#f6b638]/5 rounded-xl overflow-hidden flex-shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-[#211e0f] truncate text-sm sm:text-base">{item.name}</h4>
        <p className="text-xs text-[#211e0f]/60">{item.category}</p>
        <p className="text-base font-bold text-[#f58a1f] mt-1">
          {item.price} MAD
        </p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            className="w-8 h-8 rounded-full bg-[#f6b638]/10 hover:bg-[#f6b638] hover:text-white
                     flex items-center justify-center transition-all duration-200 active:scale-90"
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-6 text-center font-bold text-[#211e0f]">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="w-8 h-8 rounded-full bg-[#f6b638]/10 hover:bg-[#f6b638] hover:text-white
                     flex items-center justify-center transition-all duration-200 active:scale-90"
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => onRemove(item.id)}
        className="p-2 text-[#211e0f]/30 hover:text-red-500 
                 transition-colors duration-200 self-start active:scale-90"
        aria-label="Remove item"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
};

const CartDrawer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items, isOpen, setCartOpen, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();

  const totalPrice = useMemo(() => getTotalPrice(), [items, getTotalPrice]);
  const shippingCost = useMemo(() => (totalPrice > 500 || totalPrice === 0 ? 0 : 30), [totalPrice]);
  const finalTotal = useMemo(() => totalPrice + shippingCost, [totalPrice, shippingCost]);

  const handleCheckout = useCallback(() => {
    setCartOpen(false);
    // Delay navigation slightly to allow drawer closing animation to start smoothly
    setTimeout(() => navigate('/checkout'), 100);
  }, [setCartOpen, navigate]);

  const handleWhatsAppOrder = useCallback(() => {
    if (items.length === 0) {
      toast.error(t('cart.empty'));
      return;
    }
    whatsappService.quickOrder(items, totalPrice);
    toast.success(t('productDetail.orderWhatsApp'));
  }, [items, totalPrice, t]);

  const handleContinueShopping = useCallback(() => {
    setCartOpen(false);
    if (window.location.pathname !== '/products') {
        setTimeout(() => navigate('/products'), 100);
    }
  }, [setCartOpen, navigate]);

  return (
    <Sheet open={isOpen} onOpenChange={setCartOpen}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-[450px] bg-[#fff9ed] border-l-[#f6b638]/20 flex flex-col p-0 gap-0 shadow-2xl"
      >
        <SheetHeader className="p-6 border-b border-[#f6b638]/10 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl text-[#211e0f] flex items-center gap-3" style={{ fontFamily: 'Rowdies, cursive' }}>
              <ShoppingBag className="w-6 h-6 text-[#f6b638]" />
              {t('cart.title')}
            </SheetTitle>
            <SheetClose className="rounded-full p-2 hover:bg-[#f6b638]/10 transition-colors">
                <X className="w-5 h-5 text-[#211e0f]/60" />
            </SheetClose>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center gap-6 text-center animate-in fade-in zoom-in-95 duration-300">
              <div className="w-32 h-32 bg-[#f6b638]/10 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-16 h-16 text-[#f6b638]" />
              </div>
              <div className="space-y-2">
                <p className="text-xl text-[#211e0f] font-bold">{t('cart.empty')}</p>
                <p className="text-[#211e0f]/60 max-w-[250px] mx-auto text-sm">
                    {t('hero.description').split('.')[0]}
                </p>
              </div>
              <Button
                onClick={handleContinueShopping}
                className="btn-primary px-8 py-6 rounded-2xl shadow-lg shadow-[#f6b638]/20"
              >
                {t('cart.continueShopping')}
              </Button>
            </div>
          ) : (
            <div className="space-y-4 pb-6">
              {items.map((item) => (
                <CartItemRow 
                  key={item.id} 
                  item={item} 
                  onUpdateQuantity={updateQuantity} 
                  onRemove={removeItem} 
                />
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 bg-white border-t border-[#f6b638]/10 space-y-6 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
            {/* Summary */}
            <div className="space-y-3">
              <div className="flex justify-between text-[#211e0f]/60 font-medium">
                <span>{t('cart.subtotal')}</span>
                <span>{totalPrice} MAD</span>
              </div>
              <div className="flex justify-between text-[#211e0f]/60 font-medium">
                <span>{t('cart.shipping')}</span>
                <span className={shippingCost === 0 ? "text-green-600 font-bold" : ""}>
                    {shippingCost === 0 ? t('productDetail.freeDelivery') : `${shippingCost} MAD`}
                </span>
              </div>
              {shippingCost > 0 && (
                <p className="text-[10px] text-[#f58a1f] bg-[#f58a1f]/5 p-2 rounded-lg text-center">
                    {t('products.freeShipping')}
                </p>
              )}
              <div className="flex justify-between text-2xl font-bold text-[#211e0f] pt-3 border-t border-[#f6b638]/10">
                <span>{t('cart.total')}</span>
                <span className="text-[#f58a1f]">{finalTotal} MAD</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button 
                onClick={handleCheckout}
                className="w-full btn-primary text-lg py-7 rounded-2xl shadow-xl shadow-[#f6b638]/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
              >
                {t('cart.checkout')}
                <ArrowRight className="w-5 h-5" />
              </Button>
              
              <Button
                onClick={handleWhatsAppOrder}
                variant="outline"
                className="w-full border-green-500/30 text-green-600 hover:bg-green-50 py-6 rounded-2xl
                         flex items-center justify-center gap-2 font-bold active:scale-[0.98] transition-all"
              >
                <MessageCircle className="w-5 h-5" />
                {t('cart.orderWhatsApp')}
              </Button>

              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  onClick={handleContinueShopping}
                  className="flex-1 text-[#211e0f]/60 hover:text-[#211e0f] hover:bg-[#f6b638]/5 rounded-xl"
                >
                  {t('cart.continueShopping')}
                </Button>
                <Button
                  variant="ghost"
                  onClick={clearCart}
                  className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl px-3"
                  title={t('common.delete')}
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
