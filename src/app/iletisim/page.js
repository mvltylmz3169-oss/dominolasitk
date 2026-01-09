'use client';

import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaClock, FaBuilding } from 'react-icons/fa';
import Footer from '@/components/Footer';

export default function IletisimPage() {
  const phoneNumber = '905549948989';
  const whatsappUrl = `https://wa.me/${phoneNumber}`;

  const contactInfo = [
    {
      icon: FaPhone,
      title: 'Telefon',
      value: '+90 554 994 89 89',
      link: 'tel:+905549948989',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: FaWhatsapp,
      title: 'WhatsApp',
      value: '+90 554 994 89 89',
      link: whatsappUrl,
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: FaEnvelope,
      title: 'E-posta',
      value: 'info@lastikalsana.com',
      link: 'mailto:info@lastikalsana.com',
      color: 'bg-red-100 text-red-600'
    },
    {
      icon: FaClock,
      title: 'Çalışma Saatleri',
      value: 'Pzt-Cmt: 09:00 - 18:00',
      link: null,
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-2xl mb-6">
              <FaPhone className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">İletişim</h1>
            <p className="text-gray-300 text-lg">
              Bizimle her zaman iletişime geçebilirsiniz.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {contactInfo.map((item, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm">
                {item.link ? (
                  <a href={item.link} target={item.link.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer" className="flex items-center gap-4 group">
                    <div className={`w-14 h-14 ${item.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <item.icon className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">{item.title}</div>
                      <div className="font-semibold text-gray-800 group-hover:text-red-600 transition-colors">{item.value}</div>
                    </div>
                  </a>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 ${item.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <item.icon className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">{item.title}</div>
                      <div className="font-semibold text-gray-800">{item.value}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* WhatsApp CTA */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl p-6 shadow-lg shadow-green-500/20 mb-8 transition-all hover:shadow-xl hover:shadow-green-500/30"
          >
            <div className="flex items-center justify-center gap-4">
              <FaWhatsapp className="w-10 h-10" />
              <div>
                <div className="text-lg font-bold">WhatsApp ile Hızlı İletişim</div>
                <div className="text-green-100 text-sm">7/24 Mesaj Atabilirsiniz</div>
              </div>
            </div>
          </a>

          {/* Address */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <FaMapMarkerAlt className="text-red-500" />
              Adres Bilgileri
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FaBuilding className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Merkez Ofis</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Lastik Alsana Limited Şirketi<br />
                    Gaziantep, Türkiye
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
            <h3 className="font-semibold text-blue-800 mb-2">Bilgilendirme</h3>
            <p className="text-blue-700 text-sm leading-relaxed">
              Müşteri hizmetlerimiz Pazartesi - Cumartesi günleri 09:00 - 18:00 saatleri arasında hizmet vermektedir. 
              Mesai saatleri dışında WhatsApp üzerinden mesaj bırakabilirsiniz, en kısa sürede size dönüş yapılacaktır.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

