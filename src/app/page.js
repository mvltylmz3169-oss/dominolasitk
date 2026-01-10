'use client';

import { useState, useMemo, lazy, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/free-mode';
import { 
  HiOutlineChevronRight, 
  HiOutlineTruck, 
  HiOutlineShieldCheck, 
  HiOutlineCreditCard, 
  HiOutlineSupport, 
  HiOutlineHeart, 
  HiOutlineSparkles,
  HiStar
} from 'react-icons/hi';
import { GiCarWheel } from 'react-icons/gi';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import SearchFilterPopup, { SearchTriggerButton } from '@/components/SearchFilterPopup';
import { useProducts } from '@/context/ProductsContext';

// Hero slides data

// Lastik temalı hero slides with responsive image URLs
const heroSlides = [
  {
    title: 'Kış Lastikleri',
    subtitle: 'Karlı ve buzlu yollarda maksimum güvenlik',
    discount: '❄️ Kış Kampanyası',
    imageMobile: 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=640&q=60&auto=format&fit=crop',
    imageTablet: 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=1024&q=70&auto=format&fit=crop',
    imageDesktop: 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=1280&q=75&auto=format&fit=crop',
    image: 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=1280&q=75&auto=format&fit=crop',
    link: '/kategori/kis-lastikleri',
    gradient: 'from-blue-900/95 via-slate-900/85 to-transparent'
  },
  {
    title: '4 AL 3 ÖDE',
    subtitle: 'Tüm Lastiklerde Geçerli',
    discount: '',
    isCampaign: true,
    imageMobile: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=640&q=60&auto=format&fit=crop',
    imageTablet: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1024&q=70&auto=format&fit=crop',
    imageDesktop: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1280&q=75&auto=format&fit=crop',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1280&q=75&auto=format&fit=crop',
    link: '/kategoriler',
    gradient: 'from-black/95 via-zinc-900/90 to-zinc-800/70'
  },
  {
    title: 'Jantlar & Yağlar',
    subtitle: 'Premium jantlar ve motor yağları',
    discount: '🛞 Yeni Sezon',
    imageMobile: 'https://images.unsplash.com/photo-1611821064430-0d40291d0f0b?w=640&q=60&auto=format&fit=crop',
    imageTablet: 'https://images.unsplash.com/photo-1611821064430-0d40291d0f0b?w=1024&q=70&auto=format&fit=crop',
    imageDesktop: 'https://images.unsplash.com/photo-1611821064430-0d40291d0f0b?w=1280&q=75&auto=format&fit=crop',
    image: 'https://images.unsplash.com/photo-1611821064430-0d40291d0f0b?w=1280&q=75&auto=format&fit=crop',
    link: '/kategori/jant',
    gradient: 'from-zinc-900/95 via-neutral-800/85 to-transparent'
  }
];

const features = [
  { icon: HiOutlineTruck, title: 'Ücretsiz Kargo', description: '2.000 TL üzeri' },
  { icon: HiOutlineShieldCheck, title: 'Güvenli Ödeme', description: '256-bit SSL' },
  { icon: HiOutlineCreditCard, title: 'Taksit İmkanı', description: '12 aya varan' },
  { icon: HiOutlineSupport, title: '7/24 Destek', description: 'Her zaman yanınızda' },
];

// Müşteri yorumları - 8 adet
const customerReviews = [
  {
    id: 1,
    name: 'Fatih B.',
    rating: 5,
    comment: 'Üretim 2025 ebatları istediğim gibi 2 gün için de geliyor teşekkürler',
    product: 'Bridgestone Kış Lastiği'
  },
  {
    id: 2,
    name: 'Mehmet K.',
    rating: 5,
    comment: '4 yıllık lastikten sonra bu lastiklere geçiş yaptım. Yumuşak ve sessiz.',
    product: 'Continental Yaz Lastiği'
  },
  {
    id: 3,
    name: 'Okan K.',
    rating: 5,
    comment: 'Fiyat performans ürünler, çok memnun kaldım tavsiye ederim herkese',
    product: 'Michelin Lastik'
  },
  {
    id: 4,
    name: 'Ayşe Y.',
    rating: 5,
    comment: 'Hızlı kargo, ürün tam açıklandığı gibi geldi. 2025 üretim tarihli',
    product: 'Goodyear Lastik'
  },
  {
    id: 5,
    name: 'Emre S.',
    rating: 5,
    comment: 'Araçta denedim süper sonuç aldım yolda tutunması mükemmel',
    product: 'Pirelli Lastik'
  },
  {
    id: 6,
    name: 'Murat T.',
    rating: 5,
    comment: 'Motor yağı harika, motor çok sessiz çalışıyor artık',
    product: 'Castrol Motor Yağı'
  },
  {
    id: 7,
    name: 'Zeynep A.',
    rating: 5,
    comment: 'Jantlar çok kaliteli ve şık görünüyor. Araç bambaşka oldu',
    product: 'OZ Racing Jant'
  },
  {
    id: 8,
    name: 'Burak D.',
    rating: 5,
    comment: '4 mevsim lastik aldım harika performans, her yolda güvenli',
    product: 'Dört Mevsim Lastik'
  }
];

export default function HomePage() {
  const [isSearchPopupOpen, setIsSearchPopupOpen] = useState(false);
  
  const { 
    products, 
    categories, 
    isLoading, 
    getFeaturedProducts, 
    getSchoolShoppingProducts,
    getMostFavoritedProducts,
    getSelectedForYouProducts,
    getDiscountedProducts 
  } = useProducts();
  
  // Memoize product lists to prevent recalculation on every render
  const featuredProducts = useMemo(() => getFeaturedProducts(), [products]);
  const schoolShoppingProducts = useMemo(() => getSchoolShoppingProducts(), [products]);
  const mostFavoritedProducts = useMemo(() => getMostFavoritedProducts(), [products]);
  const selectedForYouProducts = useMemo(() => getSelectedForYouProducts(), [products]);
  const discountedProducts = useMemo(() => getDiscountedProducts(), [products]);

  // Product section skeleton loader component
  const ProductSectionSkeleton = () => (
    <div className="flex gap-4 overflow-hidden">
      {[1, 2, 3].map((i) => (
        <div key={i} className="w-[45%] flex-shrink-0 animate-pulse">
          <div className="bg-gray-200 rounded-2xl h-48 mb-3" />
          <div className="bg-gray-200 rounded h-4 w-3/4 mb-2" />
          <div className="bg-gray-200 rounded h-4 w-1/2" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen pt-[6vh]">
      {/* Hero Slider - 4 AL 3 ÖDE Kampanya - Anında Yüklenir */}
      <section className="relative overflow-hidden">
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          loop={true}
          initialSlide={1}
          className="w-full aspect-[16/9] md:aspect-[21/8]"
          watchSlidesProgress={true}
        >
          {heroSlides.map((slide, index) => (
            <SwiperSlide key={index}>
              {({ isActive }) => (
                <div className="relative w-full h-full">
                  {/* Instant solid background - shows immediately */}
                  <div 
                    className="absolute inset-0"
                    style={{ 
                      background: slide.isCampaign 
                        ? 'linear-gradient(135deg, #18181b 0%, #27272a 50%, #3f3f46 100%)' 
                        : 'linear-gradient(135deg, #1e3a5f 0%, #1e293b 50%, #0f172a 100%)'
                    }}
                  />
                  
                  {/* Background image - loads async, fades in */}
                  <div 
                    className="absolute inset-0 transition-opacity duration-700"
                    style={{
                      backgroundImage: `url(${slide.imageDesktop})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  
                  {/* Dark gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} z-10`} />
                  
                  <div className="absolute inset-0 flex items-center z-20">
                    <div className="max-w-7xl mx-auto px-4 w-full">
                      {slide.isCampaign ? (
                        /* Kampanya Slaytı - Hemen Görünür */
                        <div className={`text-center md:text-left transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                          {/* Ana başlık */}
                          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-1 md:mb-2 tracking-tight">
                            <span className="bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
                              4 AL 3 ÖDE
                            </span>
                          </h1>
                          
                          {/* Alt başlık */}
                          <p className="text-base md:text-xl text-white/80 font-medium mb-3 md:mb-4">
                            {slide.subtitle}
                          </p>
                          
                          {/* Avantajlar - Tek satır */}
                          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-3 md:mb-5">
                            <span className="px-2 py-1 bg-white/10 text-white/90 text-xs font-medium rounded-full">
                              ✓ Tüm Markalar
                            </span>
                            <span className="px-2 py-1 bg-white/10 text-white/90 text-xs font-medium rounded-full">
                              ✓ Ücretsiz Kargo
                            </span>
                            <span className="px-2 py-1 bg-white/10 text-white/90 text-xs font-medium rounded-full">
                              ✓ 12 Taksit
                            </span>
                          </div>
                          
                          {/* CTA Buton */}
                          <Link
                            href={slide.link}
                            className="inline-flex items-center gap-2 px-5 py-2 md:px-6 md:py-2.5 bg-white text-zinc-900 text-sm md:text-base font-bold rounded-full hover:bg-zinc-100 transition-all shadow-xl"
                          >
                            Kampanyayı İncele
                            <HiOutlineChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                          </Link>
                        </div>
                      ) : (
                        /* Normal Slayt */
                        <div className={`max-w-lg transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                        
                          {/* İndirim etiketi */}
                          {slide.discount && (
                            <span className="inline-block px-2.5 py-1 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-xs font-semibold text-white mb-2">
                              {slide.discount}
                            </span>
                          )}
                          
                          <h1 className="text-3xl md:text-5xl font-bold text-white mb-1.5 drop-shadow-lg">
                            {slide.title}
                          </h1>
                          <p className="text-base md:text-lg text-white/90 mb-3 drop-shadow">
                            {slide.subtitle}
                          </p>
                          <Link
                            href={slide.link}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-gray-900 text-sm font-bold rounded-full hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:scale-105 transform"
                          >
                            Keşfet
                            <HiOutlineChevronRight className="w-4 h-4" />
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Search Filter Button */}
      <section className="py-5 flex justify-center">
        <SearchTriggerButton onClick={() => setIsSearchPopupOpen(true)} />
      </section>

      {/* Search Filter Popup */}
      <SearchFilterPopup 
        isOpen={isSearchPopupOpen} 
        onClose={() => setIsSearchPopupOpen(false)} 
      />

       {/* Selected For You - Haftanın Öne Çıkan Ürünleri */}
       {(isLoading || selectedForYouProducts.length > 0) && (
        <section className="py-8 bg-gradient-to-b from-pink-50/50 to-gray-50">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 px-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <HiOutlineSparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Ayın Süper İndirimleri</h2>
                  <p className="text-sm text-gray-500">Sizin için özel seçimler</p>
                </div>
              </div>
              <Link 
                href="/kategoriler" 
                className="hidden sm:flex items-center gap-1 px-4 py-2 bg-purple-50 text-purple-600 rounded-full text-sm font-medium hover:bg-purple-100 transition-colors"
              >
                Tümünü Gör <HiOutlineChevronRight className="w-4 h-4" />
              </Link>
            </div>
            
            {/* Swiper Carousel or Skeleton */}
            <div className="relative group px-4">
              {isLoading ? (
                <ProductSectionSkeleton />
              ) : (
              <Swiper
                modules={[FreeMode]}
                spaceBetween={16}
                slidesPerView={2.2}
                freeMode={true}
                grabCursor={true}
                watchSlidesProgress={false}
                breakpoints={{
                  480: { slidesPerView: 2.5, spaceBetween: 16 },
                  640: { slidesPerView: 3.2, spaceBetween: 16 },
                  768: { slidesPerView: 3.5, spaceBetween: 20 },
                  1024: { slidesPerView: 4.5, spaceBetween: 20 },
                  1280: { slidesPerView: 5.2, spaceBetween: 24 },
                }}
              >
                {selectedForYouProducts.map((product, index) => (
                  <SwiperSlide key={product.id}>
                    <ProductCard product={product} index={index} />
                  </SwiperSlide>
                ))}
              </Swiper>
              )}
              
              {/* Gradient Fade Effects */}
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-pink-50/50 to-transparent z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />
            </div>

            {/* Tümünü Gör Butonu */}
            <div className="flex justify-start mt-5 px-4">
              <Link
                href="/koleksiyon/super-indirimler"
                className="group relative inline-flex items-center gap-1.5 px-5 py-2 bg-gradient-to-r from-purple-500 to-violet-600 text-white text-sm font-semibold rounded-full shadow-md shadow-purple-500/25 hover:shadow-lg hover:shadow-purple-500/35 transition-all hover:scale-105 overflow-hidden"
              >
                <span className="relative z-10">Tümünü Gör</span>
                <HiOutlineChevronRight className="w-4 h-4 relative z-10 group-hover:translate-x-0.5 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Products - Kışın En Güçlü Lastikleri */}
      {(isLoading || featuredProducts.length > 0) && (
        <section className="py-8 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 px-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/30">
                  <GiCarWheel className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Kışın En Güçlü Lastikleri</h2>
                  <p className="text-sm text-gray-500">Kar ve buzda güvenli sürüş</p>
                </div>
              </div>
              <Link 
                href="/firsatlar" 
                className="hidden sm:flex items-center gap-1 px-4 py-2 bg-red-50 text-red-600 rounded-full text-sm font-medium hover:bg-red-100 transition-colors"
              >
                Tümünü Gör <HiOutlineChevronRight className="w-4 h-4" />
              </Link>
            </div>
            
            {/* Swiper Carousel or Skeleton */}
            <div className="relative group px-4">
              {isLoading ? (
                <ProductSectionSkeleton />
              ) : (
              <Swiper
                modules={[FreeMode]}
                spaceBetween={16}
                slidesPerView={2.2}
                freeMode={true}
                grabCursor={true}
                watchSlidesProgress={false}
                breakpoints={{
                  480: { slidesPerView: 2.5, spaceBetween: 16 },
                  640: { slidesPerView: 3.2, spaceBetween: 16 },
                  768: { slidesPerView: 3.5, spaceBetween: 20 },
                  1024: { slidesPerView: 4.5, spaceBetween: 20 },
                  1280: { slidesPerView: 5.2, spaceBetween: 24 },
                }}
              >
                {featuredProducts.map((product, index) => (
                  <SwiperSlide key={product.id}>
                    <ProductCard product={product} index={index} />
                  </SwiperSlide>
                ))}
              </Swiper>
              )}
            </div>

            {/* Tümünü Gör Butonu */}
            <div className="flex justify-start mt-5 px-4">
              <Link
                href="/koleksiyon/kis-lastikleri"
                className="group relative inline-flex items-center gap-1.5 px-5 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-semibold rounded-full shadow-md shadow-red-500/25 hover:shadow-lg hover:shadow-red-500/35 transition-all hover:scale-105 overflow-hidden"
              >
                <span className="relative z-10">Tümünü Gör</span>
                <HiOutlineChevronRight className="w-4 h-4 relative z-10 group-hover:translate-x-0.5 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Customer Reviews - Animated Horizontal Scroll */}
      <section className="py-6 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md shadow-orange-500/20">
              <HiStar className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Müşterilerimiz Ne Diyor?</h2>
              <p className="text-xs text-gray-500">Gerçek kullanıcı deneyimleri</p>
            </div>
          </div>
        </div>

        {/* Animated Reviews Marquee */}
        <div className="relative">
          {/* Gradient overlays for smooth fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          
          {/* Scrolling container - inline style for reliable animation */}
          <div 
            className="flex"
            style={{
              animation: 'scroll 38s linear infinite',
              width: 'fit-content'
            }}
          >
            {/* First set of 8 reviews */}
            {customerReviews.map((review) => (
              <div
                key={review.id}
                className="flex-shrink-0 w-[260px] mx-2"
              >
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm h-full">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{review.name}</p>
                      <p className="text-xs text-gray-500">{review.product}</p>
                    </div>
                    <div className="flex items-center gap-0.5 px-2 py-0.5 bg-green-50 rounded-full">
                      <HiStar className="w-3 h-3 text-green-500" />
                      <span className="text-xs font-bold text-green-600">{review.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <HiStar
                        key={star}
                        className={`w-3.5 h-3.5 ${star <= review.rating ? 'text-amber-400' : 'text-gray-200'}`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 text-xs leading-relaxed line-clamp-2">"{review.comment}"</p>
                </div>
              </div>
            ))}
            {/* Duplicate for seamless loop */}
            {customerReviews.map((review) => (
              <div
                key={`dup-${review.id}`}
                className="flex-shrink-0 w-[260px] mx-2"
              >
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm h-full">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{review.name}</p>
                      <p className="text-xs text-gray-500">{review.product}</p>
                    </div>
                    <div className="flex items-center gap-0.5 px-2 py-0.5 bg-green-50 rounded-full">
                      <HiStar className="w-3 h-3 text-green-500" />
                      <span className="text-xs font-bold text-green-600">{review.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <HiStar
                        key={star}
                        className={`w-3.5 h-3.5 ${star <= review.rating ? 'text-amber-400' : 'text-gray-200'}`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 text-xs leading-relaxed line-clamp-2">"{review.comment}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global CSS for marquee */}
        <style jsx global>{`
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
        `}</style>
      </section>

      {/* Banner 1 - Kış Lastiği Görseli */}
      <section className="py-4 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="relative h-[160px] md:h-[200px] rounded-2xl overflow-hidden group">
            <Image
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=70"
              alt="Kış Lastikleri"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 1200px"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-slate-800/70 to-transparent flex items-center">
              <div className="px-6 md:px-10">
                <span className="text-red-400 text-xs font-bold uppercase tracking-wider">Yeni Sezon</span>
                <h3 className="text-2xl md:text-3xl font-bold text-white mt-1">Dört Mevsim Lastikler</h3>
                <p className="text-gray-300 text-sm mt-2 max-w-md">Her mevsim güvenli sürüş</p>
                <Link href="/kategori/dört-mevsim-lastikler" className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-white text-gray-900 text-sm font-bold rounded-full hover:bg-gray-100 transition-colors">
                  İncele <HiOutlineChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* School Shopping Products -> Yolculukta Güvenlik */}
      {(isLoading || schoolShoppingProducts.length > 0) && (
        <section className="py-8 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 px-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <HiOutlineShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Yolculukta Güvenlik</h2>
                  <p className="text-sm text-gray-500">Koruyucu ekipmanlar</p>
                </div>
              </div>
              <Link 
                href="/kategoriler" 
                className="hidden sm:flex items-center gap-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors"
              >
                Tümünü Gör <HiOutlineChevronRight className="w-4 h-4" />
              </Link>
            </div>
            
            {/* Swiper Carousel or Skeleton */}
            <div className="relative group px-4">
              {isLoading ? (
                <ProductSectionSkeleton />
              ) : (
              <Swiper
                modules={[FreeMode]}
                spaceBetween={16}
                slidesPerView={2.2}
                freeMode={true}
                grabCursor={true}
                watchSlidesProgress={false}
                breakpoints={{
                  480: { slidesPerView: 2.5, spaceBetween: 16 },
                  640: { slidesPerView: 3.2, spaceBetween: 16 },
                  768: { slidesPerView: 3.5, spaceBetween: 20 },
                  1024: { slidesPerView: 4.5, spaceBetween: 20 },
                  1280: { slidesPerView: 5.2, spaceBetween: 24 },
                }}
              >
                {schoolShoppingProducts.map((product, index) => (
                  <SwiperSlide key={product.id}>
                    <ProductCard product={product} index={index} />
                  </SwiperSlide>
                ))}
              </Swiper>
              )}
            </div>

            {/* Tümünü Gör Butonu */}
            <div className="flex justify-start mt-5 px-4">
              <Link
                href="/koleksiyon/guvenlik-ekipmanlari"
                className="group relative inline-flex items-center gap-1.5 px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold rounded-full shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35 transition-all hover:scale-105 overflow-hidden"
              >
                <span className="relative z-10">Tümünü Gör</span>
                <HiOutlineChevronRight className="w-4 h-4 relative z-10 group-hover:translate-x-0.5 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Banner 2 - Yaz Lastik Görseli */}
      <section className="py-4 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="relative h-[160px] md:h-[200px] rounded-2xl overflow-hidden group">
            <Image
              src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&q=70"
              alt="Yaz Lastikleri"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 1200px"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-slate-900/85 via-slate-800/70 to-transparent flex items-center justify-end">
              <div className="px-6 md:px-10 text-right">
                <span className="text-orange-400 text-xs font-bold uppercase tracking-wider">Özel Fırsat</span>
                <h3 className="text-2xl md:text-3xl font-bold text-white mt-1">Yaz Lastikleri</h3>
                <p className="text-gray-300 text-sm mt-2 max-w-md">Yüksek performans, düşük tüketim</p>
                <Link href="/kategori/yaz-lastikleri" className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-white text-gray-900 text-sm font-bold rounded-full hover:bg-gray-100 transition-colors">
                  İncele <HiOutlineChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Most Favorited - Yağlar & Jantlar */}
      {(isLoading || mostFavoritedProducts.length > 0) && (
        <section className="py-8 bg-gradient-to-b from-white to-amber-50/50">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 px-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <HiOutlineHeart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Yağlar & Jantlar</h2>
                  <p className="text-sm text-gray-500">Motor yağları ve premium jantlar</p>
                </div>
              </div>
              <Link 
                href="/favoriler" 
                className="hidden sm:flex items-center gap-1 px-4 py-2 bg-amber-50 text-amber-600 rounded-full text-sm font-medium hover:bg-amber-100 transition-colors"
              >
                Tümünü Gör <HiOutlineChevronRight className="w-4 h-4" />
              </Link>
            </div>
            
            {/* Swiper Carousel or Skeleton */}
            <div className="relative group px-4">
              {isLoading ? (
                <ProductSectionSkeleton />
              ) : (
              <Swiper
                modules={[FreeMode]}
                spaceBetween={16}
                slidesPerView={2.2}
                freeMode={true}
                grabCursor={true}
                watchSlidesProgress={false}
                breakpoints={{
                  480: { slidesPerView: 2.5, spaceBetween: 16 },
                  640: { slidesPerView: 3.2, spaceBetween: 16 },
                  768: { slidesPerView: 3.5, spaceBetween: 20 },
                  1024: { slidesPerView: 4.5, spaceBetween: 20 },
                  1280: { slidesPerView: 5.2, spaceBetween: 24 },
                }}
              >
                {mostFavoritedProducts.map((product, index) => (
                  <SwiperSlide key={product.id}>
                    <ProductCard product={product} index={index} />
                  </SwiperSlide>
                ))}
              </Swiper>
              )}
            </div>

            {/* Tümünü Gör Butonu */}
            <div className="flex justify-start mt-5 px-4">
              <Link
                href="/koleksiyon/yaglar-jantlar"
                className="group relative inline-flex items-center gap-1.5 px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold rounded-full shadow-md shadow-amber-500/25 hover:shadow-lg hover:shadow-amber-500/35 transition-all hover:scale-105 overflow-hidden"
              >
                <span className="relative z-10">Tümünü Gör</span>
                <HiOutlineChevronRight className="w-4 h-4 relative z-10 group-hover:translate-x-0.5 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Big Banner - Lastik */}
      <section className="py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="relative h-[280px] md:h-[350px] rounded-2xl overflow-hidden group">
            <Image
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1000&q=70"
              alt="Lastik Kampanya"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 1200px"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
              <div className="p-6 md:p-10 w-full">
                <span className="text-red-400 text-sm font-bold uppercase tracking-wider">🛞 Kış Kampanyası</span>
                <h3 className="text-3xl md:text-4xl font-bold text-white mt-2">Tüm Lastiklerde %45'e Varan İndirim</h3>
                <p className="text-gray-300 mt-2 max-w-lg">Kış lastikleri, yaz lastikleri, jantlar ve motor yağları için kaçırılmayacak fırsatlar</p>
                <div className="flex gap-3 mt-4">
                  <Link href="/firsatlar" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 font-bold rounded-full hover:bg-gray-100 transition-colors">
                    Fırsatları Gör
                  </Link>
                  <Link href="/kategoriler" className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 text-white font-bold rounded-full hover:bg-white/30 transition-colors backdrop-blur-sm">
                    Kategoriler
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

     
      {/* Categories - Modern Design with Images */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Kategoriler</h2>
            <Link href="/kategoriler" className="text-sm font-medium text-red-500 hover:text-red-600 flex items-center gap-1">
              Tümü <HiOutlineChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          {/* Category Cards with Images */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {categories.slice(0, 8).map((category) => (
              <Link
                key={category.id}
                href={`/kategori/${category.categoryId}`}
                className="group block"
              >
                <div className="relative h-28 md:h-36 rounded-2xl overflow-hidden bg-gray-100">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, 25vw"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="text-white font-semibold text-sm md:text-base">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Banner Grid */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/kategori/motorsiklet-lastikleri" className="group">
              <div className="relative h-48 md:h-56 rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&q=70"
                  alt="Motorsiklet Lastikleri"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center p-6">
                  <div>
                    <span className="inline-block px-3 py-1 bg-red-500 rounded-full text-xs font-semibold text-white mb-2">
                      Yeni Koleksiyon
                    </span>
                    <h3 className="text-2xl font-bold text-white mb-1">Motorsiklet Lastikleri</h3>
                    <p className="text-white/80 text-sm">Yüksek tutuş, güvenli sürüş</p>
                  </div>
                </div>
              </div>
            </Link>
            
            <Link href="/kategori/is-makinesi-lastikleri" className="group">
              <div className="relative h-48 md:h-56 rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=600&q=70"
                  alt="İş Makinesi Lastikleri"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center p-6">
                  <div>
                    <span className="inline-block px-3 py-1 bg-blue-500 rounded-full text-xs font-semibold text-white mb-2">
                      Endüstriyel
                    </span>
                    <h3 className="text-2xl font-bold text-white mb-1">İş Makinesi Lastikleri</h3>
                    <p className="text-white/80 text-sm">Ağır yük, dayanıklı lastikler</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 p-2">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{feature.title}</p>
                  <p className="text-xs text-gray-500">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 px-4 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Neden Bizi Tercih Etmelisiniz?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-4xl font-bold text-red-400 mb-2">50K+</div>
              <div className="text-gray-400">Mutlu Müşteri</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-red-400 mb-2">1000+</div>
              <div className="text-gray-400">Ürün Çeşidi</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-red-400 mb-2">99%</div>
              <div className="text-gray-400">Memnuniyet</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-red-400 mb-2">24/7</div>
              <div className="text-gray-400">Destek</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
