'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaWhatsapp, FaShieldAlt, FaBuilding, FaHeadset, FaFileContract } from 'react-icons/fa';
import footerlogo1 from '../assets/footerlogo1.webp';
import footerlogo2 from '../assets/footerlogo2.webp';
import maliyeLogo from '../assets/maliye.png';
import manisaLogo from '../assets/manisa.png';


export default function Footer() {
  const phoneNumber = '905533788148'; // WhatsApp numarası (başında 90 ile)
  const whatsappUrl = `https://wa.me/${phoneNumber}`;

  const footerSections = [
    {
      title: 'Kurumsal',
      icon: FaBuilding,
      links: [
        { name: 'Hakkımızda', href: '/hakkimizda' },
        { name: 'İletişim', href: '/iletisim' },
        { name: 'İnsan Kaynakları', href: '/insan-kaynaklari' },
        { name: 'İş Birliği', href: '/is-birligi' },
      ]
    },
    {
      title: 'Müşteri Hizmetleri',
      icon: FaHeadset,
      links: [
        { name: 'Gizlilik Politikası', href: '/gizlilik-politikasi' },
        { name: 'Üyelik Sözleşmesi', href: '/uyelik-sozlesmesi' },
        { name: 'Sıkça Sorulan Sorular', href: '/sss' },
      ]
    },
    {
      title: 'Şirket',
      icon: FaFileContract,
      links: [
        { name: 'Mesafeli Satış Sözleşmesi', href: '/mesafeli-satis-sozlesmesi' },
        { name: 'Kişisel Veri Aydınlatma', href: '/kisisel-veri-aydinlatma' },
        { name: 'İptal ve İade Politikası', href: '/iptal-ve-iade' },
        { name: 'Çerez Politikası', href: '/cerez-politikasi' },
      ]
    }
  ];

  return (
    <footer className='w-full bg-gray-50'>
      {/* Upper Footer - Quick Links & Certifications */}
      <div className='w-full bg-gray-100 py-6 px-4'>
        <div className='max-w-4xl mx-auto'>
          {/* Quick Links */}
        

          {/* Certifications */}
          <div className='bg-white rounded-xl p-4 shadow-sm'>
            <div className='flex items-center justify-center gap-2 mb-3'>
              <FaShieldAlt className='w-5 h-5 text-green-600' />
              <h3 className='text-sm font-semibold text-gray-700'>Resmi Onaylı Kuruluş</h3>
            </div>
            
            <div className='flex items-center justify-center gap-8 mb-4'>
              <div className='flex flex-col items-center'>
                <Image 
                  src={maliyeLogo} 
                  alt="T.C. Hazine ve Maliye Bakanlığı" 
                  width={120} 
                  height={120}
                  className='object-contain'
                />
              </div>
              <div className='flex flex-col items-center'>
                <Image 
                  src={manisaLogo} 
                  alt="Gaziantep Ticaret Odası" 
                  width={120} 
                  height={120}
                  className='object-contain'
                />
              </div>
            </div>
            
            <p className='text-center text-xs text-gray-500 leading-relaxed'>
              Firmamız <span className='font-semibold'>T.C. Hazine ve Maliye Bakanlığı</span> ve <span className='font-semibold'>Gaziantep Ticaret Odası</span> tarafından 
              onaylı, tüm yasal gereklilikleri yerine getiren güvenilir bir e-ticaret platformudur.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Links Section */}
      <div className='w-full bg-slate-900 py-10 px-4'>
        <div className='max-w-4xl mx-auto'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {footerSections.map((section, index) => (
              <div key={index}>
                <div className='flex items-center gap-2 mb-4'>
                  <section.icon className='w-4 h-4 text-red-500' />
                  <h4 className='text-white font-semibold text-sm'>{section.title}</h4>
                </div>
                <ul className='space-y-2'>
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link 
                        href={link.href}
                        className='text-gray-400 text-sm hover:text-white transition-colors duration-200'
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className='w-full flex flex-col items-center pt-6 pb-10 px-4'>
       <span 
          className="text-4xl font-black tracking-tight bg-gradient-to-r from-red-600 via-red-500 to-orange-500 bg-clip-text text-transparent transform -rotate-2 inline-block"
          style={{ 
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          lastikalsana
        </span>
      <p className='text-gray-500 mt-2 text-sm mb-6'>Müşteri Hizmetleri | Çağrı Hattı</p>
      
      {/* WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-[80vw] -mt-3 max-w-ms flex items-center justify-center gap-3 px-2 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300 group"
      >
        <FaWhatsapp className="w-6 h-6 group-hover:scale-110 transition-transform" />
        <span className="text-md font-semibold tracking-wide">+90 553 378 81 48</span>
      </a>
      
      {/* Working Hours */}
      <p className="mt-3 text-xs text-gray-500">
        Pazartesi - Cumartesi | 09.00 - 18.00
      </p>
    
      <Image className='mt-4' src={footerlogo1} alt="Logo" width={220}  />
    
      <Image className='mt-4' src={footerlogo2} alt="Logo" width={140}  />
         <p className='text-center text-[13px] text-gray-500 mt-4'>
          <span className='font-bold' > Lastik Alsana Limited Şirketi,</span> araç sahiplerine yönelik, kış lastikleri, yaz lastikleri, dört mevsim lastikler, jantlar, motor yağları ve ağır vasıta lastikleri gibi ürünlerde uzmanlaşmış güvenilir bir e-ticaret platformudur. Kurulduğu günden itibaren müşterilerine hem güvenli hem de sorunsuz bir alışveriş deneyimi sunmak için modern altyapılar ve yüksek güvenlik standartlarıyla hizmet vermektedir.
         </p>
         <p className='text-center text-[13px] text-gray-500 mt-4'> <span className='font-bold' >  lastikalsana.com </span> üzerinden yapacağınız alışverişlerde kredi kartı bilgileriniz yalnızca ödeme işlemi sırasında kullanılır ve kesinlikle veri tabanında saklanmaz. Böylece ödeme bilgileriniz üçüncü tarafların erişimine karşı tamamen güvence altındadır.</p>
         <p className='text-center text-[13px] text-gray-500 mt-4'>Sitemizde gerçekleştirilen tüm işlemlerin gerçekten  <span className='font-bold' >  lastikalsana.com </span> sunucularına iletildiğini garanti altına almak için gelişmiş  <span className='font-bold' >  256 bit SSL sertifikası </span>  kullanılmaktadır. Bu teknoloji sayesinde aktardığınız tüm kişisel veriler şifrelenerek güvenli bir şekilde işlenir ve yetkisiz erişimlere karşı korunur.</p>
         <p className='text-center text-[13px] text-gray-500 mt-4'>Lastik Alsana, kullanıcı güvenliğini temel ilke olarak benimser. Hem teknik altyapımızı hem de veri koruma sistemlerimizi düzenli olarak güncelleyerek güvenli alışveriş ortamını daima en üst seviyede tutarız. Amacımız; müşterilerimize hızlı, modern, şeffaf ve güven veren bir alışveriş deneyimi sunmak, satın aldığınız her ürünü sorunsuz şekilde size ulaştırmaktır.</p>
         <p className='text-center text-[13px] text-gray-500 mt-4'>Lastik Alsana olarak, güvenli alışverişin standartlarını yükseltmeye ve kullanıcılarımıza her zaman konforlu bir deneyim sunmaya devam ediyoruz.</p>
  
  <div className='w-full mt-4 text-xs bg-black text-white p-3 rounded-md text-center'> ©2014-2025  Lastik Alsana "Lastik Alsana Limited Şirketi" KURULUŞUDUR.</div>
      </div>
    </footer>
  );
}
