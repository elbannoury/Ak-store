import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  LogOut,
  Package,
  ShoppingBag,
  Search,
  Eye,
  EyeOff
} from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { products as initialProducts } from '@/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import type { Product } from '@/types';

// Admin password - in production, use proper authentication
const ADMIN_PASSWORD = 'akadmin2024';

const AdminPanel = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');

  // Load products from localStorage or use initial
  useEffect(() => {
    const savedProducts = localStorage.getItem('ak-products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(initialProducts);
    }
  }, []);

  // Save products to localStorage
  const saveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem('ak-products', JSON.stringify(newProducts));
    // Dispatch event to notify other components
    window.dispatchEvent(new Event('productsUpdated'));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      toast.success('Welcome to Admin Panel!');
    } else {
      toast.error('Invalid password');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPassword('');
    toast.info('Logged out successfully');
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const newProducts = products.filter(p => p.id !== productId);
      saveProducts(newProducts);
      toast.success('Product deleted successfully');
    }
  };

  const handleSaveProduct = (product: Product) => {
    if (isAddingNew) {
      const newProducts = [...products, { ...product, id: Date.now().toString() }];
      saveProducts(newProducts);
      toast.success('Product added successfully');
    } else {
      const newProducts = products.map(p => p.id === product.id ? product : p);
      saveProducts(newProducts);
      toast.success('Product updated successfully');
    }
    setEditingProduct(null);
    setIsAddingNew(false);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isLoggedIn) {
    return (
      <MainLayout showCartDrawer={false}>
        <div className="min-h-screen bg-[#211e0f] flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-[#f6b638] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl font-bold text-[#211e0f]" style={{ fontFamily: 'Rowdies, cursive' }}>
                AK
              </span>
            </div>
            <h1 className="text-2xl font-bold text-[#211e0f]" style={{ fontFamily: 'Rowdies, cursive' }}>
              {t('admin.login')}
            </h1>
            <p className="text-gray-500 mt-2">AK Kids Admin Panel</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('admin.password')}
                className="pr-12 py-4 rounded-xl"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <Button type="submit" className="w-full btn-primary py-4">
              {t('admin.loginButton')}
            </Button>
            </form>

            <button
              onClick={() => navigate('/')}
              className="w-full mt-4 text-center text-gray-500 hover:text-[#f58a1f] transition-colors"
            >
              ← Back to Website
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout showCartDrawer={false}>
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Admin Header */}
      <header className="bg-[#211e0f] text-white sticky top-0 z-50">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#f6b638] rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-[#211e0f]" style={{ fontFamily: 'Rowdies, cursive' }}>
                  AK
                </span>
              </div>
              <h1 className="text-xl font-bold" style={{ fontFamily: 'Rowdies, cursive' }}>
                {t('admin.title')}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="text-white/70 hover:text-white transition-colors"
              >
                View Website
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 
                         rounded-full text-red-300 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                {t('admin.logout')}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 py-4 border-b-2 transition-colors ${
                activeTab === 'products'
                  ? 'border-[#f6b638] text-[#f6b638]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Package className="w-5 h-5" />
              {t('admin.products')}
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 py-4 border-b-2 transition-colors ${
                activeTab === 'orders'
                  ? 'border-[#f6b638] text-[#f6b638]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              {t('admin.orders')}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'products' && (
          <div>
            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="pl-12 py-3 rounded-xl"
                />
              </div>
              <Button
                onClick={() => {
                  setIsAddingNew(true);
                  setEditingProduct({
                    id: '',
                    name: '',
                    price: 0,
                    image: '',
                    images: [],
                    category: 'boys',
                    description: '',
                    inStock: true,
                    isNew: false,
                    isSale: false,
                  } as Product);
                }}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                {t('admin.addProduct')}
              </Button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Image</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Product</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Price</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Category</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-xl"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-[#211e0f]">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.sku}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-[#f58a1f]">{product.price} MAD</span>
                          {product.originalPrice && (
                            <span className="text-sm text-gray-400 line-through ml-2">
                              {product.originalPrice} MAD
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-[#f6b638]/20 text-[#f58a1f] rounded-full text-sm capitalize">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            {product.inStock && (
                              <span className="px-2 py-1 bg-green-100 text-green-600 rounded text-xs">
                                In Stock
                              </span>
                            )}
                            {product.isNew && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs">
                                New
                              </span>
                            )}
                            {product.isSale && (
                              <span className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs">
                                Sale
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingProduct(product);
                                setIsAddingNew(false);
                              }}
                              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Orders Management</h3>
            <p className="text-gray-500">Orders are managed through WhatsApp and Google Sheets.</p>
            <p className="text-gray-400 text-sm mt-2">Check your WhatsApp messages for new orders.</p>
          </div>
        )}
      </div>

      {/* Product Edit Modal */}
      {(editingProduct || isAddingNew) && (
        <ProductEditModal
          product={editingProduct!}
          isNew={isAddingNew}
          onSave={handleSaveProduct}
          onCancel={() => {
            setEditingProduct(null);
            setIsAddingNew(false);
          }}
        />
      )}
    </div>
    </MainLayout>
  );
};

// Product Edit Modal Component
interface ProductEditModalProps {
  product: Product;
  isNew: boolean;
  onSave: (product: Product) => void;
  onCancel: () => void;
}

const ProductEditModal = ({ product, isNew, onSave, onCancel }: ProductEditModalProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<Product>({ ...product });
  const [newImageUrl, setNewImageUrl] = useState('');

  const handleChange = (field: keyof Product, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), newImageUrl.trim()]
      }));
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index) || []
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold" style={{ fontFamily: 'Rowdies, cursive' }}>
            {isNew ? t('admin.addProduct') : t('admin.editProduct')}
          </h2>
          <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.productName')} *
              </label>
              <Input
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
                className="rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.sku')}
              </label>
              <Input
                value={formData.sku || ''}
                onChange={(e) => handleChange('sku', e.target.value)}
                placeholder="e.g., AK-001"
                className="rounded-xl"
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.price')} (MAD) *
              </label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => handleChange('price', parseFloat(e.target.value))}
                required
                min="0"
                className="rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.originalPrice')} (MAD)
              </label>
              <Input
                type="number"
                value={formData.originalPrice || ''}
                onChange={(e) => handleChange('originalPrice', parseFloat(e.target.value) || undefined)}
                min="0"
                className="rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.category')} *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-[#f6b638] focus:border-[#f6b638]"
              >
                <option value="baby">Baby</option>
                <option value="boys">Boys</option>
                <option value="girls">Girls</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('admin.description')}
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-[#f6b638] focus:border-[#f6b638] resize-none"
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('admin.images')}
            </label>
            <div className="flex gap-2 mb-4">
              <Input
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Enter image URL..."
                className="flex-1 rounded-xl"
              />
              <Button
                type="button"
                onClick={handleAddImage}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </div>
            <div className="flex gap-4 flex-wrap">
              {formData.images?.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={img}
                    alt={`Product ${index + 1}`}
                    className="w-24 h-24 object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Sizes & Colors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.sizes')} (comma separated)
              </label>
              <Input
                value={formData.sizes?.join(', ') || ''}
                onChange={(e) => handleChange('sizes', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                placeholder="e.g., 2-3Y, 4-5Y, 6-7Y"
                className="rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.colors')} (comma separated)
              </label>
              <Input
                value={formData.colors?.join(', ') || ''}
                onChange={(e) => handleChange('colors', e.target.value.split(',').map(c => c.trim()).filter(Boolean))}
                placeholder="e.g., Red, Blue, Yellow"
                className="rounded-xl"
              />
            </div>
          </div>

          {/* Options */}
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.inStock}
                onChange={(e) => handleChange('inStock', e.target.checked)}
                className="w-5 h-5 accent-[#f6b638]"
              />
              <span className="text-sm">{t('admin.inStock')}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isNew}
                onChange={(e) => handleChange('isNew', e.target.checked)}
                className="w-5 h-5 accent-[#f6b638]"
              />
              <span className="text-sm">{t('admin.isNew')}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isSale}
                onChange={(e) => handleChange('isSale', e.target.checked)}
                className="w-5 h-5 accent-[#f6b638]"
              />
              <span className="text-sm">{t('admin.isSale')}</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t">
            <Button type="submit" className="flex-1 btn-primary flex items-center justify-center gap-2">
              <Save className="w-5 h-5" />
              {t('admin.save')}
            </Button>
            <Button type="button" onClick={onCancel} variant="outline" className="flex-1">
              {t('admin.cancel')}
            </Button>
          </div>
         </form>
      </div>
    </div>
  );
};

export default AdminPanel;
