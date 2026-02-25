'use client';

import { useState } from 'react';
import { FaQuestionCircle, FaChevronDown, FaChevronUp, FaTruck, FaCreditCard, FaUndo, FaHeadset } from 'react-icons/fa';
import Footer from '@/components/Footer';

export default function SSSPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqCategories = [
    {
      icon: FaTruck,
      title: 'Kargo ve Teslimat',
      questions: [
        {
          q: 'Siparişim ne zaman kargoya verilir?',
          a: 'Siparişleriniz, ödeme onayından sonra 1-2 iş günü içinde kargoya teslim edilmektedir. Hafta sonu ve resmi tatillerde kargo teslimatı yapılmamaktadır.'
        },
        {
          q: 'Kargo ücreti ne kadar?',
          a: 'Belirli tutarın üzerindeki siparişlerde kargo ücretsizdir. Aksi halde kargo ücreti ödeme sayfasında belirtilmektedir.'
        },
        {
          q: 'Siparişimi nasıl takip edebilirim?',
          a: 'Siparişiniz kargoya verildikten sonra tarafınıza SMS ve e-posta ile kargo takip numarası gönderilmektedir. Bu numara ile kargo firmasının web sitesinden takip yapabilirsiniz.'
        },
        {
          q: 'Hangi kargo firmaları ile çalışıyorsunuz?',
          a: 'Yurtiçi Kargo, Sürat Kargo, Aras Kargo ve PTT Kargo ile çalışmaktayız. Teslimat bölgenize göre en uygun kargo firması seçilmektedir.'
        }
      ]
    },
    {
      icon: FaCreditCard,
      title: 'Ödeme',
      questions: [
        {
          q: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?',
          a: 'Kredi kartı, banka kartı, havale/EFT ve kapıda ödeme seçenekleri ile ödeme yapabilirsiniz. Kredi kartı ile taksitli ödeme imkanı da sunulmaktadır.'
        },
        {
          q: 'Kredi kartı bilgilerim güvende mi?',
          a: 'Evet, tamamen güvende. 256-bit SSL şifreleme teknolojisi kullanıyoruz ve kredi kartı bilgileriniz hiçbir şekilde veri tabanımızda saklanmıyor.'
        },
        {
          q: 'Taksit seçenekleri nelerdir?',
          a: 'Anlaşmalı bankalar ile 2, 3, 6 ve 9 taksit seçenekleri sunulmaktadır. Güncel taksit seçenekleri ödeme sayfasında görüntülenmektedir.'
        },
        {
          q: 'Fatura bilgilerimi nasıl güncelleyebilirim?',
          a: 'Sipariş vermeden önce hesabınızdan fatura bilgilerinizi güncelleyebilirsiniz. Sipariş tamamlandıktan sonra fatura bilgisi değişikliği için müşteri hizmetleri ile iletişime geçmeniz gerekmektedir.'
        }
      ]
    },
    {
      icon: FaUndo,
      title: 'İade ve Değişim',
      questions: [
        {
          q: 'Ürün iadesi nasıl yapılır?',
          a: 'Ürününüzü teslim aldıktan sonra 14 gün içinde iade edebilirsiniz. İade için müşteri hizmetleri ile iletişime geçmeniz ve iade kodunuzu almanız gerekmektedir.'
        },
        {
          q: 'İade koşulları nelerdir?',
          a: 'Ürünün kullanılmamış, orijinal ambalajında ve tüm aksesuarlarıyla birlikte olması gerekmektedir. Hijyen ürünleri ve özel sipariş ürünleri iade edilemez.'
        },
        {
          q: 'İade kargo ücreti kime ait?',
          a: 'Ürün hasarlı veya hatalı geldiğinde kargo ücreti bize aittir. Müşteri kaynaklı iadelerde kargo ücreti müşteriye aittir.'
        },
        {
          q: 'İade tutarı ne zaman yatırılır?',
          a: 'İade edilen ürün tarafımıza ulaştıktan sonra kontrol edilir ve 3-5 iş günü içinde ödeme iadesi yapılır. Kredi kartı iadelerinde bankanıza bağlı olarak 7-14 gün sürebilir.'
        }
      ]
    },
    {
      icon: FaHeadset,
      title: 'Genel',
      questions: [
        {
          q: 'Müşteri hizmetlerine nasıl ulaşabilirim?',
          a: 'WhatsApp hattımız +90 553 378 81 48 veya info@lastikalsana.com e-posta adresimiz üzerinden bize ulaşabilirsiniz. Çalışma saatlerimiz Pazartesi-Cumartesi 09:00-18:00\'dır.'
        },
        {
          q: 'Ürünler orijinal mi?',
          a: 'Evet, platformumuzda satılan tüm ürünler %100 orijinal ve garantilidir. Yetkili distribütörlerden temin edilen ürünleri satıyoruz.'
        },
        {
          q: 'Üyelik şart mı?',
          a: 'Hayır, üye olmadan da alışveriş yapabilirsiniz. Ancak üye olarak sipariş geçmişinizi takip edebilir, favorilerinizi kaydedebilir ve özel kampanyalardan haberdar olabilirsiniz.'
        },
        {
          q: 'Şifremi unuttum, ne yapmalıyım?',
          a: 'Giriş sayfasındaki "Şifremi Unuttum" bağlantısına tıklayarak e-posta adresinize şifre sıfırlama linki gönderilmesini sağlayabilirsiniz.'
        }
      ]
    }
  ];

  const toggleQuestion = (categoryIndex, questionIndex) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setOpenIndex(openIndex === key ? null : key);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-2xl mb-6">
              <FaQuestionCircle className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Sıkça Sorulan Sorular</h1>
            <p className="text-gray-300 text-lg">
              Merak ettiğiniz soruların cevapları burada!
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          {faqCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <category.icon className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">{category.title}</h2>
              </div>

              <div className="space-y-3">
                {category.questions.map((item, questionIndex) => {
                  const key = `${categoryIndex}-${questionIndex}`;
                  const isOpen = openIndex === key;

                  return (
                    <div key={questionIndex} className="bg-white rounded-xl shadow-sm overflow-hidden">
                      <button
                        onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-gray-800 pr-4">{item.q}</span>
                        {isOpen ? (
                          <FaChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        ) : (
                          <FaChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-4">
                          <p className="text-gray-600 leading-relaxed">{item.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Contact CTA */}
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 md:p-8 text-white text-center">
            <FaHeadset className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Sorunuz mu var?</h3>
            <p className="text-red-100 mb-4">
              Cevabını bulamadığınız sorular için bizimle iletişime geçebilirsiniz.
            </p>
            <a 
              href="https://wa.me/905533788148"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-red-600 px-6 py-3 rounded-xl font-semibold hover:bg-red-50 transition-colors"
            >
              WhatsApp ile İletişime Geç
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

