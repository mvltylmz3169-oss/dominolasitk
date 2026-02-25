'use client';

import { FaUndo, FaBox, FaTruck, FaCreditCard, FaExclamationCircle, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import Footer from '@/components/Footer';

export default function IptalVeIadePage() {
  const steps = [
    {
      step: 1,
      title: 'İade Talebi Oluşturun',
      description: 'Müşteri hizmetlerimize ulaşarak iade talebinizi bildirin ve iade kodunuzu alın.'
    },
    {
      step: 2,
      title: 'Ürünü Hazırlayın',
      description: 'Ürünü orijinal ambalajında, kullanılmamış ve tüm aksesuarlarıyla birlikte paketleyin.'
    },
    {
      step: 3,
      title: 'Kargoya Verin',
      description: 'Belirtilen kargo firması ile ürünü gönderin. İade kodunu pakete ekleyin.'
    },
    {
      step: 4,
      title: 'İade Onayı',
      description: 'Ürün kontrolü sonrası ödemeniz 3-5 iş günü içinde iade edilir.'
    }
  ];

  const nonReturnableItems = [
    'Kullanılmış veya hasar görmüş ürünler',
    'Orijinal ambalajı açılmış hijyen ürünleri (kask iç astarı vb.)',
    'Özel sipariş üzerine hazırlanan ürünler',
    'İndirimli/outlet ürünler (belirtilen koşullarda)',
    'Ambalajı açılmış CD, DVD ve yazılım ürünleri'
  ];

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-2xl mb-6">
              <FaUndo className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">İptal ve İade Politikası</h1>
            <p className="text-gray-300 text-lg">
              Kolay ve hızlı iade süreci
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Key Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <FaCheckCircle className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-800 mb-1">14 Gün</h3>
              <p className="text-sm text-gray-600">Cayma hakkı süresi</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <FaCreditCard className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-800 mb-1">3-5 İş Günü</h3>
              <p className="text-sm text-gray-600">İade süresi</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <FaTruck className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-800 mb-1">Ücretsiz</h3>
              <p className="text-sm text-gray-600">Hasarlı ürün iadesi</p>
            </div>
          </div>

          {/* Sipariş İptali */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Sipariş İptali</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Siparişinizi kargoya verilmeden önce iptal edebilirsiniz. İptal talebi için 
                müşteri hizmetlerimize ulaşmanız yeterlidir.
              </p>
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-700 mb-2">İptal Durumunda:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Kredi kartı ile ödeme: 1-3 iş günü içinde iade</li>
                  <li>• Havale/EFT ile ödeme: 1-2 iş günü içinde iade</li>
                  <li>• Kapıda ödeme: Ödeme alınmadığı için işlem yapılmaz</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Cayma Hakkı */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <FaUndo className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Cayma Hakkı</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              6502 sayılı Tüketicinin Korunması Hakkında Kanun kapsamında, ürünü teslim aldığınız 
              tarihten itibaren <strong>14 gün</strong> içinde herhangi bir gerekçe göstermeksizin 
              cayma hakkınızı kullanabilirsiniz.
            </p>
            <div className="bg-green-50 border border-green-100 rounded-xl p-4">
              <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                <FaCheckCircle className="w-4 h-4" />
                Cayma Hakkı Koşulları
              </h4>
              <ul className="space-y-1 text-sm text-green-700">
                <li>• Ürün kullanılmamış ve orijinal ambalajında olmalıdır</li>
                <li>• Tüm aksesuarlar ve belgeler eksiksiz olmalıdır</li>
                <li>• Ürün etiketi ve bandı çıkarılmamış olmalıdır</li>
                <li>• Ürünün değerini düşürecek bir hasar olmamalıdır</li>
              </ul>
            </div>
          </div>

          {/* İade Süreci */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <FaBox className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">İade Süreci</h2>
            </div>
            
            <div className="space-y-4">
              {steps.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    {item.step}
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-800 mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* İade Edilemeyen Ürünler */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <FaTimesCircle className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">İade Edilemeyen Ürünler</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Aşağıdaki durumlarda ürün iadesi kabul edilmemektedir:
            </p>
            <ul className="space-y-2">
              {nonReturnableItems.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-600">
                  <FaTimesCircle className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Hasarlı Ürün */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <FaExclamationCircle className="w-5 h-5 text-yellow-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Hasarlı veya Hatalı Ürün</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              Ürününüz hasarlı veya hatalı geldiğinde:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <FaCheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                Teslim sırasında tutanak tutturarak ürünü teslim almayın veya alın
              </li>
              <li className="flex items-start gap-2">
                <FaCheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                24 saat içinde müşteri hizmetlerine bildirin
              </li>
              <li className="flex items-start gap-2">
                <FaCheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                Hasarlı ürünün fotoğraflarını gönderin
              </li>
              <li className="flex items-start gap-2">
                <FaCheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                Kargo ücreti tarafımıza ait olmak üzere iade yapılır
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 md:p-8 text-white">
            <h3 className="text-xl font-bold mb-4">İade Talebi İçin İletişim</h3>
            <p className="text-red-100 mb-4">
              İade ve iptal talepleriniz için aşağıdaki kanallardan bize ulaşabilirsiniz:
            </p>
            <div className="space-y-2">
              <p><strong>WhatsApp:</strong> +90 553 378 81 48</p>
              <p><strong>E-posta:</strong> iade@lastikalsana.com</p>
              <p><strong>Çalışma Saatleri:</strong> Pzt-Cmt 09:00 - 18:00</p>
            </div>
          </div>

          {/* Last Update */}
          <p className="text-center text-gray-500 text-sm mt-8">
            Son güncelleme: Ocak 2025
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}

