import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  Star, 
  Grid3X3, 
  List,
  ChevronDown,
  X
} from 'lucide-react';
import { categories } from '@/data';
import { useCartStore } from '@/store/cartStore';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import type { Product } from '@/types';

const AllProducts = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addItem, getTotalItems, toggleCart } = useCartStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || 'all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'newest' | 'rating'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Load products
  useEffect(() => {
    const loadProducts = () => {
      const savedProducts = localStorage.getItem('ak-products');
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      } else {
        // Import initial products if none saved
        import('@/data').then(({ products: initialProducts }) => {
          setProducts(initialProducts);
        });
      }
    };

    loadProducts();

    // Listen for product updates
    const handleProductsUpdated = () => {
      loadProducts();
    };
    window.addEventListener('productsUpdated', handleProductsUpdated);

    return () => {
      window.removeEventListener('productsUpdated', handleProductsUpdated);
    };
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Price filter
    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
    }

    return result;
  }, [products, searchQuery, selectedCategory, priceRange, sortBy]);

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    });
    toast.success(`${product.name} ${t('products.addToCart')}`);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setPriceRange([0, 1000]);
    setSortBy('newest');
  };

  const hasActiveFilters =
    searchQuery || selectedCategory !== 'all' || priceRange[1] < 1000;

  return (
    <div className="min-h-screen bg-[#fff9ed]">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-lg shadow-sm">
        <div className="w-full section-padding py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Logo */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <div className="w-10 h-10 bg-[#f6b638] rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-[#211e0f]" style={{ fontFamily: 'Rowdies, cursive' }}>
                  AK
                </span>
              </div>
              <span className="text-xl font-bold text-[#211e0f]" style={{ fontFamily: 'Rowdies, cursive' }}>
                KIDS
              </span>
            </button>

            {/* Search Bar */}
            <div className="flex-1 max-w-xl relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder={t('products.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 rounded-full border-gray-200 focus:border-[#f6b638] focus:ring-[#f6b638]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              )}
            </div>

            {/* Cart Button */}
            <button
              onClick={toggleCart}
              className="relative p-3 bg-[#f6b638] rounded-full hover:bg-[#f58a1f] transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-[#211e0f]" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#211e0f] text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="border-t">
          <div className="w-full section-padding py-3">
            <div className="flex items-center gap-4 overflow-x-auto pb-2">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200"
              >
                <Filter className="w-4 h-4" />
                {t('products.filter')}
              </button>

              {/* Desktop Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`hidden lg:flex items-center gap-2 px-4 py-2 rounded-full border transition-colors whitespace-nowrap ${
                  showFilters
                    ? 'bg-[#f6b638] border-[#f6b638] text-[#211e0f]'
                    : 'border-gray-200 hover:border-[#f6b638]'
                }`}
              >
                <Filter className="w-4 h-4" />
                {t('products.filter')}
              </button>

              {/* Category Filter */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none px-4 py-2 pr-10 rounded-full border border-gray-200 
                           focus:border-[#f6b638] focus:ring-[#f6b638] bg-white cursor-pointer"
                >
                  <option value="all">{t('products.categories')}</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {t(`categories.${cat.id}`)}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="appearance-none px-4 py-2 pr-10 rounded-full border border-gray-200 
                           focus:border-[#f6b638] focus:ring-[#f6b638] bg-white cursor-pointer"
                >
                  <option value="newest">{t('products.newest')}</option>
                  <option value="price-asc">{t('products.priceAsc')}</option>
                  <option value="price-desc">{t('products.priceDesc')}</option>
                  <option value="rating">{t('products.rating')}</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
              </div>

              {/* View Mode */}
              <div className="flex items-center border border-gray-200 rounded-full overflow-hidden ml-auto">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-[#f6b638]' : 'hover:bg-gray-100'}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-[#f6b638]' : 'hover:bg-gray-100'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                  {t('products.clearFilters')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Price Filter Panel - Desktop */}
      {showFilters && (
        <div className="hidden lg:block bg-white border-b">
          <div className="w-full section-padding py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <span className="font-semibold text-[#211e0f]">{t('products.priceRange')}:</span>
              <div className="flex items-center gap-4 flex-1">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="flex-1 accent-[#f6b638]"
                />
                <span className="text-sm text-gray-600 whitespace-nowrap">
                  0 - {priceRange[1]} MAD
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Filters Sheet */}
      <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
        <SheetContent side="left" className="w-[300px] bg-white">
          <SheetHeader>
            <SheetTitle>{t('products.filter')}</SheetTitle>
          </SheetHeader>
          <div className="py-6 space-y-6">
            {/* Category */}
            <div>
              <label className="block font-semibold mb-3">{t('products.categories')}</label>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-4 py-2 rounded-xl transition-colors ${
                    selectedCategory === 'all' ? 'bg-[#f6b638]' : 'hover:bg-gray-100'
                  }`}
                >
                  {t('products.categories')}
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-4 py-2 rounded-xl transition-colors ${
                      selectedCategory === cat.id ? 'bg-[#f6b638]' : 'hover:bg-gray-100'
                    }`}
                  >
                    {t(`categories.${cat.id}`)}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="block font-semibold mb-3">{t('products.priceRange')}</label>
              <input
                type="range"
                min="0"
                max="1000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full accent-[#f6b638]"
              />
              <p className="text-center mt-2">0 - {priceRange[1]} MAD</p>
            </div>

            {/* Sort */}
            <div>
              <label className="block font-semibold mb-3">{t('products.sortBy')}</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="w-full px-4 py-2 border rounded-xl"
              >
                <option value="newest">{t('products.newest')}</option>
                <option value="price-asc">{t('products.priceAsc')}</option>
                <option value="price-desc">{t('products.priceDesc')}</option>
                <option value="rating">{t('products.rating')}</option>
              </select>
            </div>

            <Button onClick={() => setShowMobileFilters(false)} className="w-full btn-primary">
              {t('common.apply')}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Products Grid */}
      <div className="w-full section-padding py-8">
        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            {t('products.showing')} <span className="font-semibold text-[#211e0f]">{filteredProducts.length}</span> {t('products.of')} {products.length} {t('products.title').toLowerCase()}
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-[#211e0f] mb-2">{t('products.noResults')}</h3>
            <p className="text-gray-500 mb-4">{t('products.clearFilters')}</p>
            <Button onClick={clearFilters} className="btn-primary">
              {t('products.clearFilters')}
            </Button>
          </div>
        ) : (
          <div
            className={`grid gap-4 sm:gap-6 ${
              viewMode === 'grid'
                ? 'grid-cols-2 lg:grid-cols-4'
                : 'grid-cols-1'
            }`}
          >
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`)}
                className={`group cursor-pointer ${
                  viewMode === 'list' ? 'flex gap-4 sm:gap-6 bg-white rounded-2xl p-4 shadow-md' : ''
                }`}
              >
                {/* Image */}
                <div
                  className={`relative overflow-hidden rounded-2xl bg-white shadow-md ${
                    viewMode === 'list' ? 'w-32 sm:w-48 h-32 sm:h-48 flex-shrink-0' : 'aspect-square'
                  }`}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Badges */}
                  <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col gap-1 sm:gap-2">
                    {product.isNew && (
                      <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-[#4ade80] text-white text-xs font-bold rounded-full">
                        {t('products.new')}
                      </span>
                    )}
                    {product.isSale && (
                      <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-[#f87171] text-white text-xs font-bold rounded-full">
                        {t('products.sale')}
                      </span>
                    )}
                  </div>
                  {/* Quick Add */}
                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 w-8 h-8 sm:w-10 sm:h-10 bg-[#f6b638] rounded-full 
                             flex items-center justify-center opacity-0 group-hover:opacity-100 
                             transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                  >
                    <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-[#211e0f]" />
                  </button>
                </div>

                {/* Info */}
                <div className={`${viewMode === 'list' ? 'flex-1 py-1 sm:py-2' : 'mt-3 sm:mt-4'}`}>
                  <p className="text-xs sm:text-sm text-gray-500 capitalize mb-1">{t(`categories.${product.category}`)}</p>
                  <h3 className="font-semibold text-[#211e0f] group-hover:text-[#f58a1f] transition-colors text-sm sm:text-base line-clamp-1">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1 sm:gap-2 mt-1 sm:mt-2">
                    <div className="flex items-center gap-0.5 sm:gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 sm:w-4 sm:h-4 ${
                            i < (product.rating || 5)
                              ? 'text-[#f6b638] fill-[#f6b638]'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs sm:text-sm text-gray-500">({product.rating || 5})</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 sm:mt-2">
                    <span className="text-base sm:text-xl font-bold text-[#f58a1f]">{product.price} MAD</span>
                    {product.originalPrice && (
                      <span className="text-xs sm:text-sm text-gray-400 line-through">
                        {product.originalPrice} MAD
                      </span>
                    )}
                  </div>
                  {viewMode === 'list' && product.description && (
                    <p className="text-gray-600 mt-2 line-clamp-2 text-sm hidden sm:block">{product.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProducts;
