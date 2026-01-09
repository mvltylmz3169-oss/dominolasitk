'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlineTrash, 
  HiOutlineMinus, 
  HiOutlinePlus,
  HiOutlineShoppingCart,
  HiChevronRight,
  HiCheckCircle
} from 'react-icons/hi';
import { FaShieldAlt, FaWhatsapp } from 'react-icons/fa';
import { useCart } from '@/context/CartContext';
import maliyeLogo from '@/assets/maliye.png';
import manisaLogo from '@/assets/manisa.png';
import footerlogo1 from '@/assets/footerlogo1.webp';
import footerlogo2 from '@/assets/footerlogo2.webp';

// Cart Footer Component
function CartFooter() {
  const phoneNumber = '905549948989';
  const whatsappUrl = `https://wa.me/${phoneNumber}`;

  return (
    <div className="mt-6 px-4">
      {/* Certifications */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-center gap-2 mb-3">
          <FaShieldAlt className="w-5 h-5 text-green-600" />
          <h3 className="text-sm font-semibold text-gray-700">Resmi Onaylı Kuruluş</h3>
        </div>
        
        <div className="flex items-center justify-center gap-8 mb-4">
          <div className="flex flex-col items-center">
            <Image 
              src={maliyeLogo} 
              alt="T.C. Hazine ve Maliye Bakanlığı" 
              width={100} 
              height={100}
              className="object-contain"
            />
          </div>
          <div className="flex flex-col items-center">
            <Image 
              src={manisaLogo} 
              alt="Gaziantep Ticaret Odası" 
              width={100} 
              height={100}
              className="object-contain"
            />
          </div>
        </div>
        
        <p className="text-center text-xs text-gray-500 leading-relaxed">
          Firmamız <span className="font-semibold">T.C. Hazine ve Maliye Bakanlığı</span> ve <span className="font-semibold">Gaziantep Ticaret Odası</span> tarafından 
          onaylı, tüm yasal gereklilikleri yerine getiren güvenilir bir e-ticaret platformudur.
        </p>
      </div>

      {/* Main Footer Content */}
      <div className="flex flex-col items-center pt-6 pb-6">
        <Image src="/logo3.png" alt="Logo" width={150} height={160} />
        <p className="text-gray-500 mt-2 text-sm mb-4">Müşteri Hizmetleri | Çağrı Hattı</p>
        
        {/* WhatsApp Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full max-w-xs flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300"
        >
          <FaWhatsapp className="w-5 h-5" />
          <span className="text-sm font-semibold tracking-wide">+90 554 994 89 89</span>
        </a>
        
        {/* Working Hours */}
        <p className="mt-3 text-xs text-gray-500">
          Pazartesi - Cumartesi | 09.00 - 18.00
        </p>
      
        <Image className="mt-4" src={footerlogo1} alt="Payment Methods" width={200} height={50} />
      
        <Image className="mt-4" src={footerlogo2} alt="Security" width={120} height={40} />
        
        <p className="text-center text-[11px] text-gray-500 mt-4 px-2">
          <span className="font-bold">Lastik Alsana Limited Şirketi,</span> araç sahiplerine yönelik, kış lastikleri, yaz lastikleri, dört mevsim lastikler, jantlar ve motor yağları gibi ürünlerde uzmanlaşmış güvenilir bir e-ticaret platformudur.
        </p>
        
        <p className="text-center text-[11px] text-gray-500 mt-3 px-2">
          <span className="font-bold">lastikalsana.com</span> üzerinden yapacağınız alışverişlerde kredi kartı bilgileriniz yalnızca ödeme işlemi sırasında kullanılır ve kesinlikle veri tabanında saklanmaz.
        </p>
        
        <p className="text-center text-[11px] text-gray-500 mt-3 px-2">
          Sitemizde gerçekleştirilen tüm işlemlerin güvenliğini sağlamak için gelişmiş <span className="font-bold">256 bit SSL sertifikası</span> kullanılmaktadır.
        </p>

        <div className="w-full mt-4 text-xs bg-black text-white p-3 rounded-md text-center">
          ©2014-2025 Lastik Alsana "Lastik Alsana Limited Şirketi" KURULUŞUDUR.
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, getCartTotal, getCartCount, getCartTotalWithoutCampaign, getTotalCampaignDiscount, getItemPrice, getItemDiscount, removeCampaign } = useCart();

  // Countdown state for 15 minutes
  const [timeLeft, setTimeLeft] = useState({
    minutes: 15,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else {
          // Reset timer
          minutes = 15;
          seconds = 0;
        }
        
        return { minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num) => num.toString().padStart(2, '0');

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-gray-50 pt-[126px]">
        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
          <HiOutlineShoppingCart className="w-12 h-12 text-gray-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Sepetiniz Boş</h1>
        <p className="text-gray-500 mb-8">
          Sepetinizde henüz ürün bulunmuyor. Alışverişe başlayın!
        </p>
        <Link
          href="/"
          className="px-8 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors"
        >
          Alışverişe Başla
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-40 pt-[126px]">
      {/* Countdown Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-4 mt-4 mb-3"
      >
        <div 
          className="relative overflow-hidden rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 25%, #ff6b9d 50%, #c44569 75%, #ff6b6b 100%)',
            backgroundSize: '200% 200%',
          }}
        >
          {/* Animated gradient background */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 25%, #ff6b9d 50%, #c44569 75%, #ff6b6b 100%)',
              backgroundSize: '200% 200%',
            }}
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'linear',
            }}
          />

          {/* Shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
            animate={{
              x: ['-200%', '200%'],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              repeatDelay: 3,
              ease: 'easeInOut',
            }}
          />

          {/* Content */}
          <div className="relative flex items-center justify-between px-4 py-4 sm:px-6">
            {/* Left side - Lightning icon and text */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Lightning icon */}
              <motion.div
                className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-xl"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <svg 
                  className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-lg" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                >
                  <path d="M13 3L4 14h7l-2 7 9-11h-7l2-7z" />
                </svg>
              </motion.div>

              {/* Text content */}
              <div className="flex flex-col">
                <span className="text-white font-bold text-sm sm:text-lg tracking-tight leading-tight drop-shadow-md">
                  Özel İndirim Fırsatı
                </span>
                <span className="text-white/80 text-xs sm:text-sm font-medium tracking-wide">
                  Hemen Al, Fırsatı Kaçırma!
                </span>
              </div>
            </div>

            {/* Right side - Countdown and arrow */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Timer section */}
              <div className="flex flex-col items-end">
                <span className="text-white/70 text-[10px] sm:text-xs font-medium uppercase tracking-wider mb-1">
                  Kalan Süre
                </span>
                
                {/* Countdown boxes */}
                <div className="flex items-center gap-1">
                  {/* Minutes */}
                  <motion.div
                    className="bg-white rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 min-w-[32px] sm:min-w-[40px] text-center shadow-lg"
                    animate={{
                      scale: timeLeft.seconds === 59 ? [1, 1.05, 1] : 1,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="text-gray-900 font-bold text-sm sm:text-lg font-mono">
                      {formatNumber(timeLeft.minutes)}
                    </span>
                  </motion.div>

                  <span className="text-white font-bold text-lg sm:text-xl mx-0.5">:</span>

                  {/* Seconds */}
                  <motion.div
                    className="bg-white rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 min-w-[32px] sm:min-w-[40px] text-center shadow-lg"
                    animate={{
                      scale: [1, 1.02, 1],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                    }}
                  >
                    <span className="text-gray-900 font-bold text-sm sm:text-lg font-mono">
                      {formatNumber(timeLeft.seconds)}
                    </span>
                  </motion.div>
                </div>
              </div>

              {/* Arrow button */}
              <motion.div
                className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full cursor-pointer"
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.3)' }}
                whileTap={{ scale: 0.95 }}
              >
                <HiChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Free Shipping Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mx-4 mb-4"
      >
        <div className="flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-100 rounded-xl">
          <div className="w-8 h-8 flex items-center justify-center bg-green-100 rounded-full">
            <HiCheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-green-800 font-semibold text-sm">🎉 Tebrikler! Ücretsiz kargo hakkı kazandınız</p>
            <p className="text-green-600 text-xs">Bu sipariş için kargo ücreti alınmayacaktır</p>
          </div>
        </div>
      </motion.div>

      {/* Header */}
      <div className="bg-white px-4 py-6 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">Sepetim</h1>
        <p className="text-gray-500">{getCartCount()} ürün</p>
      </div>

      {/* Cart Items */}
      <div className="px-4 py-4 space-y-3">
        <AnimatePresence>
          {cart.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex gap-4 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm"
            >
              {/* Image */}
              <Link href={`/urun/${item.id}`} className="flex-shrink-0">
                <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-100">
                  <Image
                  unoptimized
                    src={item.images?.[0] || '/placeholder.png'}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </Link>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <Link href={`/urun/${item.id}`}>
                  <h3 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1">{item.name}</h3>
                </Link>
                {item.selectedSize && (
                  <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded mb-1">
                    Beden: {item.selectedSize}
                  </span>
                )}
                
                {/* Campaign Badge */}
                {item.campaign === '4al3ode' && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-block px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-bold rounded">
                      🔥 4 AL 3 ÖDE
                    </span>
                    <button
                      onClick={() => removeCampaign(item.id)}
                      className="text-[10px] text-gray-400 hover:text-gray-600"
                    >
                      İptal
                    </button>
                  </div>
                )}
                
                {/* Price */}
                <div className="flex items-center gap-2 mb-3">
                  {item.campaign === '4al3ode' && getItemDiscount(item) > 0 ? (
                    <>
                      <span className="text-sm text-gray-400 line-through">{formatPrice(item.price * item.quantity)}</span>
                      <span className="text-lg font-bold text-green-600">{formatPrice(getItemPrice(item))}</span>
                    </>
                  ) : (
                    <span className="text-lg font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</span>
                  )}
                </div>

                {/* Quantity & Delete */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center bg-gray-100 rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-l-lg transition-colors"
                    >
                      <HiOutlineMinus className="w-4 h-4 text-gray-600" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium text-gray-900">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-r-lg transition-colors"
                    >
                      <HiOutlinePlus className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <HiOutlineTrash className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Order Summary */}
      <div className="px-4 py-4">
        <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm space-y-3">
          <div className="flex justify-between text-gray-500">
            <span>Ara Toplam</span>
            <span className="text-gray-900">{formatPrice(getCartTotalWithoutCampaign())}</span>
          </div>
          
          {/* Campaign Discount */}
          {getTotalCampaignDiscount() > 0 && (
            <div className="flex justify-between text-green-600">
              <span className="flex items-center gap-1">
                <span>🔥</span>
                <span>4 Al 3 Öde İndirimi</span>
              </span>
              <span className="font-medium">-{formatPrice(getTotalCampaignDiscount())}</span>
            </div>
          )}
          
          <div className="flex justify-between text-gray-500">
            <span>Kargo</span>
            <span className="text-green-600 font-medium">Ücretsiz</span>
          </div>
          <div className="h-px bg-gray-100" />
          <div className="flex justify-between font-bold text-lg text-gray-900">
            <span>Toplam</span>
            <span>{formatPrice(getCartTotal())}</span>
          </div>
          
          {/* Savings Badge */}
          {getTotalCampaignDiscount() > 0 && (
            <div className="mt-2 p-2 bg-green-50 border border-green-100 rounded-lg text-center">
              <span className="text-green-700 text-sm font-medium">
                🎉 Bu siparişte {formatPrice(getTotalCampaignDiscount())} tasarruf ediyorsunuz!
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <CartFooter />

      {/* Fixed Bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 p-4 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-500">Toplam</span>
          <span className="text-2xl font-bold text-gray-900">{formatPrice(getCartTotal())}</span>
        </div>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push('/checkout')}
          className="relative w-full h-14 bg-gradient-to-r from-gray-900 via-slate-800 to-indigo-900 text-white font-semibold text-lg rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Shine effect */}
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
          <span className="relative z-10">Ödemeye Geç</span>
        </motion.button>
      </div>
    </div>
  );
}
