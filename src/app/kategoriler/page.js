'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Footer from '@/components/Footer';
import { useProducts } from '@/context/ProductsContext';
import { useState } from 'react';
import { HiSearch, HiChevronRight } from 'react-icons/hi';
import SearchFilterPopup from '@/components/SearchFilterPopup';

export default function CategoriesPage() {
  const { categories, isLoading } = useProducts();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  const earac = categories.find(c => c.categoryId === 'earac-lastikleri');
  const mainCategories = categories.filter(
    c => c.categoryId !== 'earac-lastikleri' && c.categoryId !== 'agir-vasita-lastikleri'
  );

  return (
    <div className="min-h-screen bg-gray-50">
        <div className="max-w-lg mx-auto px-4 pt-[12vh] pb-6">
        {/* Header */}
        <h1 className="text-xl font-bold text-gray-900 mb-3">Kategoriler</h1>

        {/* Search Button - %10 küçük */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-2 bg-white border border-gray-100 rounded-full shadow-lg shadow-gray-300/40 hover:shadow-xl hover:border-gray-200 transition-all duration-300 group mb-4"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-gradient-to-br from-zinc-900 to-zinc-700 rounded-full flex items-center justify-center">
              <HiSearch className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-gray-500 text-xs font-medium">Tüm Lastikleri Filtreleyerek Ara</span>
          </div>
          <HiChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
        </button>

        <SearchFilterPopup isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

        {/* Categories Grid */}
        <div className="grid grid-cols-2 gap-3">
          {mainCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={`/kategori/${category.categoryId}`} className="block group">
                <div className="relative h-28 rounded-2xl overflow-hidden bg-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="text-white font-semibold text-sm drop-shadow-lg line-clamp-1">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}

          {/* Elektrikli Araç Lastikleri - tam genişlik */}
          <motion.div
            className="col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: mainCategories.length * 0.05 }}
          >
            <Link href="/kategori/earac-lastikleri" className="block group">
              <div className="relative h-28 rounded-2xl overflow-hidden bg-gray-100 shadow-sm hover:shadow-md transition-shadow">
                {earac?.image ? (
                  <Image
                    src={earac.image}
                    alt="Elektrikli Araç Lastikleri"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600" />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
                <div className="absolute inset-0 flex items-center p-4 gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/80 backdrop-blur-sm flex items-center justify-center shrink-0">
                    <span className="text-lg">⚡</span>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm drop-shadow-lg">Elektrikli Araç Lastikleri</h3>
                    <p className="text-white/75 text-xs">Düşük yuvarlanma direnci</p>
                  </div>
                  <div className="ml-auto">
                    <span className="px-2 py-0.5 bg-emerald-500 rounded-full text-white text-[10px] font-semibold">Yeni</span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
