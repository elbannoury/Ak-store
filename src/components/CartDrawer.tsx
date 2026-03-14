import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, ShoppingBag, Trash2, ArrowRight, MessageCircle } from 'lucide-react';
import { useCartStore, type CartItem } from '@/store/cartStore';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { whatsappService } from '@/services/whatsappService';
import { toast } from 'sonner';

const CartDrawer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items, isOpen, setCartOpen, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();

  const totalPrice = getTotalPrice();

  const handleCheckout = () => {
    setCartOpen(false);
    navigate('/checkout');
  };

  const handleWhatsAppOrder = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    whatsappService.quickOrder(items, totalPrice);
    toast.success('Opening WhatsApp to complete your order!');
  };

  const handleContinueShopping = () => {
    setCartOpen(false);
    navigate('/products');
  };

  return (
    <Sheet open={isOpen} onOpenChange={setCartOpen}>
      <SheetContent side="right" className="w-full sm:w-[450px] bg-[#fff9ed] border-l-[#f6b638]/20 flex flex-col">
        <SheetHeader className="border-b border-[#f6b638]/20 pb-4">
          <SheetTitle className="text-2xl text-[#211e0f] flex items-center gap-3" style={{ fontFamily: 'Rowdies, cursive' }}>
            <ShoppingBag className="w-6 h-6 text-[#f6b638]" />
            {t('cart.title')}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-6">
            <div className="w-32 h-32 bg-[#f6b638]/10 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-16 h-16 text-[#f6b638]" />
            </div>
            <p className="text-xl text-[#211e0f]/60 font-medium">{t('cart.empty')}</p>
            <Button
              onClick={handleContinueShopping}
              className="btn-primary"
            >
              {t('cart.continueShopping')}
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {items.map((item: CartItem) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-white rounded-2xl shadow-sm border border-[#f6b638]/10 
                           hover:shadow-md transition-shadow duration-300"
                >
                  {/* Product Image */}
                  <div className="w-20 h-20 bg-[#f6b638]/10 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-[#211e0f] truncate">{item.name}</h4>
                    <p className="text-sm text-[#211e0f]/60">{item.category}</p>
                    <p className="text-lg font-bold text-[#f58a1f] mt-1">
                      {item.price} MAD
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-full bg-[#f6b638]/20 hover:bg-[#f6b638] 
                                 flex items-center justify-center transition-colors duration-300"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-full bg-[#f6b638]/20 hover:bg-[#f6b638] 
                                 flex items-center justify-center transition-colors duration-300"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-[#211e0f]/40 hover:text-red-500 
                             transition-colors duration-300 self-start"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Cart Footer */}
            <div className="border-t border-[#f6b638]/20 pt-4 space-y-4">
              {/* Summary */}
              <div className="space-y-2">
                <div className="flex justify-between text-[#211e0f]/60">
                  <span>{t('cart.subtotal')}</span>
                  <span>{totalPrice} MAD</span>
                </div>
                <div className="flex justify-between text-[#211e0f]/60">
                  <span>{t('cart.shipping')}</span>
                  <span>{totalPrice > 500 ? 'Free' : '30 MAD'}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-[#211e0f] pt-2 border-t border-[#f6b638]/20">
                  <span>{t('cart.total')}</span>
                  <span className="text-[#f58a1f]">{totalPrice > 500 ? totalPrice : totalPrice + 30} MAD</span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <Button 
                  onClick={handleCheckout}
                  className="w-full btn-primary text-lg py-6 flex items-center justify-center gap-2"
                >
                  {t('cart.checkout')}
                  <ArrowRight className="w-5 h-5" />
                </Button>
                
                <Button
                  onClick={handleWhatsAppOrder}
                  variant="outline"
                  className="w-full border-green-500 text-green-600 hover:bg-green-50 py-4 
                           flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Order via WhatsApp
                </Button>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleContinueShopping}
                    className="flex-1 border-[#f6b638] text-[#211e0f] hover:bg-[#f6b638]/10"
                  >
                    {t('cart.continueShopping')}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={clearCart}
                    className="border-red-300 text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
