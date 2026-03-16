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
