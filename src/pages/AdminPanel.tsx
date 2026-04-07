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
  RefreshCw,
  CloudUpload
} from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { products as initialProducts } from '@/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import type { Product } from '@/types';
import { supabase } from '@/lib/supabaseClient';

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

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        // Clean up data if needed (Supabase might return nulls or different types)
        const cleanedData = data.map(p => ({
          ...p,
          price: Number(p.price),
          originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
          rating: p.rating ? Number(p.rating) : undefined,
        }));
        setProducts(cleanedData as Product[]);
        localStorage.setItem('ak-products', JSON.stringify(cleanedData));
      } else {
        const savedProducts = localStorage.getItem('ak-products');
        setProducts(savedProducts ? JSON.parse(savedProducts) : initialProducts);
      }
    } catch (error: any) {
      console.error('Supabase load error:', error);
      toast.error(error.message || 'Failed to load from cloud');
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
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      setProducts(products.filter(p => p.id !== productId));
      toast.success('Product deleted successfully');
      window.dispatchEvent(new Event('productsUpdated'));
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error(error.message || 'Failed to delete product');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveProduct = async (product: Product) => {
    if (!product.name || !product.price) {
      toast.error('Name and Price are required');
      return;
    }

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
        toast.success('Product added successfully!');
      } else {
        const { error } = await supabase
          .from('products')
          .update({
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.image,
            category: product.category,
            description: product.description,
            inStock: product.inStock,
            isNew: product.isNew,
            isSale: product.isSale
          })
          .eq('id', product.id);
        if (error) throw error;
        setProducts(products.map(p => p.id === product.id ? product : p));
        toast.success('Product updated successfully!');
      }
      
      setEditingProduct(null);
      setIsAddingNew(false);
      window.dispatchEvent(new Event('productsUpdated'));
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error(error.message || 'Failed to save to cloud');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSyncInitialData = async () => {
    if (!confirm('This will upload all initial products to your cloud database. Continue?')) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase.from('products').upsert(
        initialProducts.map(p => ({ ...p, created_at: new Date().toISOString() }))
      );
      if (error) throw error;
      toast.success('All products synced to cloud!');
      loadProducts();
    } catch (error: any) {
      console.error('Sync error:', error);
      toast.error(error.message || 'Sync failed. Make sure you created the table in Supabase.');
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
                <span className="text-3xl font-bold text-[#211e0f]" style={{ fontFamily: 'Rowdies, cursive' }}>AK</span>
              </div>
              <h1 className="text-2xl font-bold text-[#211e0f]" style={{ fontFamily: 'Rowdies, cursive' }}>{t('admin.login')}</h1>
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
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <Button type="submit" className="w-full btn-primary py-4">{t('admin.loginButton')}</Button>
            </form>
            <button onClick={() => navigate('/')} className="w-full mt-4 text-center text-gray-500 hover:text-[#f58a1f]">← Back to Website</button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout showCartDrawer={false}>
      <div className="min-h-screen bg-[#f5f5f5]">
        <header className="bg-[#211e0f] text-white sticky top-0 z-50">
          <div className="w-full px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#f6b638] rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-[#211e0f]" style={{ fontFamily: 'Rowdies, cursive' }}>AK</span>
              </div>
              <h1 className="text-xl font-bold" style={{ fontFamily: 'Rowdies, cursive' }}>{t('admin.title')}</h1>
              {isSaving && <div className="flex items-center gap-2 text-xs text-[#f6b638] animate-pulse"><Loader2 className="w-3 h-3 animate-spin" /> Syncing...</div>}
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/')} className="text-white/70 hover:text-white">View Website</button>
              <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-red-500/20 rounded-full text-red-300"><LogOut className="w-4 h-4" /> {t('admin.logout')}</button>
            </div>
          </div>
        </header>

        <div className="bg-white border-b px-4 flex gap-8">
          <button onClick={() => setActiveTab('products')} className={`py-4 border-b-2 ${activeTab === 'products' ? 'border-[#f6b638] text-[#f6b638]' : 'border-transparent text-gray-500'}`}>Products</button>
          <button onClick={() => setActiveTab('orders')} className={`py-4 border-b-2 ${activeTab === 'orders' ? 'border-[#f6b638] text-[#f6b638]' : 'border-transparent text-gray-500'}`}>Orders</button>
        </div>

        <div className="w-full px-4 py-8">
          {activeTab === 'products' && (
            <div>
              <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center">
                <div className="relative flex-1 max-w-md w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search products..." className="pl-12 rounded-xl" />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button onClick={loadProducts} variant="outline" className="flex-1 sm:flex-none"><RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} /> Refresh</Button>
                  <Button onClick={handleSyncInitialData} variant="outline" className="flex-1 sm:flex-none text-[#f6b638] border-[#f6b638]"><CloudUpload className="w-4 h-4 mr-2" /> Sync Initial</Button>
                  <Button onClick={() => { setIsAddingNew(true); setEditingProduct({ id: '', name: '', price: 0, image: '', category: 'boys', description: '', inStock: true } as Product); }} className="flex-1 sm:flex-none btn-primary"><Plus className="w-4 h-4 mr-2" /> Add Product</Button>
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 text-[#f6b638] animate-spin" /></div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-4 font-semibold text-gray-600">Image</th>
                        <th className="px-6 py-4 font-semibold text-gray-600">Product</th>
                        <th className="px-6 py-4 font-semibold text-gray-600">Price</th>
                        <th className="px-6 py-4 font-semibold text-gray-600">Category</th>
                        <th className="px-6 py-4 font-semibold text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4"><img src={product.image} className="w-12 h-12 rounded-lg object-cover" alt="" /></td>
                          <td className="px-6 py-4">
                            <div className="font-medium">{product.name}</div>
                            <div className="text-xs text-gray-500 line-clamp-1">{product.description}</div>
                          </td>
                          <td className="px-6 py-4 font-semibold text-[#f58a1f]">{product.price} MAD</td>
                          <td className="px-6 py-4"><span className="px-2 py-1 bg-gray-100 rounded text-xs">{product.category}</span></td>
                          <td className="px-6 py-4 flex gap-2">
                            <button onClick={() => setEditingProduct(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => handleDeleteProduct(product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {editingProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold" style={{ fontFamily: 'Rowdies, cursive' }}>{isAddingNew ? 'Add Product' : 'Edit Product'}</h2>
                <button onClick={() => setEditingProduct(null)}><X className="w-6 h-6" /></button>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div><label className="text-sm font-medium">Product Name</label><Input value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} /></div>
                  <div><label className="text-sm font-medium">Price (MAD)</label><Input type="number" value={editingProduct.price} onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })} /></div>
                  <div><label className="text-sm font-medium">Category</label>
                    <select className="w-full p-2 border rounded-xl" value={editingProduct.category} onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as any })}>
                      <option value="boys">Boys</option><option value="girls">Girls</option><option value="babies">Babies</option><option value="accessories">Accessories</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-4">
                  <div><label className="text-sm font-medium">Image URL</label><Input value={editingProduct.image} onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })} /></div>
                  <div><label className="text-sm font-medium">Description</label><textarea className="w-full p-2 border rounded-xl h-24" value={editingProduct.description} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} /></div>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2"><input type="checkbox" checked={editingProduct.inStock} onChange={(e) => setEditingProduct({ ...editingProduct, inStock: e.target.checked })} /> In Stock</label>
                    <label className="flex items-center gap-2"><input type="checkbox" checked={editingProduct.isNew} onChange={(e) => setEditingProduct({ ...editingProduct, isNew: e.target.checked })} /> New</label>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex gap-4">
                <Button onClick={() => handleSaveProduct(editingProduct)} disabled={isSaving} className="flex-1 btn-primary">{isSaving ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5 mr-2" />} Save</Button>
                <Button onClick={() => setEditingProduct(null)} variant="outline" className="flex-1">Cancel</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default AdminPanel;
