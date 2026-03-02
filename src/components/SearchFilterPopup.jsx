'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { HiX, HiSearch, HiChevronRight, HiChevronDown } from 'react-icons/hi';
import { useProducts } from '@/context/ProductsContext';

// Known tire brands list
const KNOWN_BRANDS = [
  'Goodyear', 'Michelin', 'Continental', 'Bridgestone', 'Pirelli', 
  'Dunlop', 'Hankook', 'Yokohama', 'Firestone', 'BFGoodrich',
  'Kumho', 'Toyo', 'Falken', 'Nexen', 'Cooper', 'General',
  'Lassa', 'Petlas', 'Kormoran', 'Matador', 'Barum', 'Semperit',
  'Vredestein', 'Nokian', 'GT Radial', 'Maxxis', 'Nankang',
  'Rotalla', 'Windforce', 'Landsail', 'Sailun', 'Westlake',
  'Triangle', 'Goodride', 'Achilles', 'Accelera', 'Federal',
  'Zeetex', 'Roadstone', 'Infinity', 'Imperial', 'Tracmax',
  'Castrol', 'Mobil', 'Shell', 'Total', 'Motul', 'Liqui Moly',
  'Valvoline', 'Elf', 'Petronas', 'Fuchs', 'Mannol', 'Addinol',
  'OZ', 'BBS', 'Enkei', 'Sparco', 'MAK', 'Borbet', 'Rial',
  'AEZ', 'Dotz', 'Dezent', 'Alutec', 'DBV', 'Proline', 'Ronal'
];

export default function SearchFilterPopup({ isOpen, onClose }) {
  const router = useRouter();
  const { products, categories } = useProducts();
  
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedSize, setSelectedSize] = useState(null);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isBrandOpen, setIsBrandOpen] = useState(false);

  // Hide bottom navbar when popup is open
  useEffect(() => {
    const bottomNav = document.querySelector('[data-bottom-nav]');
    if (bottomNav) {
      bottomNav.style.display = isOpen ? 'none' : '';
    }
    return () => {
      if (bottomNav) {
        bottomNav.style.display = '';
      }
    };
  }, [isOpen]);

  // Reset filters when popup closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedCategory('');
      setSelectedBrand('');
      setSelectedSize(null);
      setIsCategoryOpen(false);
      setIsBrandOpen(false);
    }
  }, [isOpen]);

  // Get unique brands for selected category - prioritize specs.Marka
  const availableBrands = useMemo(() => {
    if (!selectedCategory) return [];
    
    const categoryProducts = products.filter(p => p.category === selectedCategory);
    const brands = new Set();
    
    categoryProducts.forEach(product => {
      // Priority 1: Check specs for brand (most reliable)
      if (product.specs?.Marka) {
        brands.add(product.specs.Marka);
        return;
      }
      if (product.specs?.marka) {
        brands.add(product.specs.marka);
        return;
      }
      if (product.brand) {
        brands.add(product.brand);
        return;
      }
      
      // Priority 2: Check against known brands list from product name
      const name = product.name || '';
      for (const brand of KNOWN_BRANDS) {
        if (name.toLowerCase().includes(brand.toLowerCase())) {
          brands.add(brand);
          break;
        }
      }
    });
    
    return Array.from(brands).filter(b => b && b.length > 1).sort();
  }, [selectedCategory, products]);

  // Get unique sizes for selected category and brand - prioritize specs.Ebat
  const availableSizes = useMemo(() => {
    if (!selectedCategory) return [];
    
    let filteredProducts = products.filter(p => p.category === selectedCategory);
    
    // Filter by brand if selected
    if (selectedBrand) {
      filteredProducts = filteredProducts.filter(p => {
        const specsMarka = p.specs?.Marka || p.specs?.marka || '';
        const productBrand = p.brand || '';
        const productName = p.name || '';
        
        return specsMarka.toLowerCase() === selectedBrand.toLowerCase() ||
               productBrand.toLowerCase() === selectedBrand.toLowerCase() ||
               productName.toLowerCase().includes(selectedBrand.toLowerCase());
      });
    }
    
    const sizes = new Set();
    
    filteredProducts.forEach(product => {
      // Priority 1: Check specs for size (most reliable)
      if (product.specs?.Ebat) {
        sizes.add(product.specs.Ebat);
        return;
      }
      if (product.specs?.ebat) {
        sizes.add(product.specs.ebat);
        return;
      }
      if (product.size) {
        sizes.add(product.size);
        return;
      }
      
      // Priority 2: Extract from product name
      const name = product.name || '';
      const sizeMatch = name.match(/\d{3}\/\d{2}\s?R?\d{2}/i);
      if (sizeMatch) sizes.add(sizeMatch[0].replace(/\s/g, ''));
    });
    
    return Array.from(sizes).filter(s => s).sort();
  }, [selectedCategory, selectedBrand, products]);

  // Handle size selection
  const handleSizeSelect = (size) => {
    setSelectedSize(selectedSize === size ? null : size);
  };

  // Handle search
  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (selectedBrand) {
      params.set('marka', selectedBrand);
    }
    if (selectedSize) {
      params.set('ebat', selectedSize);
    }
    
    const queryString = params.toString();
    
    if (selectedCategory) {
      router.push(`/kategori/${selectedCategory}${queryString ? '?' + queryString : ''}`);
    } else {
      router.push('/kategoriler');
    }
    
    onClose();
  };

  // Sort categories by order and remove emojis from names
  const sortedCategories = useMemo(() => {
    return [...categories]
      .sort((a, b) => (a.order || 99) - (b.order || 99))
      .map(cat => ({
        ...cat,
        // Remove emoji at start (first character if it's emoji) and trim
        displayName: cat.name?.replace(/^[\u{1F300}-\u{1F9FF}]|^[\u{2600}-\u{26FF}]|^[\u{2700}-\u{27BF}]|^[🛞❄️☀️🔄🛢️🏍️🚛🚜]/gu, '').trim() || cat.name
      }));
  }, [categories]);

  // Get selected category name
  const selectedCategoryName = useMemo(() => {
    const cat = sortedCategories.find(c => (c.categoryId || c.id) === selectedCategory);
    return cat?.displayName || 'Kategori Seçin';
  }, [selectedCategory, sortedCategories]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Bottom Popup */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl flex flex-col"
            style={{ height: '75vh', maxHeight: '75vh' }}
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-2 pb-1 flex-shrink-0">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* Header - Compact */}
            <div className="flex items-center justify-between px-5 pb-2 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-base font-bold text-gray-900">Lastik Ara</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <HiX className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden flex flex-col">
              <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3">
                
                {/* Category Select */}
                <div className="relative">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Kategori
                  </label>
                  <button
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-left text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all"
                  >
                    <span className={selectedCategory ? 'text-gray-900 font-medium' : 'text-gray-400'}>
                      {selectedCategoryName}
                    </span>
                    <HiChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {isCategoryOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-[9999] mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden"
                      >
                        <div className="max-h-80 overflow-y-auto">
                          <button
                            onClick={() => {
                              setSelectedCategory('');
                              setSelectedBrand('');
                              setSelectedSize(null);
                              setIsCategoryOpen(false);
                            }}
                            className="w-full px-4 py-3 text-left text-sm text-gray-400 hover:bg-zinc-100 transition-colors border-b border-gray-100"
                          >
                            Kategori Seçin
                          </button>
                          {sortedCategories.map((category, index) => (
                            <button
                              key={category.categoryId || category.id}
                              onClick={() => {
                                setSelectedCategory(category.categoryId || category.id);
                                setSelectedBrand('');
                                setSelectedSize(null);
                                setIsCategoryOpen(false);
                              }}
                              className={`w-full px-4 py-3 text-left text-sm hover:bg-zinc-200 transition-colors ${
                                selectedCategory === (category.categoryId || category.id) 
                                  ? 'bg-zinc-900 text-white font-medium' 
                                  : index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                              }`}
                            >
                              {category.displayName}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Brand Select - Shows when category is selected */}
                <AnimatePresence>
                  {selectedCategory && availableBrands.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="relative"
                    >
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                        Marka
                      </label>
                      <button
                        onClick={() => setIsBrandOpen(!isBrandOpen)}
                        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-left text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all"
                      >
                        <span className={selectedBrand ? 'text-gray-900 font-medium' : 'text-gray-400'}>
                          {selectedBrand || 'Marka Seçin'}
                        </span>
                        <HiChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isBrandOpen ? 'rotate-180' : ''}`} />
                      </button>
                      
                      <AnimatePresence>
                        {isBrandOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute z-[9999] mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden"
                          >
                            <div className="max-h-96 overflow-y-auto">
                              <button
                                onClick={() => {
                                  setSelectedBrand('');
                                  setSelectedSize(null);
                                  setIsBrandOpen(false);
                                }}
                                className="w-full px-4 py-3 text-left text-sm text-gray-400 hover:bg-zinc-100 transition-colors border-b border-gray-100"
                              >
                                Marka Seçin
                              </button>
                              {availableBrands.map((brand, index) => (
                                <button
                                  key={brand}
                                  onClick={() => {
                                    setSelectedBrand(brand);
                                    setSelectedSize(null);
                                    setIsBrandOpen(false);
                                  }}
                                  className={`w-full px-4 py-3 text-left text-sm hover:bg-zinc-200 transition-colors ${
                                    selectedBrand === brand 
                                      ? 'bg-zinc-900 text-white font-medium' 
                                      : index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                  }`}
                                >
                                  {brand}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Sizes - Chips style */}
                <AnimatePresence>
                  {selectedCategory && availableSizes.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                        Ebat
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {availableSizes.slice(0, 20).map((size) => (
                          <button
                            key={size}
                            onClick={() => handleSizeSelect(size)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                              selectedSize === size
                                ? 'bg-zinc-900 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Selected Filters Summary */}
                {(selectedCategory || selectedBrand || selectedSize) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-zinc-50 rounded-xl p-3"
                  >
                    <h3 className="text-xs font-semibold text-gray-500 mb-1.5">Seçili Filtreler</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCategory && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-zinc-900 text-white text-xs font-medium rounded-full">
                          {selectedCategoryName}
                          <button onClick={() => { setSelectedCategory(''); setSelectedBrand(''); setSelectedSize(null); }}>
                            <HiX className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                      {selectedBrand && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-zinc-800 text-white text-xs font-medium rounded-full">
                          {selectedBrand}
                          <button onClick={() => { setSelectedBrand(''); setSelectedSize(null); }}>
                            <HiX className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                      {selectedSize && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-zinc-700 text-white text-xs font-medium rounded-full">
                          {selectedSize}
                          <button onClick={() => setSelectedSize(null)}>
                            <HiX className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>

            </div>
            
            {/* Search Button - Absolute bottom */}
            <div className="flex-shrink-0 px-5 pt-3 pb-5 border-t border-gray-100 bg-white safe-area-bottom">
              <button
                onClick={handleSearch}
                className="w-full py-3.5 bg-gradient-to-r from-zinc-900 to-zinc-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:from-zinc-800 hover:to-zinc-600 transition-all shadow-lg active:scale-[0.98]"
              >
                <HiSearch className="w-5 h-5" />
                <span>Ara</span>
                {selectedCategory && (
                  <HiChevronRight className="w-5 h-5" />
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Search Trigger Button Component
export function SearchTriggerButton({ onClick, highlighted = false }) {
  return (
    <button
      id="search-trigger-btn"
      onClick={onClick}
      className={`w-[90%] mx-auto flex items-center justify-between px-4 py-2.5 bg-white border rounded-full shadow-xl transition-all duration-300 group relative overflow-hidden
        ${highlighted
          ? 'border-zinc-800 shadow-zinc-400/60 animate-[searchBounce_0.6s_ease_2]'
          : 'border-gray-100 shadow-gray-300/50 hover:shadow-2xl hover:shadow-gray-400/50 hover:border-gray-200'
        }`}
    >
      {/* shimmer efekti */}
      {highlighted && (
        <span className="absolute inset-0 -translate-x-full animate-[searchShimmer_0.8s_ease_2] bg-gradient-to-r from-transparent via-zinc-100/80 to-transparent pointer-events-none" />
      )}
      <div className="flex items-center gap-3 relative z-10">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${highlighted ? 'bg-gradient-to-br from-zinc-700 to-zinc-900 scale-110' : 'bg-gradient-to-br from-zinc-900 to-zinc-700'}`}>
          <HiSearch className="w-4 h-4 text-white" />
        </div>
        <span className={`text-sm font-medium transition-colors duration-300 ${highlighted ? 'text-zinc-800 font-semibold' : 'text-gray-500'}`}>
          Tüm Lastikleri Filtreleyerek Ara
        </span>
      </div>
      <HiChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors relative z-10" />
    </button>
  );
}
