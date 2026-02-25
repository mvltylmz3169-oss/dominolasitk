'use client';

import { useState, useEffect, use } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { HiOutlineSearch, HiOutlineX, HiOutlineAdjustments } from 'react-icons/hi';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import { useProducts } from '@/context/ProductsContext';

const sortOptions = [
  { id: 'popular', name: 'En Popüler' },
  { id: 'price-asc', name: 'Fiyat: Düşükten Yükseğe' },
  { id: 'price-desc', name: 'Fiyat: Yüksekten Düşüğe' },
  { id: 'rating', name: 'En Yüksek Puan' },
  { id: 'discount', name: 'En Yüksek İndirim' },
];

export default function CategoryPage({ params }) {
  const { slug: rawSlug } = use(params);
  // Decode URL encoded Turkish characters
  const slug = decodeURIComponent(rawSlug);
  const searchParams = useSearchParams();
  const { isLoading, getCategoryById, getProductsByCategory } = useProducts();
  
  // Get URL params for filtering
  const urlMarka = searchParams.get('marka');
  const urlEbat = searchParams.get('ebat');
  
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [visibleCount, setVisibleCount] = useState(20);
  const [selectedBrand, setSelectedBrand] = useState(urlMarka || '');
  const [selectedSize, setSelectedSize] = useState(urlEbat || '');

  // Update filters when URL params change
  useEffect(() => {
    setSelectedBrand(urlMarka || '');
    setSelectedSize(urlEbat || '');
  }, [urlMarka, urlEbat]);

  useEffect(() => {
    if (!isLoading) {
      const foundCategory = getCategoryById(slug);
      if (foundCategory) {
        setCategory(foundCategory);
        const categoryProducts = getProductsByCategory(slug);
        setProducts(categoryProducts);
        setFilteredProducts(categoryProducts);
        setVisibleCount(20);
      }
    }
  }, [slug, isLoading, getCategoryById, getProductsByCategory]);

  useEffect(() => {
    let filtered = [...products];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by brand (from URL or selected)
    if (selectedBrand) {
      filtered = filtered.filter(product => {
        const specsMarka = product.specs?.Marka || product.specs?.marka || '';
        const productBrand = product.brand || '';
        const productName = product.name || '';
        
        return specsMarka.toLowerCase() === selectedBrand.toLowerCase() ||
               productBrand.toLowerCase() === selectedBrand.toLowerCase() ||
               productName.toLowerCase().includes(selectedBrand.toLowerCase());
      });
    }

    // Filter by size (from URL or selected)
    if (selectedSize) {
      filtered = filtered.filter(product => {
        const specsEbat = product.specs?.Ebat || product.specs?.ebat || '';
        const productSize = product.size || '';
        const productName = product.name || '';
        
        return specsEbat.toLowerCase().includes(selectedSize.toLowerCase()) ||
               productSize.toLowerCase().includes(selectedSize.toLowerCase()) ||
               productName.toLowerCase().includes(selectedSize.toLowerCase());
      });
    }

    // Filter by price range
    filtered = filtered.filter(product =>
      product.price >= priceRange.min && product.price <= priceRange.max
    );

    // Sort
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'discount':
        filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
      default:
        filtered.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
    }

    setFilteredProducts(filtered);
    setVisibleCount(20);
  }, [products, searchQuery, sortBy, priceRange, selectedBrand, selectedSize]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-[126px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-[126px]">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Kategori bulunamadı</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-[126px]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
            <p className="text-sm text-gray-500">{filteredProducts.length} ürün</p>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Bu kategoride ara..."
              className="w-full h-12 pl-12 pr-4 bg-gray-100 border-0 rounded-xl text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                <HiOutlineX className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>

          {/* Active Filters */}
          {(selectedBrand || selectedSize) && (
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-xs text-gray-500 py-1">Filtreler:</span>
              {selectedBrand && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-zinc-900 text-white text-xs font-medium rounded-full">
                  {selectedBrand}
                  <button onClick={() => setSelectedBrand('')}>
                    <HiOutlineX className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedSize && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-zinc-700 text-white text-xs font-medium rounded-full">
                  {selectedSize}
                  <button onClick={() => setSelectedSize('')}>
                    <HiOutlineX className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button 
                onClick={() => { setSelectedBrand(''); setSelectedSize(''); }}
                className="text-xs text-red-500 font-medium py-1"
              >
                Temizle
              </button>
            </div>
          )}

          {/* Sort & Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl text-sm font-medium text-gray-700"
            >
              <HiOutlineAdjustments className="w-4 h-4" />
              Filtrele
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 px-4 py-2 bg-gray-100 rounded-xl text-sm text-gray-700 outline-none appearance-none cursor-pointer"
            >
              {sortOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {filteredProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.slice(0, visibleCount).map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
            
            {/* Daha Fazla Yükle Butonu */}
            {visibleCount < filteredProducts.length && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setVisibleCount(prev => prev + 20)}
                  className="px-8 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-red-500 transition-colors"
                >
                  Daha Fazla Göster ({filteredProducts.length - visibleCount} ürün kaldı)
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Bu kriterlere uygun ürün bulunamadı.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setPriceRange({ min: 0, max: 100000 });
              }}
              className="text-red-500 font-medium"
            >
              Filtreleri temizle
            </button>
          </div>
        )}
      </div>

      {/* Filter Modal */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-white"
        >
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Filtreler</h2>
              <button onClick={() => setShowFilters(false)}>
                <HiOutlineX className="w-6 h-6 text-gray-700" />
              </button>
            </div>

            <div className="flex-1 p-4 space-y-6 overflow-y-auto">
              {/* Price Range */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Fiyat Aralığı</h3>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 mb-1 block">Min</label>
                    <input
                      type="number"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                      className="w-full px-3 py-2 bg-gray-100 rounded-lg text-gray-900 outline-none"
                      placeholder="0"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 mb-1 block">Max</label>
                    <input
                      type="number"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                      className="w-full px-3 py-2 bg-gray-100 rounded-lg text-gray-900 outline-none"
                      placeholder="100000"
                    />
                  </div>
                </div>
              </div>

              {/* Quick Filters */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Hızlı Filtreler</h3>
                <div className="space-y-2">
                  {[
                    { label: '10.000 TL altı', min: 0, max: 10000 },
                    { label: '10.000 - 25.000 TL', min: 10000, max: 25000 },
                    { label: '25.000 - 50.000 TL', min: 25000, max: 50000 },
                    { label: '50.000 TL üstü', min: 50000, max: 100000 },
                  ].map((filter) => (
                    <button
                      key={filter.label}
                      onClick={() => setPriceRange({ min: filter.min, max: filter.max })}
                      className="w-full p-3 text-left bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 transition-colors text-gray-700"
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100">
              <button
                onClick={() => setShowFilters(false)}
                className="w-full h-12 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors"
              >
                Uygula ({filteredProducts.length} ürün)
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <Footer />
    </div>
  );
}
