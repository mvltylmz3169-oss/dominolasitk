'use client';

import { FaUserShield, FaDatabase, FaEye, FaShareAlt, FaClock, FaUserCheck } from 'react-icons/fa';
import Footer from '@/components/Footer';

export default function KisiselVeriAydinlatmaPage() {
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-2xl mb-6">
              <FaUserShield className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Kişisel Veri Aydınlatma Metni</h1>
            <p className="text-gray-300 text-lg">
              6698 Sayılı Kişisel Verilerin Korunması Kanunu (KVKK) Kapsamında
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Intro */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Veri Sorumlusu</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, kişisel verileriniz; 
              veri sorumlusu olarak <strong>Lastik Alsana Limited Şirketi</strong> tarafından aşağıda 
              açıklanan kapsamda işlenebilecektir.
            </p>
            <div className="bg-gray-50 rounded-xl p-4 text-gray-600">
              <p><strong>Veri Sorumlusu:</strong> Lastik Alsana Limited Şirketi</p>
              <p><strong>Adres:</strong> Gaziantep, Türkiye</p>
              <p><strong>E-posta:</strong> kvkk@lastikalsana.com</p>
            </div>
          </div>

          {/* Toplanan Veriler */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <FaDatabase className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Toplanan Kişisel Veriler</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              Şirketimiz tarafından aşağıdaki kişisel veri kategorileri işlenebilmektedir:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-700 mb-2">Kimlik Bilgileri</h4>
                <p className="text-sm text-gray-600">Ad, soyad, T.C. kimlik numarası</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-700 mb-2">İletişim Bilgileri</h4>
                <p className="text-sm text-gray-600">Telefon, e-posta, adres</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-700 mb-2">Müşteri İşlem Bilgileri</h4>
                <p className="text-sm text-gray-600">Sipariş bilgileri, fatura bilgileri</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-700 mb-2">İşlem Güvenliği Bilgileri</h4>
                <p className="text-sm text-gray-600">IP adresi, cihaz bilgileri, log kayıtları</p>
              </div>
            </div>
          </div>

          {/* İşleme Amaçları */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <FaEye className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">İşleme Amaçları</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                Ürün ve hizmetlerin sunulması, sipariş süreçlerinin yürütülmesi
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                Müşteri ilişkileri yönetimi ve müşteri memnuniyetinin sağlanması
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                Fatura düzenleme ve muhasebe işlemlerinin yürütülmesi
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                Yasal yükümlülüklerin yerine getirilmesi
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                Güvenlik ve dolandırıcılık önleme faaliyetleri
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                İzniniz dahilinde pazarlama ve kampanya faaliyetleri
              </li>
            </ul>
          </div>

          {/* Aktarım */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <FaShareAlt className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Verilerin Aktarılması</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              Kişisel verileriniz, yukarıda belirtilen amaçların gerçekleştirilmesi doğrultusunda 
              aşağıdaki taraflara aktarılabilir:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                Kargo ve lojistik firmalarına (teslimat için)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                Ödeme kuruluşları ve bankalara (ödeme işlemleri için)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                Yetkili kamu kurum ve kuruluşlarına (yasal zorunluluk halinde)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                Hizmet aldığımız iş ortaklarına (hizmet sunumu için)
              </li>
            </ul>
          </div>

          {/* Saklama Süresi */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <FaClock className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Saklama Süresi</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Kişisel verileriniz, işleme amaçlarının gerektirdiği süre boyunca ve yasal 
              yükümlülüklerimiz kapsamında belirlenen süreler dahilinde saklanmaktadır. 
              Yasal saklama süresi sona erdikten sonra kişisel verileriniz silinir, yok edilir 
              veya anonim hale getirilir.
            </p>
          </div>

          {/* Haklar */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <FaUserCheck className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">KVKK Kapsamındaki Haklarınız</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              KVKK'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">a)</span>
                Kişisel verilerinizin işlenip işlenmediğini öğrenme
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">b)</span>
                Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">c)</span>
                Kişisel verilerinizin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">d)</span>
                Yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı üçüncü kişileri bilme
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">e)</span>
                Kişisel verilerinizin eksik veya yanlış işlenmiş olması halinde bunların düzeltilmesini isteme
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">f)</span>
                KVKK'nın 7. maddesinde öngörülen şartlar çerçevesinde kişisel verilerinizin silinmesini veya yok edilmesini isteme
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">g)</span>
                (e) ve (f) bentleri uyarınca yapılan işlemlerin, kişisel verilerinizin aktarıldığı üçüncü kişilere bildirilmesini isteme
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">h)</span>
                İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">i)</span>
                Kişisel verilerinizin kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız halinde zararın giderilmesini talep etme
              </li>
            </ul>
          </div>

          {/* Başvuru */}
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 md:p-8 text-white mb-6">
            <h3 className="text-xl font-bold mb-4">Başvuru Yöntemi</h3>
            <p className="text-red-100 mb-4">
              Yukarıda belirtilen haklarınızı kullanmak için aşağıdaki yöntemlerle başvurabilirsiniz:
            </p>
            <ul className="space-y-2 text-red-100">
              <li>• E-posta ile: <strong className="text-white">kvkk@lastikalsana.com</strong></li>
              <li>• Yazılı başvuru ile şirket adresimize posta yoluyla</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
            <h3 className="font-semibold text-blue-800 mb-2">Bilgi</h3>
            <p className="text-blue-700 text-sm leading-relaxed">
              Başvurularınız en geç 30 gün içinde ücretsiz olarak sonuçlandırılacaktır. 
              Ancak, işlemin ayrıca bir maliyet gerektirmesi halinde, Kişisel Verileri Koruma 
              Kurulu tarafından belirlenen tarifedeki ücret alınabilir.
            </p>
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

