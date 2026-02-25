'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { 
  HiOutlineHeart, 
  HiHeart, 
  HiOutlineShare,
  HiOutlineMinus,
  HiOutlinePlus,
  HiStar,
  HiCheck,
  HiOutlineTruck,
  HiOutlineShieldCheck,
  HiOutlineShoppingBag,
  HiOutlineHome,
  HiShoppingCart,
  HiOutlineChevronDown,
  HiOutlineChevronRight,
  HiOutlineBadgeCheck,
  HiOutlineRefresh,
  HiOutlineClock,
  HiOutlineGift,
  HiOutlineDocumentText
} from 'react-icons/hi';
import { FaShieldAlt } from 'react-icons/fa';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useProducts } from '@/context/ProductsContext';
import ProductCard from '@/components/ProductCard';
import BottomNavbar from '@/components/BottomNavbar';
import CountdownBanner from '@/components/CountdownBanner';
import SocialProof from '@/components/SocialProof';

export default function ProductPage({ params }) {
  const { id } = use(params);
  const { isLoading, getProductById, getProductsByCategory, getCategoryById } = useProducts();
  
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [timeUntilMidnight, setTimeUntilMidnight] = useState({ hours: 0, minutes: 0 });
  const [isCampaignApplied, setIsCampaignApplied] = useState(false);
  const [showCampaignToast, setShowCampaignToast] = useState(false);
  const { addToCart, isInCart, getCartItem } = useCart();
  
  // Lastik kategorileri için 4 al 3 öde kampanyası (jant ve yağlar hariç)
  const campaignCategories = [
    'kis-lastikleri',
    'yaz-lastikleri', 
    'dört-mevsim-lastikler',
    'motorsiklet-lastikleri',
    'agir-vasita-lastikleri',
    'earac-lastikleri'
  ];
  const isLastikCategory = product?.category && campaignCategories.includes(product.category);
  const campaignPrice = isCampaignApplied ? product?.price * 3 : product?.price * quantity;

  // Beden seçimi gerektiren kategoriler
  const sizableCategories = ['kasklar', 'giyim-urunleri', 'eldiven'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL'];
  
  // Bu ürün beden seçimi gerektiriyor mu?
  const requiresSize = product && sizableCategories.includes(product.category);
  const { isInWishlist, toggleWishlist } = useWishlist();

  // Calculate time until midnight
  useEffect(() => {
    const calculateTimeUntilMidnight = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight - now;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeUntilMidnight({ hours, minutes });
    };

    calculateTimeUntilMidnight();
    const timer = setInterval(calculateTimeUntilMidnight, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadProduct = async () => {
      if (!isLoading) {
        const foundProduct = await getProductById(id);
        if (foundProduct) {
          setProduct(foundProduct);
          const related = getProductsByCategory(foundProduct.category)
            .filter(p => p.id !== foundProduct.id)
            .slice(0, 4);
          setRelatedProducts(related);
          
          // Check if already in cart
          if (isInCart(foundProduct.id)) {
            setIsAddedToCart(true);
          }
        }
      }
    };
    loadProduct();
  }, [id, isLoading, getProductById, getProductsByCategory, isInCart]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    if (product) {
      // Beden seçimi gerektiren kategorilerde beden seçilmemiş ise uyarı ver
      if (requiresSize && !selectedSize) {
        alert('Lütfen bir beden seçin');
        return;
      }
      
      // Beden bilgisini ürüne ekle
      const productWithSize = requiresSize 
        ? { ...product, selectedSize } 
        : product;
      
      // Kampanya bilgisini ekle (4 al 3 öde)
      const campaign = isCampaignApplied ? '4al3ode' : null;
      
      addToCart(productWithSize, quantity, campaign);
      setShowSuccessToast(true);
      
      // Hide toast after 10 seconds and show bottom navbar
      setTimeout(() => {
        setShowSuccessToast(false);
        setIsAddedToCart(true);
      }, 10000);
    }
  };

  if (isLoading || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);
  const cartItem = getCartItem(product.id);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Campaign Applied Toast */}
      <AnimatePresence>
        {showCampaignToast && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed top-20 left-4 right-4 z-50"
          >
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-4 shadow-2xl shadow-green-500/30">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎉</span>
                </div>
                <div className="flex-1">
                  <p className="text-white font-bold text-lg">Kampanya Uygulandı!</p>
                  <p className="text-green-100 text-sm">4 AL 3 ÖDE - 1 lastik hediye!</p>
                </div>
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <HiCheck className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Toast Notification */}
      <AnimatePresence>
        {showSuccessToast && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
            />
            
            {/* Toast */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center">
                {/* Animated Check Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring', damping: 10, stiffness: 200 }}
                  className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3, type: 'spring', damping: 10, stiffness: 200 }}
                  >
                    <HiCheck className="w-10 h-10 text-green-500" />
                  </motion.div>
                </motion.div>
                
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl font-bold text-gray-900 mb-2"
                >
                  Sepete Eklendi!
                </motion.h3>
                
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-gray-500 mb-4"
                >
                  {product.name} başarıyla sepetinize eklendi.
                </motion.p>

                {/* Product Preview */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-4"
                >
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-white flex-shrink-0">
                <Image
                  src={product.images?.[0] || '/placeholder.png'}
                  alt={product.name}
                  fill
                  className="object-contain p-1"
                  unoptimized
                />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-gray-900 text-sm line-clamp-1">{product.name}</p>
                    <p className="text-gray-500 text-xs">
                      {quantity} adet{selectedSize && ` • Beden: ${selectedSize}`}
                      {isCampaignApplied && ' • 🔥 4 Al 3 Öde'}
                    </p>
                  </div>
                  <div className="text-right">
                    {isCampaignApplied && (
                      <span className="text-xs text-gray-400 line-through block">{formatPrice(product.price * quantity)}</span>
                    )}
                    <span className="font-bold text-gray-900">{formatPrice(campaignPrice)}</span>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex gap-2"
                >
                  <button
                    onClick={() => {
                      setShowSuccessToast(false);
                      setIsAddedToCart(true);
                    }}
                    className="flex-1 h-12 text-sm rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Alışverişe Devam
                  </button>
                  <Link
                    href="/sepet"
                    className="flex-1 h-12 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <HiShoppingCart className="w-5 h-5" />
                    Sepete Git
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Breadcrumb Navigation */}
      <div className="pt-[60px] bg-white border-b border-gray-100">
        <div className="px-4 py-2">
          <nav className="flex items-center gap-1 text-xs text-gray-500 overflow-x-auto hide-scrollbar">
            <Link href="/" className="flex items-center gap-1 hover:text-gray-900 transition-colors whitespace-nowrap">
              <HiOutlineHome className="w-3 h-3" />
              <span>Anasayfa</span>
            </Link>
            <HiOutlineChevronRight className="w-3 h-3 flex-shrink-0" />
            {product.category && getCategoryById(product.category) && (
              <>
                <Link 
                  href={`/kategori/${product.category}`} 
                  className="hover:text-gray-900 transition-colors whitespace-nowrap"
                >
                  {getCategoryById(product.category)?.name}
                </Link>
                <HiOutlineChevronRight className="w-3 h-3 flex-shrink-0" />
              </>
            )}
            <span className="text-gray-700 font-medium truncate max-w-[150px]">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Countdown Banner */}
      <div className="bg-white">
        <CountdownBanner />
      </div>

      {/* Image Gallery */}
      <div className="bg-white relative">
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          className="w-full aspect-square"
        >
          {product.images?.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-full bg-gray-100 p-8">
                <Image
                  src={image}
                  alt={`${product.name} - ${index + 1}`}
                  fill
                  className="object-contain"
                  priority={index === 0}
                  unoptimized
                  loader={({ src }) => src}
                  onError={(e) => {
                    console.error('Image load error:', image);
                    e.target.src = '/placeholder.png';
                  }}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Floating Actions */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => toggleWishlist(product)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md"
          >
            {isWishlisted ? (
              <HiHeart className="w-5 h-5 text-red-500" />
            ) : (
              <HiOutlineHeart className="w-5 h-5 text-gray-600" />
            )}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md"
          >
            <HiOutlineShare className="w-5 h-5 text-gray-600" />
          </motion.button>
        </div>

        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">
            -{product.discount}%
          </div>
        )}
      </div>


      {/* Product Info */}
      <div className="bg-white mt-2 px-4 py-6">
        {/* Title */}
        <h1 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h1>
        
        {/* Social Proof - Between title and rating */}
        <div className="mb-3">
          <SocialProof />
        </div>
        
        {/* Rating */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1">
            <HiStar className="w-5 h-5 text-yellow-400" />
            <span className="font-semibold text-gray-900">{product.rating || 0}</span>
            <span className="text-gray-500">({product.reviews || 0} değerlendirme)</span>
          </div>
          <span className={`text-sm font-medium ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-orange-500' : 'text-red-500'}`}>
            {product.stock > 10 ? 'Stokta' : product.stock > 0 ? `Son ${product.stock} ürün` : 'Tükendi'}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-lg text-gray-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
          {product.discount && (
            <span className="px-2 py-1 bg-red-100 text-red-600 text-sm font-semibold rounded">
              %{product.discount} İndirim
            </span>
          )}
        </div>
        
        {/* Lowest Price Badge */}
        <div className="flex items-center gap-1.5 mb-4">
          <span className="text-xs text-green-600 font-medium">✓ Son 14 Günün En Düşük Fiyatı!</span>
        </div>

        {/* Size Selector - Sadece beden gerektiren kategoriler için */}
        {requiresSize && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Beden Seçimi</h3>
              {!selectedSize && (
                <span className="text-xs text-red-500 font-medium">* Zorunlu</span>
              )}
            </div>
            <div className="flex gap-2">
              {sizes.map((size) => (
                <motion.button
                  key={size}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedSize(size)}
                  className={`relative flex-1 h-12 rounded-xl font-semibold text-sm transition-all border-2 ${
                    selectedSize === size
                      ? 'bg-gray-900 text-white border-gray-900 shadow-lg'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {size}
                  {selectedSize === size && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
                    >
                      <HiCheck className="w-3 h-3 text-white" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
            {selectedSize && (
              <motion.p 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-gray-500 mt-2"
              >
                Seçilen beden: <span className="font-semibold text-gray-900">{selectedSize}</span>
              </motion.p>
            )}
          </div>
        )}

        {/* In Cart Badge */}
        {isAddedToCart && cartItem && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl mb-4"
          >
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <HiCheck className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-green-800">Bu ürün sepetinizde</p>
              <p className="text-xs text-green-600">{cartItem.quantity} adet eklenmiş</p>
            </div>
            <Link
              href="/sepet"
              className="px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600 transition-colors"
            >
              Sepete Git
            </Link>
          </motion.div>
        )}

        {/* Features */}
        <div className="flex gap-4 mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <HiOutlineTruck className="w-5 h-5 text-green-600" />
            <span>Ücretsiz Kargo</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <HiOutlineShieldCheck className="w-5 h-5 text-blue-600" />
            <span>2 Yıl Garanti</span>
          </div>
        </div>

        {/* Quantity Selector - Only show if not added to cart */}
        {!isAddedToCart && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Adet</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-gray-100 rounded-xl">
                <button
                  onClick={() => {
                    setQuantity(Math.max(1, quantity - 1));
                    if (quantity <= 4) setIsCampaignApplied(false);
                  }}
                  className="w-12 h-12 flex items-center justify-center hover:bg-gray-200 transition-colors rounded-l-xl"
                >
                  <HiOutlineMinus className="w-5 h-5 text-gray-600" />
                </button>
                <span className="w-12 text-center font-semibold text-gray-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                  className="w-12 h-12 flex items-center justify-center hover:bg-gray-200 transition-colors rounded-r-xl"
                >
                  <HiOutlinePlus className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <div className="flex flex-col">
                {isCampaignApplied && (
                  <span className="text-xs text-gray-400 line-through">
                    {formatPrice(product.price * 4)}
                  </span>
                )}
                <span className="text-gray-500 text-sm">
                  Toplam: <span className="font-bold text-gray-900">{formatPrice(campaignPrice)}</span>
                  {isCampaignApplied && <span className="ml-1 text-green-600 text-xs font-medium">1 Adet Bedava!</span>}
                </span>
              </div>
            </div>

            {/* 4 Al 3 Öde Campaign Button - Only for Lastik */}
            {isLastikCategory && !isCampaignApplied && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setQuantity(4);
                  setIsCampaignApplied(true);
                  setShowCampaignToast(true);
                  setTimeout(() => setShowCampaignToast(false), 3000);
                }}
                className="mt-4 w-[90%] flex items-center gap-2.5 px-3 py-2.5 bg-white rounded-full shadow-2xl shadow-gray-400/60 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)] transition-all duration-300"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-zinc-900 to-zinc-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <HiOutlineGift className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-bold text-gray-700">
                  4 AL 3 ÖDE Kampanyasını Uygula
                </span>
              </motion.button>
            )}

            {/* Campaign Applied Badge */}
            {isCampaignApplied && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <HiCheck className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-green-800">Kampanya Uygulandı!</p>
                  <p className="text-sm text-green-600">4 lastik alıyorsunuz, 3 lastik ödüyorsunuz</p>
                </div>
                <button
                  onClick={() => {
                    setIsCampaignApplied(false);
                    setQuantity(1);
                  }}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  İptal
                </button>
              </motion.div>
            )}

            {/* ETBİS Information */}
            <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                  <FaShieldAlt className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900">ETBİS Kayıtlı Site</h3>
                  <p className="text-xs text-gray-600 mt-0.5">Sitemiz T.C. Ticaret Bakanlığı ETBİS sistemine kayıtlıdır.</p>
                </div>
              </div>
              <Link
                href="https://etbis.ticaret.gov.tr/tr/Anasayfa/SiteAraSonuc?siteId=752d043e-c420-4c9e-9ce1-e466bc9ec869"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
              >
                <HiOutlineDocumentText className="w-4 h-4" />
                Siteyi Sorgula
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="bg-white mt-2 px-4 py-6">
        <h3 className="font-semibold text-gray-900 mb-3">Ürün Açıklaması</h3>
        <p className="text-gray-600 leading-relaxed">{product.description}</p>
      </div>

      {/* Specs */}
      {product.specs && Object.keys(product.specs).length > 0 && (
        <div className="bg-white mt-2 px-4 py-6">
          <h3 className="font-semibold text-gray-900 mb-4">Özellikler</h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(product.specs).map(([key, value]) => (
              <div key={key} className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 mb-1">{key}</p>
                <p className="font-medium text-sm text-gray-900">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warranty & Guarantee Info */}
      <div className="bg-white mt-2 px-4 py-6">
        <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
          <HiOutlineBadgeCheck className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Bu Ürün Garantilidir</h4>
            <p className="text-sm text-blue-700">
              Satın aldığınız tüm ürünler orijinal ve yetkili distribütör garantisi altındadır. 
              Herhangi bir sorun yaşamanız durumunda 7/24 müşteri hizmetlerimizden destek alabilirsiniz.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white mt-2 px-4 py-6">
        <h3 className="font-semibold text-gray-900 mb-4">Sıkça Sorulan Sorular</h3>
        <div className="space-y-3">
          {/* FAQ 1 */}
          <div className="bg-gray-50 border border-gray-100 rounded-xl overflow-hidden">
            <button
              onClick={() => setExpandedFaq(expandedFaq === 0 ? null : 0)}
              className="w-full p-4 flex items-center justify-between text-left"
            >
              <span className="font-medium text-sm text-gray-900 pr-4">
                Satın aldığım ürünler orijinal ve garantili mi?
              </span>
              <HiOutlineChevronDown 
                className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                  expandedFaq === 0 ? 'rotate-180' : ''
                }`} 
              />
            </button>
            {expandedFaq === 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="px-4 pb-4"
              >
                <p className="text-sm text-gray-600">
                  Evet, mağazamızda satılan tüm ürünler %100 orijinal ve yetkili distribütör garantisi 
                  altındadır. Her ürün için garanti belgesi ve fatura sağlanmaktadır.
                </p>
              </motion.div>
            )}
          </div>

          {/* FAQ 2 */}
          <div className="bg-gray-50 border border-gray-100 rounded-xl overflow-hidden">
            <button
              onClick={() => setExpandedFaq(expandedFaq === 1 ? null : 1)}
              className="w-full p-4 flex items-center justify-between text-left"
            >
              <span className="font-medium text-sm text-gray-900 pr-4">
                Ürün iadesi ve değişim süreci nasıl işliyor?
              </span>
              <HiOutlineChevronDown 
                className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                  expandedFaq === 1 ? 'rotate-180' : ''
                }`} 
              />
            </button>
            {expandedFaq === 1 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="px-4 pb-4"
              >
                <p className="text-sm text-gray-600">
                  Ürünü teslim aldıktan sonra 14 gün içinde koşulsuz iade hakkınız bulunmaktadır. 
                  İade sürecini başlatmak için müşteri hizmetlerimizi aramanız veya hesabınızdan 
                  iade talebi oluşturmanız yeterlidir. Kargo ücreti tarafımızca karşılanır.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Shipping Countdown & Return Policy */}
      <div className="bg-white mt-2 px-4 py-3">
        <div className="space-y-2">
          {/* Shipping Countdown */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400 px-3 py-2">
            <div className="absolute top-0 right-0 w-12 h-12 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                <HiOutlineTruck className="w-4 h-4 text-white" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold text-white">{String(timeUntilMidnight.hours).padStart(2, '0')}:{String(timeUntilMidnight.minutes).padStart(2, '0')}</span>
                <span className="text-white/90 text-xs">içinde sipariş ver,</span>
                <span className="font-bold text-white text-xs">yarın kargoda!</span>
              </div>
            </div>
          </div>

          {/* Return Policy */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 px-3 py-2">
            <div className="absolute top-0 right-0 w-10 h-10 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                <HiOutlineRefresh className="w-4 h-4 text-white" />
              </div>
              <p className="text-white font-semibold text-xs">14 Gün Koşulsuz İade • <span className="font-normal text-white/90">Ücretsiz iade</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="bg-white mt-2 px-4 py-6">
          <h3 className="font-semibold text-gray-900 mb-4">Benzer Ürünler</h3>
          <div className="grid grid-cols-2 gap-3">
            {relatedProducts.map((relProduct, index) => (
              <ProductCard key={relProduct.id} product={relProduct} index={index} />
            ))}
          </div>
        </div>
      )}

      {/* Fixed Bottom Bar - Only show if NOT added to cart */}
      <AnimatePresence>
        {!isAddedToCart && !showSuccessToast && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 p-4 shadow-lg"
          >
            {/* Beden seçilmedi uyarısı */}
            {requiresSize && !selectedSize && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2"
              >
                <span className="text-amber-600 text-sm font-medium">⚠️ Lütfen önce bir beden seçin</span>
              </motion.div>
            )}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              disabled={product.stock === 0 || (requiresSize && !selectedSize)}
              className={`relative w-full h-14 rounded-2xl font-semibold text-lg flex items-center justify-center gap-3 transition-all shadow-xl overflow-hidden ${
                product.stock === 0 || (requiresSize && !selectedSize)
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-gray-900 via-slate-800 to-indigo-900 text-white'
              }`}
            >
              {/* Shine effect */}
              {product.stock > 0 && !(requiresSize && !selectedSize) && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                  animate={{
                    x: ['-200%', '200%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1.5,
                    ease: 'easeInOut',
                  }}
                />
              )}
              <HiOutlineShoppingBag className="w-6 h-6 relative z-10" />
              <span className="relative z-10">
                {product.stock === 0 
                  ? 'Tükendi' 
                  : requiresSize && !selectedSize 
                    ? 'Beden Seçin' 
                    : 'Sepete Ekle'}
              </span>
              <span className="px-3 py-1 bg-white/10 rounded-lg text-sm relative z-10 border border-white/20">
                {formatPrice(campaignPrice)}
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navbar - Show when product is in cart */}
      <AnimatePresence>
        {isAddedToCart && !showSuccessToast && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          >
            <BottomNavbar force={true} />
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
