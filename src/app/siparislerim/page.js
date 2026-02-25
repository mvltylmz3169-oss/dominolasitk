'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlineShoppingBag,
  HiOutlineLocationMarker,
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineUser,
  HiOutlineTruck,
  HiCheckCircle,
  HiOutlineClock,
  HiOutlineDocumentText,
  HiChevronRight,
  HiChevronDown
} from 'react-icons/hi';
import { FaShieldAlt, FaWhatsapp, FaBox, FaCreditCard, FaCheckDouble } from 'react-icons/fa';
import maliyeLogo from '@/assets/maliye.png';
import manisaLogo from '@/assets/manisa.png';
import footerlogo1 from '@/assets/footerlogo1.webp';
import footerlogo2 from '@/assets/footerlogo2.webp';

// Order status steps
const orderSteps = [
  { id: 'payment_pending', label: 'Ödeme Bekleniyor', icon: FaCreditCard, description: 'Ödemeniz bekleniyor' },
  { id: 'payment_received', label: 'Ödeme Alındı', icon: HiCheckCircle, description: 'Ödemeniz onaylandı' },
  { id: 'preparing', label: 'Hazırlanıyor', icon: FaBox, description: 'Siparişiniz hazırlanıyor' },
  { id: 'shipped', label: 'Kargoya Verildi', icon: HiOutlineTruck, description: 'Siparişiniz kargoya verildi' },
  { id: 'delivered', label: 'Teslim Edildi', icon: FaCheckDouble, description: 'Siparişiniz teslim edildi' },
];

// Get current step index based on status
function getStepIndex(status, paymentStatus) {
  if (status === 'delivered') return 4;
  if (status === 'shipped') return 3;
  if (status === 'preparing') return 2;
  if (paymentStatus === 'confirmed' || paymentStatus === 'verified') return 1;
  return 0;
}

// Order Status Stepper Component
function OrderStepper({ currentStep }) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Sipariş Durumu</h3>
      <div className="relative">
        {orderSteps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const StepIcon = step.icon;
          
          return (
            <div key={step.id} className="flex items-start mb-4 last:mb-0">
              {/* Step indicator */}
              <div className="relative flex flex-col items-center mr-4">
                <motion.div
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.1 : 1,
                    backgroundColor: isCompleted || isCurrent ? '#10b981' : '#e5e7eb'
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                    isCompleted || isCurrent ? 'shadow-lg shadow-green-500/30' : ''
                  }`}
                >
                  <StepIcon className={`w-5 h-5 ${isCompleted || isCurrent ? 'text-white' : 'text-gray-400'}`} />
                </motion.div>
                
                {/* Connecting line */}
                {index < orderSteps.length - 1 && (
                  <div className={`w-0.5 h-8 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`} />
                )}
              </div>
              
              {/* Step content */}
              <div className="flex-1 pt-2">
                <p className={`text-sm font-semibold ${isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-400'}`}>
                  {step.label}
                </p>
                <p className={`text-xs ${isCompleted || isCurrent ? 'text-gray-500' : 'text-gray-300'}`}>
                  {step.description}
                </p>
                {isCurrent && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="inline-block mt-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full"
                  >
                    Şu an burada
                  </motion.span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Order Card Component
function OrderCard({ order, isExpanded, onToggle }) {
  const currentStep = getStepIndex(order.status, order.paymentStatus);
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      layout
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
    >
      {/* Order Header */}
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <HiOutlineShoppingBag className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-gray-900">#{order.orderNumber}</p>
            <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-bold text-gray-900">{formatPrice(order.total)}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              currentStep >= 4 ? 'bg-green-100 text-green-700' :
              currentStep >= 1 ? 'bg-blue-100 text-blue-700' :
              'bg-amber-100 text-amber-700'
            }`}>
              {orderSteps[currentStep].label}
            </span>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <HiChevronDown className="w-5 h-5 text-gray-400" />
          </motion.div>
        </div>
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 space-y-4">
              {/* Order Stepper */}
              <OrderStepper currentStep={currentStep} />

              {/* Order Items */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FaBox className="w-4 h-4 text-indigo-600" />
                  Sipariş Ürünleri ({order.items?.length || 0})
                </h4>
                <div className="space-y-3">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-white p-3 rounded-lg">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                          src={item.image || '/placeholder.png'}
                          alt={item.name}
                          fill
                          className="object-contain p-1"
                          unoptimized
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.quantity} adet</p>
                      </div>
                      <p className="text-sm font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-3">
                {/* Personal Info */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <HiOutlineUser className="w-4 h-4 text-indigo-600" />
                    Müşteri Bilgileri
                  </h4>
                  <div className="space-y-2">
                    <p className="text-xs text-gray-600">
                      <span className="font-medium">{order.customer?.firstName} {order.customer?.lastName}</span>
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <HiOutlinePhone className="w-3 h-3" />
                      {order.customer?.phone}
                    </p>
                    {order.customer?.email && (
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <HiOutlineMail className="w-3 h-3" />
                        {order.customer?.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <HiOutlineLocationMarker className="w-4 h-4 text-indigo-600" />
                    Teslimat Adresi
                  </h4>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-600">{order.shippingAddress?.address}</p>
                    <p className="text-xs text-gray-500">
                      {order.shippingAddress?.district}, {order.shippingAddress?.city}
                    </p>
                    {order.shippingAddress?.postalCode && (
                      <p className="text-xs text-gray-400">{order.shippingAddress?.postalCode}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Ödeme Özeti</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ara Toplam</span>
                    <span className="text-gray-900">{formatPrice(order.originalTotal || order.total)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">İndirim (%{order.discount})</span>
                      <span className="text-green-600">-{formatPrice((order.originalTotal || order.total) * order.discount / 100)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Kargo</span>
                    <span className="text-green-600 font-medium">Ücretsiz</span>
                  </div>
                  <div className="h-px bg-indigo-200 my-2" />
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-900">Toplam</span>
                    <span className="font-bold text-indigo-600 text-lg">{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>

              {/* Order Note */}
              {order.shippingAddress?.orderNote && (
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                  <h4 className="text-sm font-semibold text-amber-800 mb-2 flex items-center gap-2">
                    <HiOutlineDocumentText className="w-4 h-4" />
                    Sipariş Notu
                  </h4>
                  <p className="text-xs text-amber-700">{order.shippingAddress.orderNote}</p>
                </div>
              )}

              {/* Contact Support */}
              <a
                href="https://wa.me/905533788148"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium text-sm shadow-lg shadow-green-500/30"
              >
                <FaWhatsapp className="w-5 h-5" />
                Sipariş Hakkında Destek Al
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Footer Component
function OrdersFooter() {
  const phoneNumber = '905533788148';
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
      <div className="flex flex-col items-center pt-6 pb-24">
        <Image className='' src="/logo3.png" alt="Logo" width={150} height={160} />
        <p className="text-gray-500 mt-2 text-sm mb-4">Müşteri Hizmetleri | Çağrı Hattı</p>
        
        {/* WhatsApp Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full max-w-xs flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300"
        >
          <FaWhatsapp className="w-5 h-5" />
          <span className="text-sm font-semibold tracking-wide">+90 553 378 81 48</span>
        </a>
        
        {/* Working Hours */}
        <p className="mt-3 text-xs text-gray-500">
          Pazartesi - Cumartesi | 09.00 - 18.00
        </p>
      
        <Image className="mt-4" src={footerlogo1} alt="Payment Methods" width={200} height={50} />
      
        <Image className="mt-4" src={footerlogo2} alt="Security" width={120} height={40} />

        <div className="w-full mt-4 text-xs bg-black text-white p-3 rounded-md text-center">
          ©2014-2025 Lastik Alsana "Lastik Alsana Limited Şirketi" KURULUŞUDUR.
        </div>
      </div>
    </div>
  );
}

export default function SiparislerimPage() {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load orders from localStorage
    const loadOrders = () => {
      try {
        const savedOrders = localStorage.getItem('userOrders');
        if (savedOrders) {
          const parsedOrders = JSON.parse(savedOrders);
          // Sort by date, newest first
          parsedOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setOrders(parsedOrders);
          // Auto-expand first order if exists
          if (parsedOrders.length > 0) {
            setExpandedOrderId(parsedOrders[0].orderNumber);
          }
        }
      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);

  const toggleOrder = (orderNumber) => {
    setExpandedOrderId(expandedOrderId === orderNumber ? null : orderNumber);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-[126px]">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Empty state
  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-[126px] pb-24">
        <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6"
          >
            <HiOutlineShoppingBag className="w-12 h-12 text-gray-400" />
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Aktif Siparişiniz Yok</h1>
          <p className="text-gray-500 mb-8 max-w-sm">
            Henüz sipariş vermediniz. Hemen alışverişe başlayın ve siparişlerinizi buradan takip edin!
          </p>
          <Link
            href="/"
            className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30"
          >
            Alışverişe Başla
          </Link>
        </div>

        <OrdersFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-[126px] pb-24">
      {/* Header */}
      <div className="bg-white px-4 py-6 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">Siparişlerim</h1>
        <p className="text-gray-500">{orders.length} sipariş</p>
      </div>

      {/* Orders List */}
      <div className="px-4 py-4 space-y-4">
        {orders.map((order) => (
          <OrderCard
            key={order.orderNumber}
            order={order}
            isExpanded={expandedOrderId === order.orderNumber}
            onToggle={() => toggleOrder(order.orderNumber)}
          />
        ))}
      </div>

      {/* Footer */}
      <OrdersFooter />
    </div>
  );
}

