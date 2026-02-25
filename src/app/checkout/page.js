'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlineUser,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
  HiCheck,
  HiOutlineClipboardCopy,
  HiOutlineUpload,
  HiOutlineChevronDown,
  HiOutlineDocumentText,
  HiCheckCircle,
  HiOutlineChevronRight,
  HiOutlineUserGroup,
  HiOutlineClock,
  HiOutlineRefresh,
  HiArrowLeft
} from 'react-icons/hi';
import { FaShieldAlt, FaWhatsapp } from 'react-icons/fa';
import maliyeLogo from '@/assets/maliye.png';
import manisaLogo from '@/assets/manisa.png';
import footerlogo1 from '@/assets/footerlogo1.webp';
import footerlogo2 from '@/assets/footerlogo2.webp';
import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { useCart } from '@/context/CartContext';

const steps = ['Bilgiler', 'Adres', 'Ödeme', 'Tamamla'];

const turkishCities = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya', 'Ankara', 'Antalya',
  'Ardahan', 'Artvin', 'Aydın', 'Balıkesir', 'Bartın', 'Batman', 'Bayburt', 'Bilecik',
  'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum',
  'Denizli', 'Diyarbakır', 'Düzce', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir',
  'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkâri', 'Hatay', 'Iğdır', 'Isparta', 'İstanbul',
  'İzmir', 'Kahramanmaraş', 'Karabük', 'Karaman', 'Kars', 'Kastamonu', 'Kayseri', 'Kırıkkale',
  'Kırklareli', 'Kırşehir', 'Kilis', 'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa',
  'Mardin', 'Mersin', 'Muğla', 'Muş', 'Nevşehir', 'Niğde', 'Ordu', 'Osmaniye',
  'Rize', 'Sakarya', 'Samsun', 'Siirt', 'Sinop', 'Sivas', 'Şanlıurfa', 'Şırnak',
  'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Uşak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak'
];

const cargoCompanies = [
  { id: 'yurtici', name: 'Yurtiçi Kargo', logo: '/assets/memleket.png', scale: 'scale-125' },
  { id: 'aras', name: 'Aras Kargo', logo: '/assets/araskargo.png', scale: 'scale-125' },
  { id: 'ptt', name: 'PTT Kargo', logo: '/assets/pttkargo.png', scale: 'scale-100' },
  { id: 'surat', name: 'Sürat Kargo', logo: '/assets/suratkargo.png', scale: 'scale-125' },
];

const faqs = [
  {
    question: 'Sipariş verdikten sonra iptal edebilir miyim?',
    answer: 'Evet, siparişiniz kargoya verilmeden önce iptal talebinde bulunabilirsiniz. Kargoya verildikten sonra ise ürün size ulaştığında iade sürecini başlatabilirsiniz.'
  },
  {
    question: 'Neden EFT/Havale ile ödeme yapmalıyım?',
    answer: 'EFT/Havale ile ödeme yaptığınızda banka komisyonlarından tasarruf edildiği için size %3 nakit indirimi sağlıyoruz. Bu sayede aynı ürünü daha uygun fiyata satın alabilirsiniz.'
  },
  {
    question: 'EFT/Havale işleminde açıklama kısmına ne yazmalıyım?',
    answer: 'Ödeme yaparken açıklama kısmına mutlaka sipariş numaranızı yazmalısınız. Bu sayede ödemeniz siparişinizle otomatik olarak eşleştirilir.'
  },
  {
    question: 'EFT/Havale güvenli mi?',
    answer: 'Evet, tamamen güvenlidir. Banka üzerinden yapılan tüm transferler kayıt altındadır ve yasal güvence altındadır. Ayrıca dekont yükleme sistemiyle ödemeniz hızlıca onaylanır.'
  }
];

// Modern Stats Component
function StatsSection() {
  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-3 text-center">
        <div className="w-8 h-8 mx-auto mb-1.5 rounded-full bg-blue-100 flex items-center justify-center">
          <HiOutlineUserGroup className="w-4 h-4 text-blue-600" />
        </div>
        <div className="text-lg font-bold text-blue-700">703</div>
        <div className="text-[9px] text-blue-600 font-medium">Bugün ödeme yapıldı</div>
      </div>
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-xl p-3 text-center">
        <div className="w-8 h-8 mx-auto mb-1.5 rounded-full bg-green-100 flex items-center justify-center">
          <HiOutlineClock className="w-4 h-4 text-green-600" />
        </div>
        <div className="text-lg font-bold text-green-700">7 dk</div>
        <div className="text-[9px] text-green-600 font-medium">Ort. onay süresi</div>
      </div>
      <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100 rounded-xl p-3 text-center">
        <div className="w-8 h-8 mx-auto mb-1.5 rounded-full bg-purple-100 flex items-center justify-center">
          <HiOutlineRefresh className="w-4 h-4 text-purple-600" />
        </div>
        <div className="text-lg font-bold text-purple-700">14 gün</div>
        <div className="text-[9px] text-purple-600 font-medium">Koşulsuz iade</div>
      </div>
    </div>
  );
}

// FAQ Component
function FAQSection({ expandedFaq, setExpandedFaq }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
      <h3 className="font-semibold text-gray-900 text-sm mb-3">Sıkça Sorulan Sorular</h3>
      <div className="space-y-1.5">
        {faqs.map((faq, index) => (
          <div key={index} className="border border-gray-100 rounded-lg overflow-hidden">
            <button
              onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
              className="w-full p-2.5 flex items-center justify-between text-left bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <span className="text-xs font-medium text-gray-800 pr-2">{faq.question}</span>
              <HiOutlineChevronDown className={`w-4 h-4 text-gray-500 transition-transform flex-shrink-0 ${
                expandedFaq === index ? 'rotate-180' : ''
              }`} />
            </button>
            {expandedFaq === index && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-2.5 bg-white"
              >
                <p className="text-xs text-gray-600">{faq.answer}</p>
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Checkout Footer Component
function CheckoutFooter() {
  const phoneNumber = '905533788148';
  const whatsappUrl = `https://wa.me/${phoneNumber}`;

  return (
    <div className="mt-6">
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
      <div className="flex flex-col items-center pt-6 pb-6 px-4">
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
        
        <p className="text-center text-[11px] text-gray-500 mt-4">
          <span className="font-bold">Lastik Alsana Limited Şirketi,</span> araç sahiplerine yönelik, kış lastikleri, yaz lastikleri, dört mevsim lastikler, jantlar ve motor yağları gibi ürünlerde uzmanlaşmış güvenilir bir e-ticaret platformudur.
        </p>
        
        <p className="text-center text-[11px] text-gray-500 mt-3">
          <span className="font-bold">lastikalsana.com</span> üzerinden yapacağınız alışverişlerde kredi kartı bilgileriniz yalnızca ödeme işlemi sırasında kullanılır ve kesinlikle veri tabanında saklanmaz.
        </p>
        
        <p className="text-center text-[11px] text-gray-500 mt-3">
          Sitemizde gerçekleştirilen tüm işlemlerin güvenliğini sağlamak için gelişmiş <span className="font-bold">256 bit SSL sertifikası</span> kullanılmaktadır.
        </p>

        <div className="w-full mt-4 text-xs bg-black text-white p-3 rounded-md text-center">
          ©2014-2025 Lastik Alsana "Lastik Alsana Limited Şirketi" KURULUŞUDUR.
        </div>
      </div>
    </div>
  );
}

// Order Summary Component
function OrderSummary({ cart, formatPrice, getCartTotal, getTotalCampaignDiscount, getItemPrice, paymentMethod, showExpanded = true }) {
  const [expanded, setExpanded] = useState(false);
  const discountedTotal = getCartTotal() * 0.97;
  const campaignDiscount = getTotalCampaignDiscount ? getTotalCampaignDiscount() : 0;
  const visibleItems = expanded ? cart : cart.slice(0, 1);

  return (
    <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl p-3 mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Sipariş Özeti</span>
        <div className="flex items-center gap-2">
          {campaignDiscount > 0 && (
            <span className="text-xs text-orange-600 font-medium bg-orange-50 px-2 py-0.5 rounded">🔥 4 Al 3 Öde</span>
          )}
          {paymentMethod === 'eft' && (
            <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded">%3 indirim</span>
          )}
          <span className="font-bold text-gray-900">
            {paymentMethod === 'eft' ? formatPrice(discountedTotal) : formatPrice(getCartTotal())}
          </span>
        </div>
      </div>
      
      <div className="space-y-2">
        {visibleItems.map((item) => {
          const itemTotal = getItemPrice ? getItemPrice(item) : item.price * item.quantity;
          const hasDiscount = item.campaign === '4al3ode' && item.quantity >= 4;
          
          return (
            <div key={item.id} className="flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-100">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <Image
                  src={item.images?.[0] || '/placeholder.png'}
                  alt={item.name}
                  fill
                  className="object-contain p-1"
                  unoptimized
                  priority
                  loader={({ src }) => src}
                  onError={(e) => { e.target.src = '/placeholder.png'; }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{item.quantity} adet</span>
                  {hasDiscount ? (
                    <>
                      <span className="text-xs text-gray-400 line-through">{formatPrice(item.price * item.quantity)}</span>
                      <span className="text-sm font-semibold text-green-600">{formatPrice(itemTotal)}</span>
                    </>
                  ) : (
                    <span className="text-sm font-semibold text-gray-900">{formatPrice(itemTotal)}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Campaign Discount Info */}
      {campaignDiscount > 0 && (
        <div className="mt-2 p-2 bg-green-50 rounded-lg">
          <div className="flex items-center justify-between text-xs">
            <span className="text-green-700 font-medium">🎉 Kampanya indirimi</span>
            <span className="text-green-700 font-bold">-{formatPrice(campaignDiscount)}</span>
          </div>
        </div>
      )}

      {showExpanded && cart.length > 1 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full mt-2 flex items-center justify-center gap-1 text-xs text-indigo-600 font-medium py-1.5 hover:bg-indigo-50 rounded-lg transition-colors"
        >
          {expanded ? 'Daha az göster' : `+${cart.length - 1} ürün daha`}
          <HiOutlineChevronDown className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getCartTotal, getCartTotalWithoutCampaign, getTotalCampaignDiscount, getItemPrice, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [selectedCargo, setSelectedCargo] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [receiptFile, setReceiptFile] = useState(null);
  const [copied, setCopied] = useState('');
  const [showCardError, setShowCardError] = useState(false);
  const [showReceiptRequired, setShowReceiptRequired] = useState(false);
  const [showCargoRequired, setShowCargoRequired] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [countdownTime, setCountdownTime] = useState({ minutes: 15, seconds: 0 });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [cardData, setCardData] = useState({
    holder: '',
    number: '',
    expiry: '',
    cvv: ''
  });
  const [cardType, setCardType] = useState('');
  const [districts, setDistricts] = useState([]);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const pageRef = useRef(null);
  const receiptUploadRef = useRef(null);
  
  const generatedOrderNumber = useMemo(() => {
    return Math.floor(1000000 + Math.random() * 9000000).toString();
  }, []);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    postalCode: '',
    orderNote: ''
  });
  const [agreementAccepted, setAgreementAccepted] = useState(false);

  const [paymentSettings, setPaymentSettings] = useState({
    iban: '',
    accountHolder: '',
    bankName: ''
  });

  const [bannerMessageIndex, setBannerMessageIndex] = useState(0);
  const bannerMessages = [
    { text: '827 kişi bugün alışveriş yaptı', number: '827' },
    { text: '1731 kişi siteyi inceliyor', number: '1731' }
  ];

  useEffect(() => {
    if (cart.length === 0 && !orderComplete) {
    router.push('/sepet');
  }
  }, [cart, orderComplete, router]);

  // Fetch payment settings from Firebase
  useEffect(() => {
    const fetchPaymentSettings = async () => {
      try {
        const settingsDoc = await getDoc(doc(db, 'settings', 'payment'));
        if (settingsDoc.exists()) {
          const data = settingsDoc.data();
          setPaymentSettings({
            iban: data.iban || 'TR12 3456 7890 1234 5678 9012 34',
            accountHolder: data.accountHolder || '1001 ÇARŞI TİCARET A.Ş.',
            bankName: data.bankName || ''
          });
        }
      } catch (error) {
        console.error('Error fetching payment settings:', error);
      }
    };

    fetchPaymentSettings();
  }, []);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Banner message rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setBannerMessageIndex((prev) => (prev + 1) % bannerMessages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [bannerMessages.length]);

  // Countdown timer for 15 minutes
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownTime(prev => {
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

  // LocalStorage key for checkout form data
  const CHECKOUT_STORAGE_KEY = 'checkout_form_data';

  // Load saved form data from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(CHECKOUT_STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        
        // Restore form data
        if (parsedData.formData) {
          setFormData(prev => ({
            ...prev,
            ...parsedData.formData
          }));
        }
        
        // NOT restoring paymentMethod - user should select fresh each time
        
        // Restore selected cargo
        if (parsedData.selectedCargo) {
          setSelectedCargo(parsedData.selectedCargo);
        }
        
        // Restore agreement accepted
        if (parsedData.agreementAccepted) {
          setAgreementAccepted(parsedData.agreementAccepted);
        }
        
        // Restore current step
        if (typeof parsedData.currentStep === 'number' && parsedData.currentStep >= 0) {
          setCurrentStep(parsedData.currentStep);
        }
        
        // Restore card data (except CVV for security)
        if (parsedData.cardData) {
          setCardData(prev => ({
            ...prev,
            holder: parsedData.cardData.holder || '',
            number: parsedData.cardData.number || '',
            expiry: parsedData.cardData.expiry || ''
          }));
          // Detect card type
          if (parsedData.cardData.number) {
            const cleanNumber = parsedData.cardData.number.replace(/\s/g, '');
            const firstDigit = cleanNumber.charAt(0);
            const firstTwo = cleanNumber.substring(0, 2);
            if (firstDigit === '4') setCardType('visa');
            else if (['51', '52', '53', '54', '55'].includes(firstTwo) || firstDigit === '5') setCardType('mastercard');
            else if (['34', '37'].includes(firstTwo) || firstDigit === '3') setCardType('amex');
          }
        }
      }
    } catch (error) {
      console.error('Error loading checkout data from localStorage:', error);
    }
  }, []);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    try {
      const dataToSave = {
        formData,
        selectedCargo,
        agreementAccepted,
        currentStep,
        cardData: {
          holder: cardData.holder,
          number: cardData.number,
          expiry: cardData.expiry
          // CVV is not saved for security reasons
        },
        savedAt: new Date().toISOString()
      };
      localStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Error saving checkout data to localStorage:', error);
    }
  }, [formData, selectedCargo, agreementAccepted, currentStep, cardData.holder, cardData.number, cardData.expiry]);

  // Clear checkout data from localStorage after successful order
  const clearCheckoutStorage = () => {
    try {
      localStorage.removeItem(CHECKOUT_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing checkout data from localStorage:', error);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const validateEmail = (email) => {
    if (!email) return true; // Email is optional, so empty is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Kart tipi algılama
  const detectCardType = (number) => {
    const cleanNumber = number.replace(/\s/g, '');
    const firstDigit = cleanNumber.charAt(0);
    const firstTwo = cleanNumber.substring(0, 2);
    
    if (firstDigit === '4') return 'visa';
    if (['51', '52', '53', '54', '55'].includes(firstTwo) || firstDigit === '5') return 'mastercard';
    if (['34', '37'].includes(firstTwo) || firstDigit === '3') return 'amex';
    return '';
  };

  // Kart numarası formatla (4'er grupla)
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '').substring(0, 16);
    const parts = [];
    for (let i = 0; i < v.length; i += 4) {
      parts.push(v.substring(i, i + 4));
    }
    return parts.join(' ');
  };

  // Son kullanma tarihi formatla (AA/YY)
  const formatExpiry = (value) => {
    const v = value.replace(/\D/g, '').substring(0, 4);
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2);
    }
    return v;
  };

  // Son kullanma tarihi validasyonu
  const isExpiryValid = (expiry) => {
    if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
    const [month, year] = expiry.split('/');
    const monthNum = parseInt(month);
    if (monthNum < 1 || monthNum > 12) return false;
    const expDate = new Date(2000 + parseInt(year), monthNum, 0);
    const now = new Date();
    return expDate >= new Date(now.getFullYear(), now.getMonth(), 1);
  };

  // Kart numarası değişikliği
  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setCardData(prev => ({ ...prev, number: formatted }));
    setCardType(detectCardType(formatted));
  };

  // Son kullanma tarihi değişikliği
  const handleExpiryChange = (e) => {
    const formatted = formatExpiry(e.target.value);
    setCardData(prev => ({ ...prev, expiry: formatted }));
  };

  // CVV değişikliği
  const handleCvvChange = (e) => {
    const v = e.target.value.replace(/\D/g, '').substring(0, 3);
    setCardData(prev => ({ ...prev, cvv: v }));
  };

  // Tüm kart bilgileri geçerli mi?
  const isCardDataValid = 
    cardData.holder.length >= 3 &&
    cardData.number.replace(/\s/g, '').length === 16 &&
    isExpiryValid(cardData.expiry) &&
    cardData.cvv.length === 3;

  // Fetch districts when city is selected
  useEffect(() => {
    const fetchDistricts = async () => {
      if (!formData.city) {
        setDistricts([]);
        setFormData(prev => ({ ...prev, district: '' }));
        return;
      }

      setLoadingDistricts(true);
      try {
        // Fetch all provinces - each province already contains districts array
        const provincesResponse = await fetch('https://turkiyeapi.dev/api/v1/provinces');
        
        if (!provincesResponse.ok) {
          throw new Error('Provinces API failed');
        }
        
        const provincesData = await provincesResponse.json();
        
        // Find the selected city - districts are already in the province object
        const selectedProvince = provincesData.data?.find(
          (province) => province.name === formData.city
        );

        if (selectedProvince && selectedProvince.districts && Array.isArray(selectedProvince.districts)) {
          const districtNames = selectedProvince.districts
            .map((district) => district.name)
            .filter(Boolean)
            .sort();
          setDistricts(districtNames);
        } else {
          setDistricts([]);
        }
      } catch (error) {
        console.error('Error fetching districts:', error);
        setDistricts([]);
      } finally {
        setLoadingDistricts(false);
      }
    };

    fetchDistricts();
  }, [formData.city]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear email error when user starts typing
    if (name === 'email') {
      setEmailError('');
    }
    
    // Reset district when city changes
    if (name === 'city') {
      setFormData(prev => ({ ...prev, district: '' }));
    }
  };

  const handleEmailBlur = () => {
    if (formData.email && !validateEmail(formData.email)) {
      setEmailError('Lütfen geçerli bir e-posta adresi girin (örn: ornek@email.com)');
    } else {
      setEmailError('');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const saveIncompleteUser = async () => {
    try {
      await addDoc(collection(db, 'incomplete_users'), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        createdAt: serverTimestamp(),
        status: 'incomplete',
        step: currentStep
      });
    } catch (error) {
      console.error('Error saving incomplete user:', error);
    }
  };

  const handleNextStep = async () => {
    // Validate email before proceeding from step 0
    if (currentStep === 0) {
      if (formData.email && !validateEmail(formData.email)) {
        setEmailError('Lütfen geçerli bir e-posta adresi girin (örn: ornek@email.com)');
        return;
      }
      await saveIncompleteUser();
    }
    setCurrentStep(prev => prev + 1);
    scrollToTop();
  };

  const handleSubmit = async () => {
    // Show error if credit card is selected
    if (paymentMethod === 'card') {
      setShowCardError(true);
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const orderRef = await addDoc(collection(db, 'orders'), {
        orderNumber: generatedOrderNumber,
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone
        },
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          district: formData.district,
          postalCode: formData.postalCode,
          orderNote: formData.orderNote
        },
        items: cart.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.images?.[0]
        })),
        total: paymentMethod === 'eft' ? getCartTotal() * 0.97 : getCartTotal(),
        originalTotal: getCartTotal(),
        discount: paymentMethod === 'eft' ? 3 : 0,
        cargoCompany: selectedCargo,
        paymentMethod: paymentMethod,
        status: 'pending',
        paymentStatus: 'awaiting',
        createdAt: serverTimestamp()
      });

      if (formData.email) {
        await addDoc(collection(db, 'completed_users'), {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          district: formData.district,
          postalCode: formData.postalCode,
          orderId: orderRef.id,
          createdAt: serverTimestamp(),
          status: 'completed'
        });
      }

      setOrderId(orderRef.id);
      
      if (paymentMethod === 'eft') {
        setCurrentStep(3);
        setTimeout(() => {
          scrollToTop();
        }, 100);
      } else {
      setOrderComplete(true);
      clearCart();
      clearCheckoutStorage();
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Sipariş oluşturulurken bir hata oluştu.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentComplete = async () => {
    // Dekont yüklenmediyse uyarı göster
    if (!receiptFile) {
      setShowReceiptRequired(true);
      return;
    }
    
    setIsProcessing(true);
    
    try {
      let receiptUrl = null;
      
      // Upload receipt to Firebase Storage
      if (receiptFile && orderId) {
        const fileName = `receipts/${orderId}_${Date.now()}_${receiptFile.name}`;
        const fileRef = ref(storage, fileName);
        await uploadBytes(fileRef, receiptFile);
        receiptUrl = await getDownloadURL(fileRef);
        
        // Update order with receipt URL
        await updateDoc(doc(db, 'orders', orderId), {
          receiptUrl: receiptUrl,
          paymentStatus: 'pending_verification',
          receiptUploadedAt: serverTimestamp()
        });
      }
      
      // Save order to localStorage for order tracking
      const orderData = {
        orderNumber: generatedOrderNumber,
        orderId: orderId,
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone
        },
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          district: formData.district,
          postalCode: formData.postalCode,
          orderNote: formData.orderNote
        },
        items: cart.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.images?.[0]
        })),
        total: discountedTotal,
        originalTotal: getCartTotal(),
        discount: 3,
        cargoCompany: selectedCargo,
        paymentMethod: paymentMethod,
        status: 'pending',
        paymentStatus: 'pending_verification',
        createdAt: new Date().toISOString()
      };

      // Get existing orders from localStorage
      const existingOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
      existingOrders.unshift(orderData); // Add new order at the beginning
      localStorage.setItem('userOrders', JSON.stringify(existingOrders));
      
      // Dispatch custom event to update BottomNavbar
      window.dispatchEvent(new Event('ordersUpdated'));
      
      setOrderComplete(true);
      clearCart();
      clearCheckoutStorage();
    } catch (error) {
      console.error('Error uploading receipt:', error);
      alert('Dekont yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseReceiptPopup = () => {
    setShowReceiptRequired(false);
    // Dekont yükleme alanına scroll et
    setTimeout(() => {
      if (receiptUploadRef.current) {
        receiptUploadRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(''), 2000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      setUploadProgress(0);
      setReceiptFile(file);
      
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15 + 5; // Random increment between 5-20
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setIsUploading(false);
        }
        setUploadProgress(Math.min(Math.round(progress), 100));
      }, 150);
    }
  };

  // Step 3 buton tıklama kontrolü
  const handleStep3ButtonClick = () => {
    // Kargo seçilmemişse uyarı göster
    if (!selectedCargo) {
      setShowCargoRequired(true);
      return;
    }
    // Ödeme yöntemi seçilmemişse (bu durumda buton zaten disabled olmalı ama yine de kontrol)
    if (!paymentMethod) {
      return;
    }
    
    // Her şey tamamsa submit et
    handleSubmit();
  };

  const isStep1Valid = formData.firstName && formData.lastName && formData.phone && !emailError && (formData.email === '' || validateEmail(formData.email)) && agreementAccepted;
  const isStep2Valid = formData.address && formData.city && formData.district;
  const isStep3Valid = selectedCargo && paymentMethod && (paymentMethod === 'eft' || (paymentMethod === 'card' && isCardDataValid));

  const discountedTotal = getCartTotal() * 0.97;

  if (orderComplete) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-gray-50">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6"
        >
          <HiCheck className="w-10 h-10 text-green-600" />
        </motion.div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Siparişiniz Alındı!</h1>
        <p className="text-gray-500 mb-2">
          Sipariş numaranız: <span className="text-gray-900 font-mono font-bold">{generatedOrderNumber}</span>
        </p>
        <p className="text-gray-500 mb-8">
          Siparişinizle ilgili bilgiler alınmıştır. Siparişiniz incelendikten sonra işleme alınacaktır.
        </p>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push('/')}
          className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl shadow-xl"
        >
          Alışverişe Devam Et
        </motion.button>
      </div>
    );
  }

  const inputClass = "w-full h-11 px-3 bg-white border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-slate-800 focus:ring-2 focus:ring-indigo-900/20 transition-all text-sm";

  return (
    <div ref={pageRef} className="min-h-screen bg-gray-50 pb-24">
      {/* Credit Card Error Popup */}
      <AnimatePresence>
        {showCardError && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCardError(false)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="text-3xl">⚠️</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Ödeme Yöntemi Geçersiz</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Kampanyalı ürünlerde yalnızca <span className="font-semibold text-green-600">Banka Havale / EFT / FAST</span> ödeme yöntemi geçerlidir.
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  Lütfen ödeme yönteminizi değiştirerek %3 nakit indiriminden faydalanın.
                </p>
                <button
                  onClick={() => {
                    setShowCardError(false);
                    setPaymentMethod('eft');
                  }}
                  className="w-full h-11 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl mb-2"
                >
                  Havale/EFT ile Devam Et
                </button>
                <button
                  onClick={() => setShowCardError(false)}
                  className="w-full h-10 bg-gray-100 text-gray-600 font-medium rounded-xl text-sm"
                >
                  Geri Dön
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Receipt Required Popup */}
      <AnimatePresence>
        {showReceiptRequired && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseReceiptPopup}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
                  <HiOutlineUpload className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Dekont Yüklenmedi!</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Siparişinizi tamamlamak için lütfen ödeme dekontunuzu yükleyin.
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  Dekont yüklemeden sipariş onaylanamaz. Banka/mobil uygulama ekran görüntüsü veya dekont PDF dosyası kabul edilmektedir.
                </p>
                <button
                  onClick={handleCloseReceiptPopup}
                  className="w-full h-11 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl"
                >
                  Dekont Yükle
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Cargo Required Popup */}
      <AnimatePresence>
        {showCargoRequired && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCargoRequired(false)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-3xl">📦</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Kargo Seçilmedi!</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Siparişinizi tamamlamak için lütfen bir kargo firması seçin.
                </p>
                <button
                  onClick={() => setShowCargoRequired(false)}
                  className="w-full h-11 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-xl"
                >
                  Kargo Seç
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>


      {/* Progress Steps - 4 Steps with more spacing - Fixed below Navbar */}
      <div className="fixed top-[8vh] left-0 right-0 z-40 bg-white px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-center max-w-lg mx-auto">
          {steps.map((step, index) => (
            <div key={step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                  index <= currentStep 
                    ? 'bg-gradient-to-r from-gray-900 to-indigo-900 text-white' 
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  {index < currentStep ? <HiCheck className="w-4 h-4" /> : index + 1}
                </div>
                <span className={`text-[10px] mt-0.5 ${index <= currentStep ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                  {step}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 sm:w-16 h-0.5 mx-2 sm:mx-3 self-start mt-3.5 ${
                  index < currentStep ? 'bg-gradient-to-r from-gray-900 to-indigo-900' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Checkout Info Banner - Fixed below Stepper */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-[17vh] left-0 right-0 z-40 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white h-[45px] px-3 overflow-hidden flex items-center justify-center"
      >
        {/* Animated background shine */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
          animate={{
            x: ['-200%', '200%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 2,
            ease: 'easeInOut',
          }}
        />
        
        {/* Content */}
        <div className="relative flex items-center justify-center gap-2">
          <HiCheckCircle className="w-4 h-4 text-green-400 animate-pulse" />
          
          {/* Rotating Message */}
          <div className="relative h-5 flex items-center overflow-hidden min-w-[180px]">
            <AnimatePresence mode="wait">
              <motion.span
                key={bannerMessageIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="text-[11px] sm:text-xs font-medium whitespace-nowrap absolute left-0"
              >
                <span className="font-bold text-green-400">{bannerMessages[bannerMessageIndex].number}</span>{' '}
                {bannerMessages[bannerMessageIndex].text.replace(bannerMessages[bannerMessageIndex].number + ' ', '')}
              </motion.span>
            </AnimatePresence>
          </div>
          
          <span className="text-white/50">•</span>
          <span className="text-[11px] sm:text-xs font-medium whitespace-nowrap">
            Güvenli Ödeme <span className="font-bold text-yellow-400">%100</span>
          </span>
          <HiCheckCircle className="w-4 h-4 text-green-400 animate-pulse" />
        </div>
      </motion.div>

      {/* Form Steps */}
      <div className="px-3 py-4 max-w-lg mx-auto pt-[16vh]">
        <AnimatePresence mode="wait">
          {/* Step 1: Personal Info */}
          {currentStep === 0 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Order Summary */}
              <OrderSummary cart={cart} formatPrice={formatPrice} getCartTotal={getCartTotal} getTotalCampaignDiscount={getTotalCampaignDiscount} getItemPrice={getItemPrice} paymentMethod={paymentMethod} />

              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <h2 className="text-base font-semibold text-gray-900 mb-3">Kişisel Bilgiler</h2>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1 block">Ad *</label>
                      <div className="relative">
                        <HiOutlineUser className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className={`${inputClass} pl-8`}
                          placeholder="Adınız"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1 block">Soyad *</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={inputClass}
                        placeholder="Soyadınız"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Telefon *</label>
                    <div className="relative">
                      <HiOutlinePhone className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          setFormData(prev => ({ ...prev, phone: value }));
                        }}
                        className={`${inputClass} pl-8`}
                        placeholder="Telefon"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">E-posta</label>
                    <div className="relative">
                      <HiOutlineMail className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 ${emailError ? 'text-red-400' : 'text-gray-400'}`} />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onBlur={handleEmailBlur}
                        className={`${inputClass} pl-8 ${emailError ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                        placeholder="ornek@email.com"
                      />
                    </div>
                    {emailError && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-red-500 mt-1 flex items-center gap-1"
                      >
                        <span>⚠️</span> {emailError}
                      </motion.p>
                    )}
                  </div>
                  
                  {/* Sözleşme Onayı */}
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div className="relative flex-shrink-0 mt-0.5">
                        <input
                          type="checkbox"
                          checked={agreementAccepted}
                          onChange={(e) => setAgreementAccepted(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${
                          agreementAccepted 
                            ? 'bg-gradient-to-r from-gray-900 to-indigo-900 border-transparent' 
                            : 'border-gray-300 group-hover:border-gray-400'
                        }`}>
                          {agreementAccepted && (
                            <HiCheck className="w-3.5 h-3.5 text-white" />
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-gray-600 leading-relaxed">
                        <Link 
                          href="/mesafeli-satis-sozlesmesi" 
                          target="_blank"
                          className="font-bold text-gray-900 hover:text-indigo-600 underline underline-offset-2 transition-colors"
                        >
                          Mesafeli Satış Sözleşmesi
                        </Link>
                        'ni okudum ve kabul ediyorum. Kişisel verilerimin işlenmesine onay veriyorum.
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Stats & FAQ */}
              <StatsSection />
              <FAQSection expandedFaq={expandedFaq} setExpandedFaq={setExpandedFaq} />
              
              {/* Footer */}
              <CheckoutFooter />
            </motion.div>
          )}

          {/* Step 2: Address */}
          {currentStep === 1 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Order Summary */}
              <OrderSummary cart={cart} formatPrice={formatPrice} getCartTotal={getCartTotal} getTotalCampaignDiscount={getTotalCampaignDiscount} getItemPrice={getItemPrice} paymentMethod={paymentMethod} />

              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <h2 className="text-base font-semibold text-gray-900 mb-3">Teslimat Adresi</h2>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Adres *</label>
                    <div className="relative">
                      <HiOutlineLocationMarker className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={2}
                        className={`${inputClass} h-auto py-2 pl-8 resize-none`}
                        placeholder="Sokak, mahalle, bina no, daire no..."
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1 block">İl *</label>
                      <div className="relative">
                        <select
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={`${inputClass} appearance-none pr-10 cursor-pointer`}
                        >
                          <option value="">İl seçin</option>
                          {turkishCities.map((city) => (
                            <option key={city} value={city}>
                              {city}
                            </option>
                          ))}
                        </select>
                        <HiOutlineChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1 block">İlçe *</label>
                      <div className="relative">
                        <select
                          name="district"
                          value={formData.district}
                          onChange={handleInputChange}
                          disabled={!formData.city || loadingDistricts}
                          className={`${inputClass} appearance-none pr-10 cursor-pointer ${
                            !formData.city || loadingDistricts ? 'bg-gray-100 cursor-not-allowed' : ''
                          }`}
                        >
                          <option value="">
                            {loadingDistricts ? 'Yükleniyor...' : !formData.city ? 'Önce il seçin' : 'İlçe seçin'}
                          </option>
                          {districts.map((district) => (
                            <option key={district} value={district}>
                              {district}
                            </option>
                          ))}
                        </select>
                        <HiOutlineChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Posta Kodu</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className={inputClass}
                      placeholder="34000"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Sipariş Notu</label>
                    <div className="relative">
                      <HiOutlineDocumentText className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
                      <textarea
                        name="orderNote"
                        value={formData.orderNote}
                        onChange={handleInputChange}
                        rows={2}
                        className={`${inputClass} h-auto py-2 pl-8 resize-none`}
                        placeholder="Teslimat için özel notunuz varsa yazın..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats & FAQ */}
              <StatsSection />
              <FAQSection expandedFaq={expandedFaq} setExpandedFaq={setExpandedFaq} />
              
              {/* Footer */}
              <CheckoutFooter />
            </motion.div>
          )}

          {/* Step 3: Payment Selection */}
          {currentStep === 2 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Cargo Selection */}
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <h2 className="text-base font-semibold text-gray-900 mb-3">Kargo Seçimi</h2>
                <div className="grid grid-cols-4 gap-2">
                  {cargoCompanies.map((cargo) => (
                    <button
                      key={cargo.id}
                      onClick={() => setSelectedCargo(cargo.id)}
                      className={`relative h-[50px] rounded-xl border-2 transition-all overflow-hidden ${
                        selectedCargo === cargo.id
                          ? 'border-indigo-600 bg-white shadow-md'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <Image
                        src={cargo.logo}
                        alt={cargo.name}
                        fill
                        className={`object-contain ${cargo.scale}`}
                        unoptimized
                        priority
                        loader={({ src }) => src}
                        onError={(e) => { e.target.src = '/placeholder.png'; }}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-gray-500 mt-2">Lütfen tercih ettiğiniz kargo firmasını seçin</p>
              </div>

              {/* ETBİS Information */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 shadow-sm">
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

              {/* Payment Method Selection */}
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <h2 className="text-base font-semibold text-gray-900 mb-3">Ödeme Yöntemi</h2>
                <div className="space-y-2">
                  {/* EFT Option - Recommended */}
                  <button
                    onClick={() => setPaymentMethod('eft')}
                    className={`w-full p-3 rounded-xl border-2 text-left transition-all relative overflow-hidden ${
                      paymentMethod === 'eft'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    {paymentMethod === 'eft' && (
                      <div className="absolute top-2 right-2">
                        <HiCheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    )}
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                        <span className="text-white font-bold text-xs">₺</span>
                  </div>
                  <div>
                        <div className="font-semibold text-gray-900 text-sm">Banka Havale / EFT / FAST</div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-green-600 bg-green-100 px-1.5 py-0.5 rounded">%3 nakit indirimi</span>
                          <motion.span 
                            className="text-[10px] text-orange-600 font-medium"
                            animate={{ opacity: [1, 0.5, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            %89 tercih ediyor
                          </motion.span>
                        </div>
                  </div>
                    </div>
                    <p className="text-[10px] text-gray-600 mt-1.5 leading-relaxed">
                      Bankalarla yaptığımız anlaşma sayesinde Havale/EFT/FAST ödemelerinde %3 nakit indirimi uygulanmaktadır.
                    </p>
                    {paymentMethod === 'eft' && (
                      <div className="mt-2 p-1.5 bg-green-100 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-green-800">İndirimli Toplam:</span>
                          <span className="font-bold text-green-700 text-sm">{formatPrice(discountedTotal)}</span>
                        </div>
                      </div>
                    )}
                  </button>

                  {/* Credit Card Option */}
                  <button
                    onClick={() => {
                      setPaymentMethod(paymentMethod === 'card' ? '' : 'card');
                    }}
                    className={`w-full p-3 rounded-xl border-2 text-left transition-all relative ${
                      paymentMethod === 'card'
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {paymentMethod === 'card' && (
                      <div className="absolute top-2 right-2">
                        <HiCheckCircle className="w-5 h-5 text-indigo-500" />
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-gray-700 to-gray-900 flex items-center justify-center">
                        <span className="text-white text-sm">💳</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">Kredi Kartı ile Ödeme</div>
                        {isCardDataValid && (
                          <div className="text-[10px] text-green-600 font-medium">✓ Kart bilgileri girildi</div>
                        )}
                      </div>
                    </div>
                    <p className="text-[10px] text-orange-600 mt-1.5">
                      ⚠️ Kampanyalı ürünlerde yalnızca Havale/EFT/FAST ile ödeme kabul edilmektedir.
                    </p>
                  </button>

                  {/* Credit Card Expandable Section */}
                  <AnimatePresence>
                    {paymentMethod === 'card' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="pt-3 space-y-3">
                          {/* Card Holder Name */}
                          <div>
                            <label className="text-xs font-medium text-gray-600 mb-1 block">Kart Üzerindeki İsim</label>
                            <input
                              type="text"
                              value={cardData.holder}
                              onChange={(e) => setCardData(prev => ({ ...prev, holder: e.target.value.toUpperCase() }))}
                              className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 outline-none focus:border-indigo-500 focus:bg-white transition-all text-sm uppercase"
                              placeholder="AD SOYAD"
                            />
                          </div>

                          {/* Card Number */}
                          <div>
                            <label className="text-xs font-medium text-gray-600 mb-1 block">Kart Numarası</label>
                            <div className="relative">
                              <input
                                type="text"
                                value={cardData.number}
                                onChange={handleCardNumberChange}
                                className="w-full h-11 px-4 pr-16 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 outline-none focus:border-indigo-500 focus:bg-white transition-all text-sm font-mono tracking-wider"
                                placeholder="0000 0000 0000 0000"
                              />
                              {cardType && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                  {cardType === 'visa' && (
                                    <span className="text-sm font-bold text-blue-600 italic">VISA</span>
                                  )}
                                  {cardType === 'mastercard' && (
                                    <div className="flex">
                                      <div className="w-4 h-4 bg-red-500 rounded-full -mr-1.5" />
                                      <div className="w-4 h-4 bg-yellow-400 rounded-full" />
                                    </div>
                                  )}
                                  {cardType === 'amex' && (
                                    <span className="text-xs font-bold text-green-600">AMEX</span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Expiry and CVV */}
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs font-medium text-gray-600 mb-1 block">Son Kullanma</label>
                              <input
                                type="text"
                                value={cardData.expiry}
                                onChange={handleExpiryChange}
                                className={`w-full h-11 px-4 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 outline-none focus:bg-white transition-all text-sm font-mono ${
                                  cardData.expiry.length === 5 && !isExpiryValid(cardData.expiry)
                                    ? 'border-red-400 focus:border-red-400'
                                    : 'border-gray-200 focus:border-indigo-500'
                                }`}
                                placeholder="AA/YY"
                              />
                              {cardData.expiry.length === 5 && !isExpiryValid(cardData.expiry) && (
                                <p className="text-[10px] text-red-500 mt-1">Geçersiz tarih</p>
                              )}
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-600 mb-1 block">CVV</label>
                              <input
                                type="text"
                                value={cardData.cvv}
                                onChange={handleCvvChange}
                                className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 outline-none focus:border-indigo-500 focus:bg-white transition-all text-sm font-mono tracking-widest"
                                placeholder="•••"
                                maxLength={3}
                              />
                            </div>
                          </div>

                          {/* Security Note */}
                          <div className="flex items-center justify-center gap-2 pt-2 pb-1">
                            <span className="text-sm">🔒</span>
                            <p className="text-[10px] text-gray-400">256-bit SSL ile güvenli bağlantı</p>
                          </div>
                       
                           {/* Security & Payment Logos */}
                <div className="flex items-center justify-center gap-3  pt-3 border-t border-gray-200">
                  {/* 256-bit SSL */}
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-900 rounded-lg">
                    <svg className="w-4 h-4 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                    </svg>
                    <span className="text-[10px] font-bold text-white">256-Bit SSL</span>
                  </div>
                  
                  {/* Visa */}
                  <div className="flex items-center px-2.5 py-1.5 bg-white rounded-lg border border-gray-200">
                    <svg className="h-5" viewBox="0 0 780 500" fill="none">
                      <path d="M293.2 348.7l33.4-195.8h53.3l-33.4 195.8h-53.3z" fill="#1434CB"/>
                      <path d="M534.9 156.7c-10.5-3.9-27-8.2-47.6-8.2-52.4 0-89.3 26.5-89.6 64.4-.3 28.1 26.3 43.7 46.4 53.1 20.6 9.6 27.5 15.7 27.4 24.3-.1 13.1-16.4 19.1-31.6 19.1-21.1 0-32.4-2.9-49.7-10.2l-6.8-3.1-7.4 43.3c12.3 5.4 35.2 10.1 58.9 10.4 55.7 0 91.9-26.2 92.3-66.7.2-22.2-13.9-39.1-44.5-53.1-18.5-9-29.9-15.1-29.8-24.2 0-8.1 9.6-16.8 30.4-16.8 17.4-.3 30 3.5 39.8 7.5l4.8 2.2 7.2-41.9h.2z" fill="#1434CB"/>
                      <path d="M649.7 152.9h-41c-12.7 0-22.2 3.5-27.8 16.2l-78.8 178.5h55.7s9.1-24 11.2-29.3h68.1c1.6 6.8 6.5 29.3 6.5 29.3h49.2l-43.1-194.7zm-65.5 125.9c4.4-11.3 21.2-54.7 21.2-54.7-.3.5 4.4-11.3 7.1-18.7l3.6 16.9s10.2 46.6 12.3 56.5h-44.2z" fill="#1434CB"/>
                      <path d="M247 152.9l-52 133.2-5.5-27c-9.6-30.9-39.6-64.4-73.1-81.2l47.4 169.5h56l83.3-194.5H247z" fill="#1434CB"/>
                      <path d="M146.9 152.9H60.9l-.7 3.8c66.4 16.1 110.4 55.1 128.6 101.9l-18.5-89.3c-3.2-12.3-12.5-15.9-23.4-16.4z" fill="#F9A533"/>
                    </svg>
                  </div>
                  
                  {/* Mastercard */}
                  <div className="flex items-center px-2.5 py-1.5 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center">
                      <div className="w-5 h-5 bg-[#EB001B] rounded-full -mr-1.5"></div>
                      <div className="w-5 h-5 bg-[#F79E1B] rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* 3D Secure */}
                  <div className="flex items-center gap-1 px-2.5 py-1.5 bg-white rounded-lg border border-gray-200">
                    <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                    </svg>
                    <span className="text-[10px] font-bold text-gray-700">3D Secure</span>
                  </div>
                </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Ticari Bilgilerimiz Section */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <h3 className="text-sm font-bold text-gray-800 mb-3 pb-2 border-b border-gray-300">Ticari Bilgilerimiz:</h3>
                <div className="space-y-1.5 text-sm text-gray-700">
                  <p><span className="font-medium">Firma Ünvanı:</span> <span className="font-bold">Lastik Alsana İthalat İhracat Ticaret Ltd. Şti.</span></p>
                  <p><span className="font-medium">Vergi No:</span> <span className="font-bold">39XXXXXXX</span></p>
                  <p><span className="font-medium">MERSİS No:</span> <span className="font-bold">039XXXXXXXXXXXXX</span></p>
                </div>
                
                {/* Security & Payment Logos */}
                <div className="flex hidden items-center justify-center gap-3 mt-4 pt-3 border-t border-gray-200">
                  {/* 256-bit SSL */}
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-900 rounded-lg">
                    <svg className="w-4 h-4 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                    </svg>
                    <span className="text-[10px] font-bold text-white">256-Bit SSL</span>
                  </div>
                  
                  {/* Visa */}
                  <div className="flex items-center px-2.5 py-1.5 bg-white rounded-lg border border-gray-200">
                    <svg className="h-5" viewBox="0 0 780 500" fill="none">
                      <path d="M293.2 348.7l33.4-195.8h53.3l-33.4 195.8h-53.3z" fill="#1434CB"/>
                      <path d="M534.9 156.7c-10.5-3.9-27-8.2-47.6-8.2-52.4 0-89.3 26.5-89.6 64.4-.3 28.1 26.3 43.7 46.4 53.1 20.6 9.6 27.5 15.7 27.4 24.3-.1 13.1-16.4 19.1-31.6 19.1-21.1 0-32.4-2.9-49.7-10.2l-6.8-3.1-7.4 43.3c12.3 5.4 35.2 10.1 58.9 10.4 55.7 0 91.9-26.2 92.3-66.7.2-22.2-13.9-39.1-44.5-53.1-18.5-9-29.9-15.1-29.8-24.2 0-8.1 9.6-16.8 30.4-16.8 17.4-.3 30 3.5 39.8 7.5l4.8 2.2 7.2-41.9h.2z" fill="#1434CB"/>
                      <path d="M649.7 152.9h-41c-12.7 0-22.2 3.5-27.8 16.2l-78.8 178.5h55.7s9.1-24 11.2-29.3h68.1c1.6 6.8 6.5 29.3 6.5 29.3h49.2l-43.1-194.7zm-65.5 125.9c4.4-11.3 21.2-54.7 21.2-54.7-.3.5 4.4-11.3 7.1-18.7l3.6 16.9s10.2 46.6 12.3 56.5h-44.2z" fill="#1434CB"/>
                      <path d="M247 152.9l-52 133.2-5.5-27c-9.6-30.9-39.6-64.4-73.1-81.2l47.4 169.5h56l83.3-194.5H247z" fill="#1434CB"/>
                      <path d="M146.9 152.9H60.9l-.7 3.8c66.4 16.1 110.4 55.1 128.6 101.9l-18.5-89.3c-3.2-12.3-12.5-15.9-23.4-16.4z" fill="#F9A533"/>
                    </svg>
                  </div>
                  
                  {/* Mastercard */}
                  <div className="flex items-center px-2.5 py-1.5 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center">
                      <div className="w-5 h-5 bg-[#EB001B] rounded-full -mr-1.5"></div>
                      <div className="w-5 h-5 bg-[#F79E1B] rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* 3D Secure */}
                  <div className="flex items-center gap-1 px-2.5 py-1.5 bg-white rounded-lg border border-gray-200">
                    <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                    </svg>
                    <span className="text-[10px] font-bold text-gray-700">3D Secure</span>
                  </div>
                </div>
              </div>

              {/* Stats & FAQ */}
              <StatsSection />
              <FAQSection expandedFaq={expandedFaq} setExpandedFaq={setExpandedFaq} />
              
              {/* Footer */}
              <CheckoutFooter />
            </motion.div>
          )}

          {/* Step 4: EFT Details */}
          {currentStep === 3 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-3"
            >
              {/* Special Discount Banner with Countdown */}
              <div className="relative overflow-hidden rounded-2xl">
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
                <div className="relative flex items-center justify-between px-4 py-4">
                  {/* Left side - Lightning icon and text */}
                  <div className="flex items-center gap-3">
                    {/* Lightning icon */}
                    <motion.div
                      className="w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-xl"
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
                        className="w-6 h-6 text-white drop-shadow-lg" 
                        viewBox="0 0 24 24" 
                        fill="currentColor"
                      >
                        <path d="M13 3L4 14h7l-2 7 9-11h-7l2-7z" />
                      </svg>
                    </motion.div>

                    {/* Text content */}
                    <div className="flex flex-col">
                      <span className="text-white font-bold text-sm tracking-tight leading-tight drop-shadow-md">
                        Özel İndirim Fırsatı
                      </span>
                      <span className="text-white/80 text-xs font-medium tracking-wide">
                        Hemen Al, Fırsatı Kaçırma!
                      </span>
                    </div>
                  </div>

                  {/* Right side - Countdown */}
                  <div className="flex items-center gap-2">
                    {/* Timer section */}
                    <div className="flex flex-col items-end">
                      <span className="text-white/70 text-[10px] font-medium uppercase tracking-wider mb-1">
                        Kalan Süre
                      </span>
                      
                      {/* Countdown boxes */}
                      <div className="flex items-center gap-1">
                        {/* Minutes */}
                        <motion.div
                          className="bg-white rounded-lg px-2 py-1.5 min-w-[32px] text-center shadow-lg"
                          animate={{
                            scale: countdownTime.seconds === 59 ? [1, 1.05, 1] : 1,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <span className="text-gray-900 font-bold text-sm font-mono">
                            {countdownTime.minutes.toString().padStart(2, '0')}
                          </span>
                        </motion.div>

                        <span className="text-white font-bold text-lg mx-0.5">:</span>

                        {/* Seconds */}
                        <motion.div
                          className="bg-white rounded-lg px-2 py-1.5 min-w-[32px] text-center shadow-lg"
                          animate={{
                            scale: [1, 1.02, 1],
                          }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                          }}
                        >
                          <span className="text-gray-900 font-bold text-sm font-mono">
                            {countdownTime.seconds.toString().padStart(2, '0')}
                          </span>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order & Payment Info */}
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="text-center mb-3">
                  <p className="text-gray-600 text-xs">
                    <span className="font-bold text-gray-900 text-base">{generatedOrderNumber}</span> sipariş numaranıza ait
                  </p>
                  <p className="text-xl font-bold text-green-600 mt-0.5">{formatPrice(discountedTotal)}</p>
                  <p className="text-gray-500 text-xs">ödeme yapmanız gerekmektedir</p>
                </div>

                <div className="space-y-2">
                  {/* IBAN */}
                  <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-[10px] text-gray-500">IBAN</div>
                      <div className="font-mono font-medium text-gray-900 text-xs">{paymentSettings.iban}</div>
                    </div>
                    <button 
                      onClick={() => copyToClipboard(paymentSettings.iban.replace(/\s/g, ''), 'iban')}
                      className={`p-1.5 rounded-lg transition-colors ${copied === 'iban' ? 'bg-green-100 text-green-600' : 'bg-gray-200 hover:bg-gray-300 text-gray-600'}`}
                    >
                      {copied === 'iban' ? <HiCheck className="w-4 h-4" /> : <HiOutlineClipboardCopy className="w-4 h-4" />}
                    </button>
              </div>

                  {/* Account Holder */}
                  <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-[10px] text-gray-500">Hesap Sahibi</div>
                      <div className="font-medium text-gray-900 text-xs">{paymentSettings.accountHolder}</div>
                    </div>
                    <button 
                      onClick={() => copyToClipboard(paymentSettings.accountHolder, 'holder')}
                      className={`p-1.5 rounded-lg transition-colors ${copied === 'holder' ? 'bg-green-100 text-green-600' : 'bg-gray-200 hover:bg-gray-300 text-gray-600'}`}
                    >
                      {copied === 'holder' ? <HiCheck className="w-4 h-4" /> : <HiOutlineClipboardCopy className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Bank Name (if provided) */}
                  {paymentSettings.bankName && (
                    <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
                      <div>
                        <div className="text-[10px] text-gray-500">Banka</div>
                        <div className="font-medium text-gray-900 text-xs">{paymentSettings.bankName}</div>
                      </div>
                    </div>
                  )}

                  {/* Order Number */}
                  <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-[10px] text-gray-500">Sipariş Numarası (Açıklamaya yazın)</div>
                      <div className="font-mono font-bold text-gray-900 text-sm">{generatedOrderNumber}</div>
                    </div>
                    <button 
                      onClick={() => copyToClipboard(generatedOrderNumber, 'order')}
                      className={`p-1.5 rounded-lg transition-colors ${copied === 'order' ? 'bg-green-100 text-green-600' : 'bg-gray-200 hover:bg-gray-300 text-gray-600'}`}
                    >
                      {copied === 'order' ? <HiCheck className="w-4 h-4" /> : <HiOutlineClipboardCopy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Receipt Upload */}
              <div ref={receiptUploadRef} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="font-semibold text-gray-900 text-sm mb-2">Fotoğraf Yükle <span className="text-red-500">*</span></h3>
                <label className="block">
                  <div className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
                    uploadProgress === 100 ? 'border-green-400 bg-green-50' : isUploading ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                  }`}>
                    {receiptFile ? (
                      <div className="space-y-3">
                        {/* File info */}
                        <div className="flex items-center justify-center gap-2">
                          {uploadProgress === 100 ? (
                            <HiCheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                          )}
                          <span className={`font-medium text-sm ${uploadProgress === 100 ? 'text-green-600' : 'text-blue-600'}`}>
                            {receiptFile.name}
                          </span>
                        </div>
                        
                        {/* Progress bar */}
                        <div className="w-full max-w-xs mx-auto">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-500">Yükleniyor...</span>
                            <span className={`text-sm font-bold ${uploadProgress === 100 ? 'text-green-600' : 'text-blue-600'}`}>
                              %{uploadProgress}
                            </span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full rounded-full ${uploadProgress === 100 ? 'bg-gradient-to-r from-green-400 to-green-500' : 'bg-gradient-to-r from-blue-400 to-blue-500'}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${uploadProgress}%` }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                        </div>
                        
                        {/* Success message */}
                        {uploadProgress === 100 && (
                          <motion.p 
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-xs text-green-600 font-medium"
                          >
                            ✓ Fotoğraf başarıyla yüklendi!
                          </motion.p>
                        )}
                      </div>
                    ) : (
                      <>
                        <HiOutlineUpload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                        <p className="text-xs text-gray-600">Dekont fotoğrafını yüklemek için tıklayın</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">PNG, JPG veya PDF</p>
                      </>
                    )}
                  </div>
                  <input type="file" className="hidden" accept="image/*,.pdf" onChange={handleFileUpload} />
                </label>
                <p className="text-[10px] text-gray-500 mt-1.5">
                  📋 Dekont yükledikten sonra ödeme inceleme birimi tarafından incelenecektir.
                </p>
              </div>

              {/* Ticari Bilgilerimiz Section */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <h3 className="text-sm font-bold text-gray-800 mb-3 pb-2 border-b border-gray-300">Ticari Bilgilerimiz:</h3>
                <div className="space-y-1.5 text-sm text-gray-700">
                  <p><span className="font-medium">Firma Ünvanı:</span> <span className="font-bold">Lastik Alsana İthalat İhracat Ticaret Ltd. Şti.</span></p>
                  <p><span className="font-medium">Vergi No:</span> <span className="font-bold">39XXXXXXX</span></p>
                  <p><span className="font-medium">MERSİS No:</span> <span className="font-bold">039XXXXXXXXXXXXX</span></p>
                </div>
                
                {/* Security & Payment Logos */}
                <div className="flex items-center justify-center gap-3 mt-4 pt-3 border-t border-gray-200">
                  {/* 256-bit SSL */}
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-900 rounded-lg">
                    <svg className="w-4 h-4 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                    </svg>
                    <span className="text-[10px] font-bold text-white">256-Bit SSL</span>
                  </div>
                  
                  {/* Visa */}
                  <div className="flex items-center px-2.5 py-1.5 bg-white rounded-lg border border-gray-200">
                    <svg className="h-5" viewBox="0 0 780 500" fill="none">
                      <path d="M293.2 348.7l33.4-195.8h53.3l-33.4 195.8h-53.3z" fill="#1434CB"/>
                      <path d="M534.9 156.7c-10.5-3.9-27-8.2-47.6-8.2-52.4 0-89.3 26.5-89.6 64.4-.3 28.1 26.3 43.7 46.4 53.1 20.6 9.6 27.5 15.7 27.4 24.3-.1 13.1-16.4 19.1-31.6 19.1-21.1 0-32.4-2.9-49.7-10.2l-6.8-3.1-7.4 43.3c12.3 5.4 35.2 10.1 58.9 10.4 55.7 0 91.9-26.2 92.3-66.7.2-22.2-13.9-39.1-44.5-53.1-18.5-9-29.9-15.1-29.8-24.2 0-8.1 9.6-16.8 30.4-16.8 17.4-.3 30 3.5 39.8 7.5l4.8 2.2 7.2-41.9h.2z" fill="#1434CB"/>
                      <path d="M649.7 152.9h-41c-12.7 0-22.2 3.5-27.8 16.2l-78.8 178.5h55.7s9.1-24 11.2-29.3h68.1c1.6 6.8 6.5 29.3 6.5 29.3h49.2l-43.1-194.7zm-65.5 125.9c4.4-11.3 21.2-54.7 21.2-54.7-.3.5 4.4-11.3 7.1-18.7l3.6 16.9s10.2 46.6 12.3 56.5h-44.2z" fill="#1434CB"/>
                      <path d="M247 152.9l-52 133.2-5.5-27c-9.6-30.9-39.6-64.4-73.1-81.2l47.4 169.5h56l83.3-194.5H247z" fill="#1434CB"/>
                      <path d="M146.9 152.9H60.9l-.7 3.8c66.4 16.1 110.4 55.1 128.6 101.9l-18.5-89.3c-3.2-12.3-12.5-15.9-23.4-16.4z" fill="#F9A533"/>
                    </svg>
                  </div>
                  
                  {/* Mastercard */}
                  <div className="flex items-center px-2.5 py-1.5 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center">
                      <div className="w-5 h-5 bg-[#EB001B] rounded-full -mr-1.5"></div>
                      <div className="w-5 h-5 bg-[#F79E1B] rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* 3D Secure */}
                  <div className="flex items-center gap-1 px-2.5 py-1.5 bg-white rounded-lg border border-gray-200">
                    <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                    </svg>
                    <span className="text-[10px] font-bold text-gray-700">3D Secure</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <StatsSection />

              {/* FAQ Section */}
              <FAQSection expandedFaq={expandedFaq} setExpandedFaq={setExpandedFaq} />
              
              {/* Footer */}
              <CheckoutFooter />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fixed Bottom - Steps 0-2 */}
      {currentStep < 3 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 p-3 shadow-lg">
          <div className="flex gap-2 max-w-lg mx-auto">
          {currentStep > 0 && (
            <button
                onClick={() => { setCurrentStep(prev => prev - 1); scrollToTop(); }}
                className="flex-1 h-10 bg-gray-100 text-gray-700 font-semibold text-sm rounded-xl hover:bg-gray-200 transition-colors"
            >
              Geri
            </button>
          )}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={currentStep === 2 ? handleStep3ButtonClick : handleNextStep}
            disabled={
              (currentStep === 0 && !isStep1Valid) ||
              (currentStep === 1 && !isStep2Valid) ||
              isProcessing
            }
              className={`relative flex-1 h-10 font-semibold text-sm rounded-xl transition-all overflow-hidden ${
              ((currentStep === 0 && !isStep1Valid) ||
               (currentStep === 1 && !isStep2Valid) ||
               (currentStep === 2 && !isStep3Valid) ||
               isProcessing)
                ? 'bg-gray-200 text-gray-400'
                  : 'bg-gradient-to-r from-gray-900 via-slate-800 to-indigo-900 text-white shadow-lg'
            }`}
          >
            {/* Shine effect */}
            {!((currentStep === 0 && !isStep1Valid) ||
               (currentStep === 1 && !isStep2Valid) ||
               (currentStep === 2 && !isStep3Valid) ||
               isProcessing) && (
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
            <span className="relative z-10">
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  İşleniyor...
                </span>
              ) : currentStep === 2 ? (
                  'Siparişi Onayla'
              ) : (
                'Devam Et'
              )}
            </span>
          </motion.button>
        </div>
      </div>
      )}

      {/* Fixed Bottom - Step 3 (Tamamla) with Back Button */}
      {currentStep === 3 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 p-3 shadow-lg">
          <div className="flex gap-2 max-w-lg mx-auto">
            {/* Back Button - 20% width */}
            <button
              onClick={() => { setCurrentStep(2); scrollToTop(); }}
              className="w-[20%] h-10 bg-gray-100 text-gray-700 font-semibold text-sm rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center"
            >
              <HiArrowLeft className="w-5 h-5" />
            </button>
            
            {/* Complete Payment Button - 80% width */}
            <motion.button
              whileTap={uploadProgress === 100 ? { scale: 0.98 } : {}}
              onClick={handlePaymentComplete}
              disabled={uploadProgress !== 100 || isProcessing}
              className={`w-[80%] h-10 font-semibold text-sm rounded-xl flex items-center justify-center gap-2 relative overflow-hidden transition-all ${
                uploadProgress === 100 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg cursor-pointer' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {uploadProgress === 100 && (
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
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2 relative z-10">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  İşleniyor...
                </span>
              ) : uploadProgress === 100 ? (
                <>
                  <HiCheckCircle className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">Ödemeyi Tamamladım</span>
                </>
              ) : uploadProgress > 0 ? (
                <span className="relative z-10">Yükleniyor... %{uploadProgress}</span>
              ) : (
                <span className="relative z-10">Önce Dekont Yükleyin</span>
              )}
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}
