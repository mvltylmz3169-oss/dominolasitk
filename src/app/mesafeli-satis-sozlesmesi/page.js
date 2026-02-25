'use client';

import { FaFileSignature, FaStore, FaUser, FaBox, FaTruck, FaUndo, FaGavel } from 'react-icons/fa';
import Footer from '@/components/Footer';

export default function MesafeliSatisSozlesmesiPage() {
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-2xl mb-6">
              <FaFileSignature className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Mesafeli Satış Sözleşmesi</h1>
            <p className="text-gray-300 text-lg">
              6502 Sayılı Tüketicinin Korunması Hakkında Kanun Kapsamında
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Madde 1 - Taraflar */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <FaStore className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">MADDE 1 - SATICI BİLGİLERİ</h2>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-gray-600">
              <p><strong>Ünvan:</strong> Lastik Alsana Limited Şirketi</p>
              <p><strong>Adres:</strong> Gaziantep, Türkiye</p>
              <p><strong>Telefon:</strong> +90 553 378 81 48</p>
              <p><strong>E-posta:</strong> info@lastikalsana.com</p>
              <p><strong>Web Sitesi:</strong> www.lastikalsana.com</p>
            </div>
          </div>

          {/* Madde 2 - Alıcı */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <FaUser className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">MADDE 2 - ALICI BİLGİLERİ</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Alıcı bilgileri, sipariş sırasında alıcı tarafından girilen bilgilerdir. 
              Bu bilgilerin doğruluğu alıcının sorumluluğundadır.
            </p>
          </div>

          {/* Madde 3 - Sözleşme Konusu */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <FaBox className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">MADDE 3 - SÖZLEŞME KONUSU</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              İşbu sözleşmenin konusu, ALICI'nın SATICI'ya ait www.lastikalsana.com internet sitesinden 
              elektronik ortamda siparişini yaptığı aşağıda nitelikleri ve satış fiyatı belirtilen ürünün 
              satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve 
              Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerinin belirlenmesidir.
            </p>
          </div>

          {/* Madde 4 - Ürün Bilgileri */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">MADDE 4 - ÜRÜN BİLGİLERİ</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Sözleşmeye konu mal veya hizmetin;
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>• Türü, miktarı, marka/modeli, rengi ve tüm vergiler dahil satış bedeli sipariş sayfasında belirtilmektedir.</li>
              <li>• Ödeme şekli ve teslimat bilgileri sipariş özeti bölümünde gösterilmektedir.</li>
              <li>• Ürün bedeline kargo ücreti dahil değildir (ücretsiz kargo kampanyaları hariç).</li>
            </ul>
          </div>

          {/* Madde 5 - Teslimat */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <FaTruck className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">MADDE 5 - TESLİMAT</h2>
            </div>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>
                5.1. Ürün, ALICI'nın sipariş formunda belirttiği adrese teslim edilecektir.
              </p>
              <p>
                5.2. Teslimat süresi, siparişin onaylanmasından itibaren en geç 30 (otuz) gündür. 
                Ortalama teslimat süresi 2-5 iş günüdür.
              </p>
              <p>
                5.3. SATICI, sözleşme konusu ürünü eksiksiz, siparişte belirtilen niteliklere uygun 
                teslim etmeyi kabul ve taahhüt eder.
              </p>
              <p>
                5.4. Teslimat sırasında ALICI'nın adresinde bulunmaması halinde kargo firması ile 
                iletişime geçerek teslimat alınmalıdır.
              </p>
            </div>
          </div>

          {/* Madde 6 - Cayma Hakkı */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <FaUndo className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">MADDE 6 - CAYMA HAKKI</h2>
            </div>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>
                6.1. ALICI, sözleşme konusu ürünün kendisine veya gösterdiği adresteki kişi/kuruluşa 
                tesliminden itibaren 14 (on dört) gün içinde cayma hakkını kullanabilir.
              </p>
              <p>
                6.2. Cayma hakkının kullanılması için bu süre içinde SATICI'ya yazılı bildirimde bulunulması 
                ve ürünün kullanılmamış olması şarttır.
              </p>
              <p>
                6.3. Cayma hakkı kullanıldığında ürün bedeli, cayma bildiriminin SATICI'ya ulaşmasından 
                itibaren 14 gün içinde ALICI'ya iade edilir.
              </p>
              <p className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-yellow-800">
                <strong>Önemli:</strong> Niteliği itibariyle iade edilemeyecek ürünler, hızla bozulan 
                veya son kullanma tarihi geçen ürünler, tek kullanımlık ürünler ve hijyen ürünleri 
                cayma hakkı kapsamı dışındadır.
              </p>
            </div>
          </div>

          {/* Madde 7 - Genel Hükümler */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <FaGavel className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">MADDE 7 - GENEL HÜKÜMLER</h2>
            </div>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>
                7.1. ALICI, www.lastikalsana.com internet sitesinde sözleşme konusu ürünün temel 
                nitelikleri, satış fiyatı ve ödeme şekli ile teslimata ilişkin ön bilgileri okuyup 
                bilgi sahibi olduğunu ve elektronik ortamda gerekli teyidi verdiğini beyan eder.
              </p>
              <p>
                7.2. İşbu sözleşmeden doğan uyuşmazlıklarda, Gümrük ve Ticaret Bakanlığınca her yıl 
                belirlenen değere kadar Tüketici Hakem Heyetleri, bu değerin üzerindeki uyuşmazlıklarda 
                Tüketici Mahkemeleri yetkilidir.
              </p>
              <p>
                7.3. ALICI, siparişi onayladığında işbu sözleşmenin tüm koşullarını kabul etmiş sayılır.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
            <h3 className="font-semibold text-blue-800 mb-2">İletişim</h3>
            <p className="text-blue-700 text-sm leading-relaxed">
              Sözleşme hakkında sorularınız için <strong>info@lastikalsana.com</strong> adresinden 
              bizimle iletişime geçebilirsiniz.
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

