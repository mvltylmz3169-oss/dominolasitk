'use client';

import { isAdminAuthenticated } from '@/lib/adminAuth';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  HiOutlineHome,
  HiOutlineChevronLeft,
  HiOutlineDesktopComputer,
  HiOutlineDeviceMobile,
  HiOutlineGlobe,
  HiOutlineLocationMarker,
  HiOutlineEye,
  HiOutlineClock,
  HiOutlineUsers,
  HiOutlineRefresh,
} from 'react-icons/hi';
import { getVisitorHistory } from '@/lib/visitorService';

// ─── Basit Bar Chart (SVG) ───────────────────────────────────────────────────
function BarChart({ data, color = '#6366f1', height = 80 }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex items-end gap-1 h-20">
      {data.map((d, i) => (
        <div key={i} className="flex flex-col items-center flex-1 gap-1">
          <div
            className="w-full rounded-sm transition-all duration-500"
            style={{
              height: `${(d.value / max) * height}px`,
              backgroundColor: color,
              opacity: 0.85,
              minHeight: d.value > 0 ? 4 : 0,
            }}
            title={`${d.label}: ${d.value}`}
          />
          <span className="text-[9px] text-gray-500 truncate w-full text-center">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Donut Chart (SVG) ────────────────────────────────────────────────────────
function DonutChart({ segments, size = 80 }) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  if (total === 0) return <div className="text-gray-500 text-xs text-center">Veri yok</div>;

  const r = 28;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;

  let offset = 0;
  const arcs = segments.map(seg => {
    const pct = seg.value / total;
    const dash = pct * circumference;
    const arc = { ...seg, dash, offset };
    offset += dash;
    return arc;
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#374151" strokeWidth="10" />
      {arcs.map((arc, i) => (
        <circle
          key={i}
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={arc.color}
          strokeWidth="10"
          strokeDasharray={`${arc.dash} ${circumference - arc.dash}`}
          strokeDashoffset={-arc.offset}
          strokeLinecap="butt"
          style={{ transform: 'rotate(-90deg)', transformOrigin: `${cx}px ${cy}px` }}
        />
      ))}
      <text x={cx} y={cy + 4} textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">
        {total}
      </text>
    </svg>
  );
}

export default function AnalyticsPage() {
  const router = useRouter();
  const [visitors, setVisitors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('24h');

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      router.push('/admin');
      return;
    }
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const data = await getVisitorHistory();
    setVisitors(data);
    setIsLoading(false);
  };

  // ─── Filtreleme ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const now = new Date();
    const hours = timeRange === '1h' ? 1 : timeRange === '6h' ? 6 : timeRange === '24h' ? 24 : 168;
    const cutoff = new Date(now.getTime() - hours * 60 * 60 * 1000);
    return visitors.filter(v => {
      const t = v.enteredAt?.toDate ? v.enteredAt.toDate() : new Date(v.enteredAt);
      return t >= cutoff;
    });
  }, [visitors, timeRange]);

  // ─── Hesaplamalar ─────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const total = filtered.length;
    const mobile = filtered.filter(v => v.device === 'Mobil' || v.device === 'Tablet').length;
    const desktop = filtered.filter(v => v.device === 'Masaüstü').length;
    const direct = filtered.filter(v => !v.referrer || v.referrer === 'Doğrudan').length;

    // Page counts
    const pageCounts = {};
    filtered.forEach(v => {
      const page = v.currentPage || '/';
      pageCounts[page] = (pageCounts[page] || 0) + 1;
    });
    const topPages = Object.entries(pageCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([path, count]) => ({ path, count }));

    // Hourly chart (last 24 hours)
    const hourlyMap = {};
    for (let i = 23; i >= 0; i--) {
      const d = new Date();
      d.setHours(d.getHours() - i, 0, 0, 0);
      const key = `${d.getHours()}:00`;
      hourlyMap[key] = 0;
    }
    filtered.forEach(v => {
      const t = v.enteredAt?.toDate ? v.enteredAt.toDate() : new Date(v.enteredAt);
      const key = `${t.getHours()}:00`;
      if (hourlyMap[key] !== undefined) hourlyMap[key]++;
    });
    const hourlyData = Object.entries(hourlyMap).map(([label, value]) => ({ label, value }));

    // OS breakdown
    const osCounts = {};
    filtered.forEach(v => { if (v.os) osCounts[v.os] = (osCounts[v.os] || 0) + 1; });
    const osList = Object.entries(osCounts).sort((a, b) => b[1] - a[1]);

    // Browser breakdown
    const browserCounts = {};
    filtered.forEach(v => { if (v.browser) browserCounts[v.browser] = (browserCounts[v.browser] || 0) + 1; });
    const browserList = Object.entries(browserCounts).sort((a, b) => b[1] - a[1]);

    // City breakdown
    const cityCounts = {};
    filtered.forEach(v => { if (v.city && v.city !== 'Yükleniyor...' && v.city !== 'Bilinmiyor') cityCounts[v.city] = (cityCounts[v.city] || 0) + 1; });
    const cityList = Object.entries(cityCounts).sort((a, b) => b[1] - a[1]).slice(0, 6);

    return { total, mobile, desktop, direct, topPages, hourlyData, osList, browserList, cityList };
  }, [filtered]);

  const deviceSegments = [
    { label: 'Masaüstü', value: stats.desktop, color: '#6366f1' },
    { label: 'Mobil/Tablet', value: stats.mobile, color: '#10b981' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard" className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl transition-colors">
              <HiOutlineChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium hidden sm:inline">Dashboard</span>
            </Link>
            <Link href="/" className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl transition-colors">
              <HiOutlineHome className="w-5 h-5" />
              <span className="text-sm font-medium hidden sm:inline">Siteye Dön</span>
            </Link>
            <div className="w-px h-8 bg-gray-700 hidden sm:block" />
            <h1 className="font-bold text-white text-lg">Müşteri Analizi</h1>
          </div>
          <button
            onClick={loadData}
            className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl transition-colors"
          >
            <HiOutlineRefresh className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="text-sm hidden sm:inline">Yenile</span>
          </button>
        </div>
      </header>

      <main className="pt-20 pb-10 px-4">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Time Range Selector */}
          <div className="flex gap-2 flex-wrap">
            {[
              { key: '1h', label: 'Son 1 Saat' },
              { key: '6h', label: 'Son 6 Saat' },
              { key: '24h', label: 'Son 24 Saat' },
              { key: '7d', label: 'Son 7 Gün' },
            ].map(opt => (
              <button
                key={opt.key}
                onClick={() => setTimeRange(opt.key)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  timeRange === opt.key
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                    : 'bg-gray-800/60 text-gray-400 hover:bg-gray-700/60 border border-gray-700/50'
                }`}
              >
                {opt.label}
              </button>
            ))}
            <span className="ml-auto self-center text-xs text-gray-500">
              Toplam kayıt: {visitors.length}
            </span>
          </div>

          {/* Ana İstatistik Kartları */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: HiOutlineUsers, label: 'Toplam Ziyaretçi', value: stats.total, color: 'text-indigo-400', bg: 'bg-indigo-500/20', border: 'border-indigo-500/30' },
                  { icon: HiOutlineDesktopComputer, label: 'Masaüstü', value: stats.desktop, color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30' },
                  { icon: HiOutlineDeviceMobile, label: 'Mobil / Tablet', value: stats.mobile, color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30' },
                  { icon: HiOutlineGlobe, label: 'Direkt Giriş', value: stats.direct, color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/30' },
                ].map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className={`p-5 rounded-2xl border ${s.bg} ${s.border} backdrop-blur-sm`}
                  >
                    <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                      <s.icon className={`w-5 h-5 ${s.color}`} />
                    </div>
                    <p className="text-3xl font-bold text-white">{s.value}</p>
                    <p className={`text-sm mt-1 ${s.color}`}>{s.label}</p>
                    {stats.total > 0 && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        %{Math.round((s.value / stats.total) * 100)}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Saatlik Grafik */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-6 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl"
              >
                <div className="flex items-center gap-2 mb-5">
                  <HiOutlineClock className="w-5 h-5 text-indigo-400" />
                  <h2 className="font-semibold text-white">Saatlik Ziyaretçi Dağılımı</h2>
                </div>
                <BarChart data={stats.hourlyData} color="#6366f1" height={80} />
              </motion.div>

              {/* Cihaz Pasta + En Çok Ziyaret Edilen Sayfalar */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Cihaz Dağılımı */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="p-6 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl"
                >
                  <div className="flex items-center gap-2 mb-5">
                    <HiOutlineDesktopComputer className="w-5 h-5 text-blue-400" />
                    <h2 className="font-semibold text-white">Cihaz Türü</h2>
                  </div>
                  <div className="flex items-center gap-6">
                    <DonutChart segments={deviceSegments} size={90} />
                    <div className="space-y-2 flex-1">
                      {deviceSegments.map((s, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                            <span className="text-sm text-gray-300">{s.label}</span>
                          </div>
                          <span className="text-sm font-bold text-white">{s.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* OS & Browser */}
                  <div className="mt-4 pt-4 border-t border-gray-700/50 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">İşletim Sistemi</p>
                      {stats.osList.slice(0, 5).map(([os, count]) => (
                        <div key={os} className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-400 truncate">{os}</span>
                          <span className="text-xs font-semibold text-white ml-2">{count}</span>
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Tarayıcı</p>
                      {stats.browserList.slice(0, 5).map(([br, count]) => (
                        <div key={br} className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-400 truncate">{br}</span>
                          <span className="text-xs font-semibold text-white ml-2">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* En Çok Ziyaret Edilen Sayfalar */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="p-6 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl"
                >
                  <div className="flex items-center gap-2 mb-5">
                    <HiOutlineEye className="w-5 h-5 text-emerald-400" />
                    <h2 className="font-semibold text-white">En Çok Ziyaret Edilen Sayfalar</h2>
                  </div>
                  {stats.topPages.length === 0 ? (
                    <p className="text-gray-500 text-sm">Veri yok</p>
                  ) : (
                    <div className="space-y-2">
                      {stats.topPages.map(({ path, count }, i) => {
                        const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                        return (
                          <div key={i}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-gray-300 font-mono truncate max-w-[70%]">{path}</span>
                              <span className="text-xs font-bold text-white">{count} <span className="text-gray-500 font-normal">(%{pct})</span></span>
                            </div>
                            <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Şehir Dağılımı */}
              {stats.cityList.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  className="p-6 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl"
                >
                  <div className="flex items-center gap-2 mb-5">
                    <HiOutlineLocationMarker className="w-5 h-5 text-rose-400" />
                    <h2 className="font-semibold text-white">Şehir Dağılımı</h2>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {stats.cityList.map(([city, count], i) => (
                      <div key={i} className="p-3 bg-gray-700/50 rounded-xl text-center border border-gray-600/50">
                        <p className="text-xl font-bold text-white">{count}</p>
                        <p className="text-xs text-gray-400 mt-0.5 truncate">{city}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Son Ziyaretçiler Listesi */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="p-6 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl"
              >
                <div className="flex items-center gap-2 mb-5">
                  <HiOutlineClock className="w-5 h-5 text-amber-400" />
                  <h2 className="font-semibold text-white">Son Ziyaretçiler</h2>
                  <span className="ml-auto text-xs text-gray-500">{filtered.length} kayıt</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-gray-500 border-b border-gray-700/50">
                        <th className="pb-3 pr-4">Cihaz</th>
                        <th className="pb-3 pr-4">Tarayıcı / OS</th>
                        <th className="pb-3 pr-4">Sayfa</th>
                        <th className="pb-3 pr-4">Şehir</th>
                        <th className="pb-3">Giriş</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/30">
                      {filtered.slice(0, 20).map((v, i) => {
                        const t = v.enteredAt?.toDate ? v.enteredAt.toDate() : new Date(v.enteredAt);
                        return (
                          <tr key={i} className="hover:bg-gray-700/20 transition-colors">
                            <td className="py-2 pr-4">
                              <div className="flex items-center gap-1.5">
                                {v.device === 'Masaüstü'
                                  ? <HiOutlineDesktopComputer className="w-4 h-4 text-blue-400" />
                                  : <HiOutlineDeviceMobile className="w-4 h-4 text-emerald-400" />}
                                <span className="text-gray-300">{v.device}</span>
                              </div>
                            </td>
                            <td className="py-2 pr-4 text-gray-400 text-xs">{v.browser} / {v.os}</td>
                            <td className="py-2 pr-4 font-mono text-xs text-indigo-300 max-w-[140px] truncate">{v.currentPage || '/'}</td>
                            <td className="py-2 pr-4 text-gray-400 text-xs">{v.city !== 'Yükleniyor...' ? v.city : '-'}</td>
                            <td className="py-2 text-xs text-gray-500">
                              {t.toLocaleString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {filtered.length > 20 && (
                    <p className="text-center text-xs text-gray-500 mt-4">
                      +{filtered.length - 20} kayıt daha (ilk 20 gösteriliyor)
                    </p>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
