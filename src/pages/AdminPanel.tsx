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
  EyeOff,
  Loader2,
  RefreshCw
} from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { products as initialProducts } from '@/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import type { Product } from '@/types';
import { supabase } from '@/lib/supabaseClient';

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
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load products from Supabase
  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setProducts(data as Product[]);
        localStorage.setItem('ak-products', JSON.stringify(data));
      } else {
        // If Supabase is empty, show initial data but don't save to DB automatically
        const savedProducts = localStorage.getItem('ak-products');
        setProducts(savedProducts ? JSON.parse(savedProducts) : initialProducts);
      }
    } catch (error) {
      console.error('Error loading products from Supabase:', error);
      toast.error('Failed to load from cloud. Using local data.');
      const savedProducts = localStorage.getItem('ak-products');
      setProducts(savedProducts ? JSON.parse(savedProducts) : initialProducts);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

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

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setIsSaving(true);
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', productId);

        if (error) throw error;

        setProducts(products.filter(p => p.id !== productId));
        toast.success('Product deleted from cloud');
        window.dispatchEvent(new Event('productsUpdated'));
      } catch (error) {
        console.error('Delete error:', error);
        toast.error('Failed to delete from cloud');
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleSaveProduct = async (product: Product) => {
    setIsSaving(true);
    try {
      if (isAddingNew) {
        const newProduct = { 
          ...product, 
          id: Date.now().toString(),
          created_at: new Date().toISOString()
        };
        const { error } = await supabase.from('products').insert([newProduct]);
        if (error) throw error;
        setProducts([newProduct, ...products]);
        toast.success('Product added to cloud!');
      } else {
        const { error } = await supabase
          .from('products')
          .update(product)
          .eq('id', product.id);
        if (error) throw error;
        setProducts(products.map(p => p.id === product.id ? product : p));
        toast.success('Product updated in cloud!');
      }
      
      setEditingProduct(null);
      setIsAddingNew(false);
      window.dispatchEvent(new Event('productsUpdated'));
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to sync with cloud');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSyncInitialData = async () => {
    if (!confirm('This will upload all initial products to Supabase. Continue?')) return;
    setIsSaving(true);
    try {
      const { error } = await supabase.from('products').upsert(initialProducts);
      if (error) throw error;
      toast.success('Initial data synced to cloud!');
      loadProducts();
    } catch (error) {
      console.error('Sync error:', error);
      toast.error('Sync failed');
    } finally {
      setIsSaving(false);
    }
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
              {isSaving && (
                <div className="flex items-center gap-2 text-xs text-[#f6b638] animate-pulse">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Cloud Syncing...
                </div>
              )}
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
              <div className="flex gap-2">
                <Button
                  onClick={loadProducts}
                  variant="outline"
                  className="flex items-center gap-2 border-gray-200"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button
                  onClick={handleSyncInitialData}
                  variant="outline"
                  className="flex items-center gap-2 border-[#f6b638] text-[#f6b638] hover:bg-[#f6b638]/10"
                >
                  Sync Initial Data
                </Button>
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
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-10 h-10 text-[#f6b638] animate-spin" />
              </div>
            ) : (
              /* Products Table */
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
                        <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <img
                              src={product.image || (product.images && product.images[0])}
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">{product.name}</div>
                            <div className="text-xs text-gray-500 line-clamp-1">{product.description}</div>
                          </td>
                          <td className="px-6 py-4 font-semibold text-[#f58a1f]">
                            {product.price} MAD
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
                              {product.category}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1">
                              {product.inStock ? (
                                <span className="text-xs text-green-600 font-medium">In Stock</span>
                              ) : (
                                <span className="text-xs text-red-600 font-medium">Out of Stock</span>
                              )}
                              {product.isNew && (
                                <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded w-fit">NEW</span>
                              )}
                              {product.isSale && (
                                <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded w-fit">SALE</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setEditingProduct(product)}
                                className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
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
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Order Management</h3>
            <p className="text-gray-500">
              Orders will appear here once customers start purchasing from your store.
            </p>
          </div>
        )}
      </div>

      {/* Edit/Add Product Dialog */}
      {editingProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl p-6 sm:p-8 my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold" style={{ fontFamily: 'Rowdies, cursive' }}>
                {isAddingNew ? 'Add New Product' : 'Edit Product'}
              </h2>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setIsAddingNew(false);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <Input
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    placeholder="Enter product name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (MAD)</label>
                    <Input
                      type="number"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Original Price</label>
                    <Input
                      type="number"
                      value={editingProduct.originalPrice || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#f6b638] focus:ring-[#f6b638]"
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as any })}
                  >
                    <option value="boys">Boys</option>
                    <option value="girls">Girls</option>
                    <option value="babies">Babies</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Main Image URL</label>
                  <Input
                    value={editingProduct.image}
                    onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-[#f6b638] focus:ring-[#f6b638] h-24"
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  />
                </div>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.inStock}
                      onChange={(e) => setEditingProduct({ ...editingProduct, inStock: e.target.checked })}
                      className="w-4 h-4 rounded text-[#f6b638] focus:ring-[#f6b638]"
                    />
                    <span className="text-sm">In Stock</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.isNew}
                      onChange={(e) => setEditingProduct({ ...editingProduct, isNew: e.target.checked })}
                      className="w-4 h-4 rounded text-[#f6b638] focus:ring-[#f6b638]"
                    />
                    <span className="text-sm">New Badge</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.isSale}
                      onChange={(e) => setEditingProduct({ ...editingProduct, isSale: e.target.checked })}
                      className="w-4 h-4 rounded text-[#f6b638] focus:ring-[#f6b638]"
                    />
                    <span className="text-sm">Sale Badge</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <Button
                onClick={() => handleSaveProduct(editingProduct)}
                disabled={isSaving}
                className="flex-1 btn-primary flex items-center justify-center gap-2"
              >
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {isAddingNew ? 'Add Product' : 'Save Changes'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setEditingProduct(null);
                  setIsAddingNew(false);
                }}
                className="flex-1 border-gray-200"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
    </MainLayout>
  );
};

export default AdminPanel;
