'use client';

import { memo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HiOutlineHeart, HiHeart, HiOutlineShoppingCart, HiStar, HiOutlineTag, HiOutlineTruck, HiOutlineBadgeCheck } from 'react-icons/hi';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';

// Pastel background colors for products - iOS Style
const pastelColors = [
  'bg-pink-50',
  'bg-blue-50', 
  'bg-green-50',
  'bg-amber-50',
  'bg-purple-50',
  'bg-orange-50',
  'bg-cyan-50',
  'bg-rose-50',
];

// Lastik kategorileri
const lastikCategories = ['kis-lastikleri', 'yaz-lastikleri', 'dört-mevsim-lastikler', 'motorsiklet-lastikleri', 'agir-vasita-lastikleri', 'earac-lastikleri'];

const campaignSlides = [
  {
    text: '4 AL 3 ÖDE',
    icon: HiOutlineTag,
    bg: 'bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900',
  },
  {
    text: 'Yarın Kapında',
    icon: HiOutlineTruck,
    bg: 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600',
  },
  {
    text: 'Kargo Bedava',
    icon: HiOutlineBadgeCheck,
    bg: 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600',
  },
];

function CampaignBadge() {
  return (
    <div style={{ height: 22, overflow: 'hidden', borderRadius: '0 0 12px 12px' }}>
      <div className="campaign-track">
        {[...campaignSlides, campaignSlides[0]].map((slide, i) => {
          const Icon = slide.icon;
          return (
            <div
              key={i}
              className={`${slide.bg} flex items-center justify-center gap-1 relative`}
              style={{ height: 22, minHeight: 22 }}
            >
              <Icon className="w-3 h-3 text-white/90 relative z-10" />
              <span className="text-white text-[10px] font-semibold relative z-10">{slide.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Price formatter - singleton
const priceFormatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const ProductCard = memo(function ProductCard({ product, index = 0 }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const isWishlisted = isInWishlist(product.id);
  
  // Get a consistent pastel color based on product name
  const colorIndex = product.name ? product.name.charCodeAt(0) % pastelColors.length : index % pastelColors.length;
  const bgColor = pastelColors[colorIndex];

  const handleAddToCart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  }, [addToCart, product]);

  const handleToggleWishlist = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  }, [toggleWishlist, product]);

  const isLastik = lastikCategories.includes(product.category);
  
  return (
    <div className="group relative">
      <Link href={`/urun/${product.id}`} className="block touch-manipulation">
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100">
          {/* Image Container with Pastel Background */}
          <div className={`relative aspect-square ${bgColor}`}>
            <Image
              src={product.images?.[0] || '/placeholder.png'}
              alt={product.name}
              fill
              className="object-contain"
              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 20vw"
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBEQCEAwEPwAB/AP/Z"
            />
            
            {/* Wishlist Button */}
            <button
              onClick={handleToggleWishlist}
              className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow z-10"
              aria-label={isWishlisted ? "Favorilerden çıkar" : "Favorilere ekle"}
            >
              {isWishlisted ? (
                <HiHeart className="w-4 h-4 text-red-500" />
              ) : (
                <HiOutlineHeart className="w-4 h-4 text-gray-400" />
              )}
            </button>

            {/* Discount Badge */}
            {product.discount && (
              <div className="absolute top-2 left-2 z-10 bg-orange-500 text-white text-[11px] font-bold rounded-lg px-2 py-1 shadow leading-none">
                -%{product.discount}
              </div>
            )}
          </div>

          {/* Lastik Campaign Badge - Jant ve Yağlar hariç */}
          {isLastik && <CampaignBadge />}

          {/* Content */}
          <div className="p-3">
            <h3 className="font-semibold text-sm text-gray-800 line-clamp-1 mb-1">
              {product.name}
            </h3>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-1 mb-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <HiStar
                    key={star}
                    className={`w-3 h-3 ${star <= Math.round(product.rating || 4.5) ? 'text-amber-400' : 'text-gray-200'}`}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-gray-700">{product.rating || 4.5}</span>
              <span className="text-xs text-gray-400">({product.reviews || 0})</span>
            </div>
            
            {/* Price and Cart Button Row */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-bold text-base text-gray-900">
                  {priceFormatter.format(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xs text-gray-400 line-through">
                    {priceFormatter.format(product.originalPrice)}
                  </span>
                )}
              </div>
              
              {/* Small Cart Icon Button */}
              <button 
                onClick={handleAddToCart}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-900 text-white hover:bg-red-500 active:scale-95 transition-all shadow-sm"
                aria-label="Sepete ekle"
              >
                <HiOutlineShoppingCart className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
});

export default ProductCard;
