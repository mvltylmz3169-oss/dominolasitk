'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  HiOutlineChevronLeft,
  HiOutlineSparkles,
  HiOutlineHeart,
  HiOutlineShieldCheck,
  HiOutlineAdjustments
} from 'react-icons/hi';
import { GiFullMotorcycleHelmet } from 'react-icons/gi';
import ProductCard from '@/components/ProductCard';
import BottomNavbar from '@/components/BottomNavbar';
import { useProducts } from '@/context/ProductsContext';

// Koleksiyon konfigürasyonları
const collectionConfig = {
  'super-indirimler': {
    title: 'Ayın Süper İndirimleri',
    subtitle: 'Sizin için özel seçimler',
    icon: HiOutlineSparkles,
    gradient: 'from-purple-500 to-violet-600',
    bgGradient: 'from-purple-50/50 to-gray-50',
    accentColor: 'purple',
    getProducts: (ctx) => ctx.getSelectedForYouProducts(),
    heroImage: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1200'
  },
  'en-guclukasklar': {
    title: 'Kışın En Güçlü Kaskları',
    subtitle: 'En çok tercih edilen modeller',
    icon: GiFullMotorcycleHelmet,
    gradient: 'from-red-500 to-orange-500',
    bgGradient: 'from-red-50/50 to-gray-50',
    accentColor: 'red',
    getProducts: (ctx) => ctx.getFeaturedProducts(),
    heroImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200'
  },
  'guvenlik-ekipmanlari': {
    title: 'Yolculukta Güvenlik',
    subtitle: 'Koruyucu ekipmanlar',
    icon: HiOutlineShieldCheck,
    gradient: 'from-blue-500 to-indigo-600',
    bgGradient: 'from-blue-50/50 to-gray-50',
    accentColor: 'blue',
    getProducts: (ctx) => ctx.getSchoolShoppingProducts(),
    heroImage: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=1200'
  },
  'motosiklet-kombinleri': {
    title: 'Motosiklet Kombinleri',
    subtitle: 'En çok beğenilen ürünler',
    icon: HiOutlineHeart,
    gradient: 'from-pink-500 to-rose-500',
    bgGradient: 'from-pink-50/50 to-gray-50',
    accentColor: 'pink',
    getProducts: (ctx) => ctx.getMostFavoritedProducts(),
    heroImage: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1200'
  },
  'kis-lastikleri': {
    title: 'Kışın En Güçlü Lastikleri',
    subtitle: 'Kar ve buzda güvenli sürüş',
    icon: HiOutlineSparkles,
    gradient: 'from-red-500 to-orange-500',
    bgGradient: 'from-red-50/50 to-gray-50',
    accentColor: 'red',
    getProducts: (ctx) => ctx.getFeaturedProducts(),
    heroImage: 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=1200'
  },
  'yaglar-jantlar': {
    title: 'Yağlar & Jantlar',
    subtitle: 'Motor yağları ve premium jantlar',
    icon: HiOutlineAdjustments,
    gradient: 'from-amber-500 to-orange-500',
    bgGradient: 'from-amber-50/50 to-gray-50',
    accentColor: 'amber',
    getProducts: (ctx) => ctx.getMostFavoritedProducts(),
    heroImage: 'https://images.unsplash.com/photo-1611821064430-0d40291d0f0b?w=1200'
  }
};

export default function CollectionPage({ params }) {
  const { slug } = use(params);
  const productsContext = useProducts();
  const { isLoading } = productsContext;
  
  const [sortBy, setSortBy] = useState('default');
  const [showFilters, setShowFilters] = useState(false);

  const collection = collectionConfig[slug];

  if (!collection) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-[126px]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Koleksiyon Bulunamadı</h1>
          <p className="text-gray-500 mb-4">Aradığınız koleksiyon mevcut değil.</p>
          <Link href="/" className="px-6 py-3 bg-red-500 text-white rounded-full font-semibold">
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

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

  const products = collection.getProducts(productsContext);

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      default:
        return 0;
    }
  });

  const IconComponent = collection.icon;

  return (
    <div className={`min-h-screen bg-gradient-to-b ${collection.bgGradient} pb-24 pt-[126px]`}>
      {/* Page Header - Ana sayfadaki gibi */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-4"
          >
            <HiOutlineChevronLeft className="w-4 h-4" />
            <span>Ana Sayfaya Dön</span>
          </Link>

          {/* Title Section - Ana sayfadaki header tarzında */}
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${collection.gradient} flex items-center justify-center shadow-lg shadow-${collection.accentColor}-500/30`}>
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{collection.title}</h1>
              <p className="text-sm text-gray-500">{collection.subtitle}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Sort Bar */}
      <div className="sticky top-[46px] z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 hidden sm:inline">Sırala:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-gray-100 rounded-xl text-sm font-medium text-gray-700 border-0 focus:ring-2 focus:ring-red-500 cursor-pointer"
              >
                <option value="default">Önerilen</option>
                <option value="price-asc">Fiyat: Düşükten Yükseğe</option>
                <option value="price-desc">Fiyat: Yüksekten Düşüğe</option>
                <option value="rating">En Yüksek Puan</option>
                <option value="name">İsme Göre (A-Z)</option>
              </select>
            </div>

            {/* Product Count */}
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 bg-${collection.accentColor}-100 text-${collection.accentColor}-600 rounded-full text-sm font-semibold`}>
                {sortedProducts.length} Ürün
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
            {sortedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <ProductCard product={product} index={index} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${collection.gradient} flex items-center justify-center mx-auto mb-4 opacity-50`}>
              <IconComponent className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Ürün Bulunamadı</h3>
            <p className="text-gray-500 mb-6">Bu koleksiyonda henüz ürün bulunmuyor.</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-colors"
            >
              Ana Sayfaya Dön
            </Link>
          </div>
        )}
      </div>

      {/* More Collections Banner */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Diğer Koleksiyonlar</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(collectionConfig)
              .filter(([key]) => key !== slug)
              .map(([key, config]) => {
                const Icon = config.icon;
                return (
                  <Link
                    key={key}
                    href={`/koleksiyon/${key}`}
                    className="group flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">{config.title}</p>
                      <p className="text-xs text-gray-500 truncate">{config.subtitle}</p>
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>
      </div>

      <BottomNavbar />
    </div>
  );
}

