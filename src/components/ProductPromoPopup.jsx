'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX } from 'react-icons/hi';
import { searchProducts } from '@/lib/productService';

// Promo ürün adı - Firebase'den bu isimle aranacak
const PROMO_PRODUCT_NAME = 'Goodyear 205/55 R16 91H Ultragrip 8 Oto Kış Lastiği';

export default function ProductPromoPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // LocalStorage'dan popup'ın daha önce gösterilip gösterilmediğini kontrol et
    const hasSeenPopup = localStorage.getItem('lastikalsanaPromoPopupSeen');
    
    if (!hasSeenPopup) {
      // Firebase'den ürünü ara
      const fetchProduct = async () => {
        try {
          const results = await searchProducts('Goodyear Ultragrip 8');
          if (results && results.length > 0) {
            setProduct(results[0]);
          }
        } catch (error) {
          console.error('Error fetching promo product:', error);
        }
      };
      
      fetchProduct();

      // 6 saniye sonra popup'ı göster
      const timer = setTimeout(() => {
        setIsVisible(true);
        localStorage.setItem('lastikalsanaPromoPopupSeen', 'true');
      }, 6000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Ürün yoksa hiçbir şey gösterme
  if (!product) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-md"
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative w-full max-w-[320px] pointer-events-auto">
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute -top-3 -right-3 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors"
              >
                <HiX className="w-5 h-5 text-gray-600" />
              </button>

              {/* Card - Liquid Glass Design */}
              <div 
                className="relative rounded-3xl overflow-hidden shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 50%, rgba(240,245,255,0.8) 100%)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.5)',
                }}
              >
                {/* Top shine effect */}
                <div 
                  className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
                  style={{
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.6) 0%, transparent 100%)',
                  }}
                />

                {/* Subtle gradient orbs */}
                <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/10 blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-gradient-to-tr from-indigo-400/20 to-cyan-400/10 blur-3xl" />

                {/* Header */}
                <div className="relative pt-4 pb-2 px-4 text-center">
                  <span className="inline-block px-3 py-0.5 bg-gradient-to-r from-slate-900 to-indigo-900 text-white text-[10px] font-bold rounded-full mb-1.5">
                    ÖZEL FIRSAT
                  </span>
                  <h2 className="text-lg font-bold text-gray-900">Lastik Kampanyası</h2>
                </div>

                {/* Product Image */}
                <div className="relative h-32 mx-4 bg-white/50 rounded-xl flex items-center justify-center overflow-hidden border border-white/60 shadow-inner">
                  <div className="relative w-28 h-28">
                    <Image
                      src={product.images?.[0] || '/placeholder.png'}
                      alt={product.name}
                      fill
                      className="object-contain drop-shadow-lg"
                      unoptimized
                    />
                  </div>
                </div>

                {/* Product Info */}
                <div className="relative px-4 py-3 text-center">
                  <h3 className="text-gray-900 font-bold text-xs leading-tight">
                    {product.name}
                  </h3>
                  <p className="text-gray-500 text-[10px] mt-0.5">
                    Kış Lastiği / Üretim Tarihi: 2024
                  </p>

                  {/* Price */}
                  <div className="mt-2 flex items-center justify-center gap-2">
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-gray-400 text-sm line-through">
                        {formatPrice(product.originalPrice)} TL
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-2xl font-black text-gray-900">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-gray-900 font-bold text-sm">TL</span>
                  </div>

                  {/* Discount Badge */}
                  {product.discount && (
                    <div className="mt-1.5">
                      <span className="inline-block px-2.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full shadow-md">
                        %{product.discount} İNDİRİM
                      </span>
                    </div>
                  )}

                  {/* Features */}
                  <div className="flex gap-2 mt-3">
                    <div 
                      className="flex-1 rounded-lg py-1.5 px-2 text-center border border-white/60"
                      style={{ background: 'rgba(255,255,255,0.6)' }}
                    >
                      <p className="text-gray-900 font-bold text-[10px] leading-tight">
                        Ücretsiz Lastik
                      </p>
                      <p className="text-gray-500 text-[9px] leading-tight">
                        Kaskosu
                      </p>
                    </div>
                    <div 
                      className="flex-1 rounded-lg py-1.5 px-2 text-center border border-white/60"
                      style={{ background: 'rgba(255,255,255,0.6)' }}
                    >
                      <p className="text-gray-900 font-bold text-[10px] leading-tight">
                        Maximum'a
                      </p>
                      <p className="text-gray-500 text-[9px] leading-tight">
                        Peşin Fiyatına 4 Taksit
                      </p>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Link
                    href={product?.id ? `/urun/${product.id}` : '/kategori/kis-lastikleri'}
                    onClick={handleClose}
                    className="block mt-3 w-full py-2.5 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 text-white font-bold text-xs rounded-full transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Ürüne Git
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
