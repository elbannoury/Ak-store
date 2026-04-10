import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  Grid3X3, 
  List,
  ChevronDown,
  X
} from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { categories } from '@/data';
import { useCartStore } from '@/store/cartStore';
import { useProducts } from '@/hooks/useProducts';
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
  const { products, isLoading } = useProducts();

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || 'all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'newest' | 'rating'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase();
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
  }, [products, debouncedSearchQuery, selectedCategory, priceRange, sortBy]);

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image || (product.images && product.images[0]) || '',
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
    <MainLayout showCartDrawer={false}>
    <div className="min-h-screen bg-[#fff9ed] pt-24">
      {/* Header */}
      <div className="sticky top-24 z-40 bg-white/90 backdrop-blur-lg shadow-sm">
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
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full section-padding py-8">
        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-[#f6b638] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Results Info */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-gray-600">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-[#f6b638] hover:text-[#f58a1f] text-sm mt-2"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>

            {/* Products Grid/List */}
            {filteredProducts.length > 0 ? (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6" 
                : "flex flex-col gap-4"
              }>
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => navigate(`/product/${product.id}`)}
                    className={`bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-md 
                               hover:shadow-xl transition-all duration-300 cursor-pointer group ${
                                 viewMode === 'list' ? 'flex flex-row h-40 sm:h-48' : ''
                               }`}
                  >
                    {/* Image */}
                    <div className={`relative overflow-hidden bg-white ${
                      viewMode === 'list' ? 'w-40 sm:w-48 h-full' : 'h-48 sm:h-64'
                    }`}>
                      <img
                        src={product.image || (product.images && product.images[0])}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 
                                 group-hover:scale-110"
                      />
                      {product.isNew && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#4ade80] text-white text-[10px] sm:text-xs font-bold rounded-full">
                          NEW
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className={`p-3 sm:p-5 flex flex-col justify-between flex-1`}>
                      <div>
                        <div className="flex justify-between items-start mb-1 sm:mb-2">
                          <h3 className="font-bold text-[#211e0f] text-sm sm:text-lg group-hover:text-[#f58a1f] transition-colors line-clamp-1">
                            {product.name}
                          </h3>
                        </div>
                        <p className="text-gray-500 text-xs sm:text-sm line-clamp-2 mb-2">
                          {product.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <span className="text-sm sm:text-xl font-bold text-[#f58a1f]">
                            {product.price} MAD
                          </span>
                        </div>
                        <button
                          onClick={(e) => handleAddToCart(product, e)}
                          className="p-2 sm:p-3 bg-[#f6b638] rounded-xl hover:bg-[#f58a1f] transition-colors"
                        >
                          <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-[#211e0f]" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-[#211e0f] mb-2">No products found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters or search query</p>
                <Button onClick={clearFilters} variant="outline" className="border-[#f6b638] text-[#211e0f]">
                  Clear all filters
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Mobile Filters Sheet */}
      <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
        <SheetContent side="left" className="w-full max-w-xs bg-[#fff9ed]">
          <SheetHeader>
            <SheetTitle style={{ fontFamily: 'Rowdies, cursive' }}>Filters</SheetTitle>
          </SheetHeader>
          <div className="py-6 space-y-8">
            {/* Category */}
            <div>
              <h4 className="font-bold text-[#211e0f] mb-4">Category</h4>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-[#f6b638] border-[#f6b638] text-[#211e0f]'
                      : 'bg-white border-gray-200 text-gray-600'
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-[#f6b638] border-[#f6b638] text-[#211e0f]'
                        : 'bg-white border-gray-200 text-gray-600'
                    }`}
                  >
                    {t(`categories.${cat.id}`)}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <h4 className="font-bold text-[#211e0f] mb-4">Price Range</h4>
              <div className="space-y-4">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="50"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#f6b638]"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>0 MAD</span>
                  <span>Up to {priceRange[1]} MAD</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 space-y-3">
              <Button onClick={() => setShowMobileFilters(false)} className="w-full btn-primary">
                Apply Filters
              </Button>
              <Button onClick={clearFilters} variant="outline" className="w-full border-gray-200">
                Reset All
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
    </MainLayout>
  );
};

export default AllProducts;
