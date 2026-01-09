'use client';

import { FaFileContract, FaUserCheck, FaShoppingBag, FaBan, FaExclamationTriangle, FaGavel } from 'react-icons/fa';
import Footer from '@/components/Footer';

export default function UyelikSozlesmesiPage() {
  const sections = [
    {
      icon: FaUserCheck,
      title: '1. Üyelik Koşulları',
      content: `Lastik Alsana platformuna üye olabilmek için:

• 18 yaşını doldurmuş olmak
• Türkiye Cumhuriyeti vatandaşı veya Türkiye'de yasal ikamet hakkına sahip olmak
• Geçerli ve güncel iletişim bilgileri sağlamak
• Üyelik formundaki bilgileri doğru ve eksiksiz doldurmak

gerekmektedir. Üyelik ücretsizdir ve herhangi bir taahhüt içermez.`
    },
    {
      icon: FaShoppingBag,
      title: '2. Alışveriş Kuralları',
      content: `Üyeler platformumuzda alışveriş yaparken aşağıdaki kurallara uymayı kabul eder:

• Sipariş verilen ürünlerin bedelinin ödenmesi
• Doğru teslimat adresi ve iletişim bilgilerinin sağlanması
• Teslimat sırasında ürünlerin kontrol edilmesi
• Hasarlı veya eksik ürünlerin derhal bildirilmesi
• Yasal olmayan amaçlarla platform kullanılmaması`
    },
    {
      icon: FaBan,
      title: '3. Yasaklanan Davranışlar',
      content: `Aşağıdaki davranışlar kesinlikle yasaktır ve üyelik iptaline neden olabilir:

• Sahte veya yanıltıcı bilgi sağlamak
• Başkalarının hesaplarına yetkisiz erişim
• Platform güvenliğini tehdit eden faaliyetler
• Spam veya istenmeyen içerik paylaşımı
• Dolandırıcılık veya kötü niyetli işlemler
• Telif haklarının ihlali`
    },
    {
      icon: FaExclamationTriangle,
      title: '4. Sorumluluk Reddi',
      content: `Lastik Alsana:

• Üçüncü taraf web sitelerinin içeriğinden sorumlu değildir
• Mücbir sebeplerden kaynaklanan gecikmelerden sorumlu tutulamaz
• Ürün stok durumunu garanti etmez
• Fiyat ve kampanya değişikliği hakkını saklı tutar
• Sistem bakımı nedeniyle hizmet kesintisi yapabilir`
    },
    {
      icon: FaGavel,
      title: '5. Uyuşmazlık Çözümü',
      content: `Bu sözleşmeden doğabilecek uyuşmazlıklarda:

• Türkiye Cumhuriyeti kanunları geçerlidir
• Gaziantep Mahkemeleri ve İcra Daireleri yetkilidir
• Öncelikle dostane çözüm yolları aranacaktır
• Tüketici hakları saklıdır`
    }
  ];

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-2xl mb-6">
              <FaFileContract className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Üyelik Sözleşmesi</h1>
            <p className="text-gray-300 text-lg">
              Platformumuzu kullanım koşulları
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Intro */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Genel Hükümler</h2>
            <p className="text-gray-600 leading-relaxed">
              Bu Üyelik Sözleşmesi, Lastik Alsana Limited Şirketi ("Lastik Alsana") ile platformumuza 
              üye olan kullanıcılar ("Üye") arasındaki hak ve yükümlülükleri düzenlemektedir. 
              Üyelik işlemini tamamlayarak bu sözleşme hükümlerini kabul etmiş sayılırsınız.
            </p>
          </div>

          {/* Sections */}
          {sections.map((section, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 md:p-8 shadow-sm mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <section.icon className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">{section.title}</h2>
              </div>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{section.content}</p>
            </div>
          ))}

          {/* Membership Termination */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">6. Üyelik İptali</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Üyeler, istedikleri zaman üyeliklerini sonlandırabilir. Üyelik iptali için:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                Hesap ayarlarından üyelik iptal talebinde bulunabilirsiniz
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                E-posta ile iptal talebinizi iletebilirsiniz
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                Açık siparişleriniz varsa önce bunların tamamlanması gerekir
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                İptal sonrası verileriniz yasal süre boyunca saklanır
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
            <h3 className="font-semibold text-blue-800 mb-2">İletişim</h3>
            <p className="text-blue-700 text-sm leading-relaxed">
              Üyelik sözleşmesi hakkında sorularınız için <strong>info@lastikalsana.com</strong> adresinden 
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

