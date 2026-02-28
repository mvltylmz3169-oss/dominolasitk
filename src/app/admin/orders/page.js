'use client';

import { isAdminAuthenticated, clearAdminAuth } from '@/lib/adminAuth';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlineArrowLeft,
  HiOutlineSearch,
  HiOutlineEye,
  HiOutlineCheck,
  HiOutlineX,
  HiOutlineTrash,
  HiOutlineDocumentText,
  HiOutlineExternalLink,
  HiOutlinePhotograph,
  HiOutlinePhone,
  HiOutlineUpload,
  HiOutlineCloudUpload,
  HiOutlineShoppingCart,
  HiOutlineTrendingUp,
  HiOutlineChevronRight,
  HiOutlineChevronLeft,
  HiOutlineReceiptTax
} from 'react-icons/hi';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showReceiptModal, setShowReceiptModal] = useState(null);
  const [statusNotification, setStatusNotification] = useState(null);
  const [uploadingOrderId, setUploadingOrderId] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showTaxModal, setShowTaxModal] = useState(null);
  const [taxInput, setTaxInput] = useState('');
  const [taxNote, setTaxNote] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Siparişteki toplam vergiyi hesapla
  const getTotalTax = (order) => {
    if (order.taxEntries && Array.isArray(order.taxEntries)) {
      return order.taxEntries.reduce((sum, entry) => sum + (entry.amount || 0), 0);
    }
    return order.taxAmount || 0;
  };

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      router.push('/admin');
      return;
    }

    const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(ordersData);
      setFilteredOrders(ordersData);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    let filtered = [...orders];
    
    if (searchQuery) {
      filtered = filtered.filter(o => 
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customer?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customer?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customer?.phone?.includes(searchQuery)
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(o => o.status === statusFilter);
    }
    
    setFilteredOrders(filtered);
  }, [searchQuery, statusFilter, orders]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '-';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('tr-TR', { 
      day: 'numeric', 
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
      
      // selectedOrder'ı da güncelle
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      }
      
      // Bildirim göster
      setStatusNotification({
        status: newStatus,
        message: `Sipariş durumu "${statusLabels[newStatus]}" olarak güncellendi`
      });
      
      // 3 saniye sonra bildirimi kapat
      setTimeout(() => {
        setStatusNotification(null);
      }, 3000);
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  // Arandı durumunu güncelle
  const toggleCalledStatus = async (orderId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await updateDoc(doc(db, 'orders', orderId), { called: newStatus });
      
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, called: newStatus }));
      }
      
      setStatusNotification({
        status: newStatus ? 'completed' : 'pending',
        message: newStatus ? 'Müşteri arandı olarak işaretlendi' : 'Arandı işareti kaldırıldı'
      });
      
      setTimeout(() => setStatusNotification(null), 3000);
    } catch (error) {
      console.error('Error updating called status:', error);
    }
  };

  // Yeni vergi girişi ekle
  const addTaxEntry = async (orderId, amount, note = '') => {
    try {
      const taxValue = parseFloat(amount) || 0;
      if (taxValue <= 0) return;

      const order = orders.find(o => o.id === orderId);
      const existingEntries = order?.taxEntries || [];
      
      const newEntry = {
        id: Date.now().toString(),
        amount: taxValue,
        note: note || `Vergi #${existingEntries.length + 1}`,
        createdAt: new Date().toISOString()
      };
      
      const updatedEntries = [...existingEntries, newEntry];
      
      await updateDoc(doc(db, 'orders', orderId), { 
        taxEntries: updatedEntries,
        taxAmount: updatedEntries.reduce((sum, e) => sum + e.amount, 0) // Eski sistem uyumluluğu
      });
      
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => ({ 
          ...prev, 
          taxEntries: updatedEntries,
          taxAmount: updatedEntries.reduce((sum, e) => sum + e.amount, 0)
        }));
      }
      
      setShowTaxModal(null);
      setTaxInput('');
      setTaxNote('');
      
      setStatusNotification({
        status: 'completed',
        message: `${formatPrice(taxValue)} vergi eklendi`
      });
      
      setTimeout(() => setStatusNotification(null), 3000);
    } catch (error) {
      console.error('Error adding tax entry:', error);
    }
  };

  // Vergi girişi sil
  const deleteTaxEntry = async (orderId, entryId) => {
    try {
      const order = orders.find(o => o.id === orderId);
      const existingEntries = order?.taxEntries || [];
      const updatedEntries = existingEntries.filter(e => e.id !== entryId);
      
      await updateDoc(doc(db, 'orders', orderId), { 
        taxEntries: updatedEntries,
        taxAmount: updatedEntries.reduce((sum, e) => sum + e.amount, 0)
      });
      
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => ({ 
          ...prev, 
          taxEntries: updatedEntries,
          taxAmount: updatedEntries.reduce((sum, e) => sum + e.amount, 0)
        }));
      }
      
      setStatusNotification({
        status: 'cancelled',
        message: 'Vergi girişi silindi'
      });
      
      setTimeout(() => setStatusNotification(null), 3000);
    } catch (error) {
      console.error('Error deleting tax entry:', error);
    }
  };

  const deleteOrder = async (orderId) => {
    if (!confirm('Bu siparişi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) {
      return;
    }
    try {
      await deleteDoc(doc(db, 'orders', orderId));
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Sipariş silinirken bir hata oluştu.');
    }
  };

  // Admin tarafından dekont yükleme
  const handleAdminReceiptUpload = async (orderId, file) => {
    if (!file) return;
    
    setUploadingOrderId(orderId);
    setUploadProgress(0);
    
    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Upload to Firebase Storage
      const fileName = `receipts/${orderId}_admin_${Date.now()}_${file.name}`;
      const fileRef = ref(storage, fileName);
      await uploadBytes(fileRef, file);
      const receiptUrl = await getDownloadURL(fileRef);
      
      // Update order with receipt URL
      await updateDoc(doc(db, 'orders', orderId), {
        receiptUrl: receiptUrl,
        paymentStatus: 'pending_verification',
        receiptUploadedAt: serverTimestamp(),
        receiptUploadedBy: 'admin'
      });

      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Show success notification
      setStatusNotification({
        status: 'completed',
        message: 'Dekont başarıyla yüklendi!'
      });
      
      setTimeout(() => {
        setStatusNotification(null);
        setUploadingOrderId(null);
        setUploadProgress(0);
      }, 2000);
      
    } catch (error) {
      console.error('Error uploading receipt:', error);
      alert('Dekont yüklenirken bir hata oluştu.');
      setUploadingOrderId(null);
      setUploadProgress(0);
    }
  };

  const statusColors = {
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
    processing: 'bg-blue-100 text-blue-700 border-blue-200',
    shipped: 'bg-purple-100 text-purple-700 border-purple-200',
    completed: 'bg-green-100 text-green-700 border-green-200',
    cancelled: 'bg-red-100 text-red-700 border-red-200'
  };

  const statusLabels = {
    pending: 'Beklemede',
    processing: 'İşleniyor',
    shipped: 'Hazırlanıyor',
    completed: 'Tamamlandı',
    cancelled: 'İptal'
  };

  // Product sales aggregation
  const productSalesData = useMemo(() => {
    const productMap = new Map();
    
    orders.forEach(order => {
      order.items?.forEach(item => {
        const productKey = item.name;
        const existing = productMap.get(productKey) || {
          name: item.name,
          image: item.image,
          completed: 0,
          pending: 0,
          processing: 0,
          shipped: 0,
          cancelled: 0,
          total: 0
        };
        
        existing[order.status] = (existing[order.status] || 0) + item.quantity;
        existing.total += item.quantity;
        
        productMap.set(productKey, existing);
      });
    });
    
    // Sort by total quantity (most sold first)
    return Array.from(productMap.values()).sort((a, b) => b.total - a.total);
  }, [orders]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
              <HiOutlineArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <span className="font-bold text-gray-900">Siparişler</span>
          </div>
          <span className="text-sm text-gray-500">{orders.length} sipariş</span>
        </div>
      </header>

      <main className="pt-20 pb-8 px-4">
        <div className="max-w-[1920px] mx-auto flex gap-6">
          {/* Main Content - Orders List */}
          <div className="flex-1 min-w-0">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            {[
              { label: 'Toplam', count: orders.length, color: 'bg-gray-100 text-gray-700' },
              { label: 'Beklemede', count: orders.filter(o => o.status === 'pending').length, color: 'bg-amber-100 text-amber-700' },
              { label: 'İşleniyor', count: orders.filter(o => o.status === 'processing').length, color: 'bg-blue-100 text-blue-700' },
              { label: 'Hazırlanıyor', count: orders.filter(o => o.status === 'shipped').length, color: 'bg-purple-100 text-purple-700' },
              { label: 'Tamamlandı', count: orders.filter(o => o.status === 'completed').length, color: 'bg-green-100 text-green-700' },
            ].map((stat) => (
              <div key={stat.label} className={`p-3 rounded-xl ${stat.color}`}>
                <p className="text-2xl font-bold">{stat.count}</p>
                <p className="text-xs font-medium">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6 space-y-4">
            <div className="relative">
              <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Sipariş ID, müşteri adı veya telefon ara..."
                className="w-full h-12 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto hide-scrollbar">
              {['all', 'pending', 'processing', 'shipped', 'completed', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    statusFilter === status 
                      ? 'bg-gray-900 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status === 'all' ? 'Tümü' : statusLabels[status]}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List - Compact Rows */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500">Yükleniyor...</p>
            </div>
          ) : filteredOrders.length > 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              {filteredOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.01 }}
                  className={`flex items-center gap-4 px-4 py-2.5 hover:bg-blue-50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/70'
                  }`}
                >
                  {/* Order Number */}
                  <span className="text-xs font-mono text-gray-400 w-[80px]">#{order.orderNumber || order.id.slice(0, 6).toUpperCase()}</span>
                  
                  {/* Status */}
                  <div className="w-[90px]">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColors[order.status] || statusColors.pending}`}>
                      {statusLabels[order.status] || 'Beklemede'}
                    </span>
                  </div>

                  {/* Customer */}
                  <div className="w-[130px]">
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {order.customer?.firstName} {order.customer?.lastName}
                    </p>
                  </div>

                  {/* Phone */}
                  <p className="text-xs text-gray-400 w-[110px] hidden sm:block truncate">{order.customer?.phone}</p>

                  {/* Items Preview */}
                  <div className="w-[100px] hidden md:flex gap-1">
                    {order.items?.slice(0, 3).map((item, i) => (
                      <div key={i} className="relative w-7 h-7 rounded-md overflow-hidden bg-gray-100">
                        <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                      </div>
                    ))}
                    {order.items?.length > 3 && (
                      <div className="w-7 h-7 rounded-md bg-gray-100 flex items-center justify-center text-[9px] text-gray-500 font-medium">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>

                  {/* Date */}
                  <p className="text-[10px] text-gray-400 w-[75px] hidden lg:block">{formatDate(order.createdAt)?.split(',')[0]}</p>

                  {/* Price + Tax */}
                  <div className="w-[140px] text-right">
                    <p className="font-bold text-gray-900 text-sm">{formatPrice(order.total)}</p>
                    {getTotalTax(order) > 0 && (
                      <p className="text-[10px] text-emerald-600 font-medium">+ {formatPrice(getTotalTax(order))} vergi</p>
                    )}
                  </div>

                  {/* Spacer - pushes actions to the right */}
                  <div className="flex-1" />

                  {/* Receipt */}
                  <div className="w-8">
                    {order.receiptUrl ? (
                      <button
                        onClick={() => setShowReceiptModal(order.receiptUrl)}
                        className="w-7 h-7 flex items-center justify-center bg-emerald-100 text-emerald-600 rounded-md hover:bg-emerald-200 transition-colors"
                        title="Dekont Görüntüle"
                      >
                        <HiOutlineDocumentText className="w-4 h-4" />
                      </button>
                    ) : (
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleAdminReceiptUpload(order.id, file);
                            }
                          }}
                        />
                        {uploadingOrderId === order.id ? (
                          <div className="w-7 h-7 flex items-center justify-center bg-blue-100 text-blue-600 rounded-md">
                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                          </div>
                        ) : (
                          <div 
                            className="w-7 h-7 flex items-center justify-center bg-amber-100 text-amber-600 rounded-md hover:bg-amber-200 transition-colors"
                            title="Dekont Yükle"
                          >
                            <HiOutlineUpload className="w-4 h-4" />
                          </div>
                        )}
                      </label>
                    )}
                  </div>

                  {/* Actions - Always at far right */}
                  <div className="flex gap-1 items-center">
                    {/* Arandı Toggle Button */}
                    <button
                      onClick={() => toggleCalledStatus(order.id, order.called)}
                      className={`px-2 h-7 flex items-center justify-center rounded-md text-[10px] font-bold transition-all ${
                        order.called 
                          ? 'bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 text-white shadow-lg shadow-purple-300' 
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                      title={order.called ? 'Arandı - Tıkla kaldır' : 'Arandı olarak işaretle'}
                    >
                      📞 Arandı
                    </button>

                    {/* Vergi Gir Button */}
                    <button
                      onClick={() => {
                        setShowTaxModal(order.id);
                        setTaxInput('');
                        setTaxNote('');
                      }}
                      className={`px-2 h-7 flex items-center justify-center rounded-md text-[10px] font-medium transition-colors ${
                        getTotalTax(order) > 0 
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                          : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                      }`}
                      title="Vergi Ekle"
                    >
                      <HiOutlineReceiptTax className="w-3 h-3 mr-1" />
                      {getTotalTax(order) > 0 ? formatPrice(getTotalTax(order)) : 'Vergi'}
                    </button>

                    {/* Call Button */}
                    {order.customer?.phone && (
                      <a
                        href={`tel:${order.customer.phone}`}
                        className="w-7 h-7 flex items-center justify-center bg-green-100 text-green-600 rounded-md hover:bg-green-200 transition-colors"
                        title="Telefonu Ara"
                      >
                        <HiOutlinePhone className="w-4 h-4" />
                      </a>
                    )}
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="w-7 h-7 flex items-center justify-center bg-gray-100 rounded-md text-gray-600 hover:bg-gray-200 transition-colors"
                      title="Detay"
                    >
                      <HiOutlineEye className="w-4 h-4" />
                    </button>
                    {order.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateOrderStatus(order.id, 'processing')}
                          className="w-7 h-7 flex items-center justify-center bg-green-100 text-green-600 rounded-md hover:bg-green-200 transition-colors"
                          title="Onayla"
                        >
                          <HiOutlineCheck className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => updateOrderStatus(order.id, 'cancelled')}
                          className="w-7 h-7 flex items-center justify-center bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
                          title="İptal"
                        >
                          <HiOutlineX className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => deleteOrder(order.id)}
                      className="w-7 h-7 flex items-center justify-center bg-gray-100 text-gray-400 rounded-md hover:bg-red-100 hover:text-red-600 transition-colors"
                      title="Sil"
                    >
                      <HiOutlineTrash className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
              <p className="text-gray-400">Sipariş bulunamadı</p>
            </div>
          )}
          </div>

          {/* Product Sales Sidebar Toggle Button - Desktop Only */}
          <div className="hidden xl:block">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`fixed top-24 z-40 transition-all duration-300 ${
                sidebarOpen ? 'right-[416px]' : 'right-4'
              }`}
            >
              <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-l-xl shadow-lg hover:shadow-xl transition-shadow">
                {sidebarOpen ? (
                  <HiOutlineChevronRight className="w-5 h-5" />
                ) : (
                  <HiOutlineChevronLeft className="w-5 h-5" />
                )}
                <span className="text-sm font-medium">{sidebarOpen ? 'Kapat' : 'Satış Özeti'}</span>
                <HiOutlineTrendingUp className="w-4 h-4" />
              </div>
            </button>

            {/* Sliding Sidebar */}
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  initial={{ x: 420, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 420, opacity: 0 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed top-24 right-4 w-[400px] z-30"
                >
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden max-h-[calc(100vh-120px)]">
                    {/* Sidebar Header */}
                    <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                          <HiOutlineTrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white">Ürün Satış Özeti</h3>
                          <p className="text-xs text-white/60">{productSalesData.length} farklı ürün</p>
                        </div>
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-4 text-[10px]">
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        <span className="text-gray-500">Tamamlandı</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        <span className="text-gray-500">Beklemede</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        <span className="text-gray-500">İptal</span>
                      </div>
                    </div>

                    {/* Product List */}
                    <div className="max-h-[calc(100vh-320px)] overflow-y-auto">
                      {productSalesData.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                          {productSalesData.map((product, index) => (
                            <div 
                              key={product.name} 
                              className={`p-4 hover:bg-gray-50 transition-colors ${index === 0 ? 'bg-gradient-to-r from-amber-50 to-orange-50' : ''}`}
                            >
                              <div className="flex items-start gap-3">
                                {/* Rank Badge */}
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                                  index === 0 ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-orange-200' :
                                  index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white' :
                                  index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white' :
                                  'bg-gray-100 text-gray-500'
                                }`}>
                                  {index + 1}
                                </div>

                                {/* Product Image */}
                                {product.image && (
                                  <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                                    <Image src={product.image} alt={product.name} fill className="object-cover" unoptimized />
                                  </div>
                                )}

                                {/* Product Info */}
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-gray-900 text-sm leading-tight line-clamp-2 mb-2">
                                    {product.name}
                                  </p>
                                  
                                  {/* Stats Row */}
                                  <div className="flex items-center gap-2 flex-wrap">
                                    {product.completed > 0 && (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[10px] font-medium">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                        {product.completed}
                                      </span>
                                    )}
                                    {(product.pending + product.processing + product.shipped) > 0 && (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-[10px] font-medium">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                        {product.pending + product.processing + product.shipped}
                                      </span>
                                    )}
                                    {product.cancelled > 0 && (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-[10px] font-medium">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                        {product.cancelled}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Total Badge */}
                                <div className="flex-shrink-0 text-right">
                                  <div className={`inline-flex items-center justify-center min-w-[40px] px-2 py-1 rounded-lg font-bold text-sm ${
                                    index === 0 ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' : 'bg-gray-900 text-white'
                                  }`}>
                                    {product.total}
                                  </div>
                                  <p className="text-[9px] text-gray-400 mt-0.5">toplam</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 text-center">
                          <HiOutlineShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-400 text-sm">Henüz satış verisi yok</p>
                        </div>
                      )}
                    </div>

                    {/* Summary Footer */}
                    {productSalesData.length > 0 && (
                      <div className="p-4 bg-gray-50 border-t border-gray-100">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Toplam Satılan Ürün</span>
                          <span className="font-bold text-gray-900">
                            {productSalesData.reduce((acc, p) => acc + p.total, 0)} adet
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-y-auto"
          >
            <div className="min-h-screen flex items-start justify-center p-4 py-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
              >
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-gray-900 to-slate-800 p-4 text-white flex items-center justify-between">
                  <h2 className="text-lg font-bold">Sipariş Detayı</h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => deleteOrder(selectedOrder.id)}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-300 transition-colors"
                    >
                      <HiOutlineTrash className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      <HiOutlineX className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  {/* Order Info */}
                  <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500">Sipariş No</span>
                      <span className="font-mono font-bold text-gray-900">#{selectedOrder.orderNumber || selectedOrder.id.slice(0, 8).toUpperCase()}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500">Tarih</span>
                      <span className="text-gray-900">{formatDate(selectedOrder.createdAt)}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500">Durum</span>
                      <div className="relative">
                        <select
                          value={selectedOrder.status}
                          onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                          className={`appearance-none cursor-pointer pl-3 pr-8 py-2 text-sm font-medium rounded-xl border-2 outline-none transition-all ${
                            selectedOrder.status === 'pending' ? 'bg-amber-50 border-amber-300 text-amber-700' :
                            selectedOrder.status === 'processing' ? 'bg-blue-50 border-blue-300 text-blue-700' :
                            selectedOrder.status === 'shipped' ? 'bg-purple-50 border-purple-300 text-purple-700' :
                            selectedOrder.status === 'completed' ? 'bg-green-50 border-green-300 text-green-700' :
                            selectedOrder.status === 'cancelled' ? 'bg-red-50 border-red-300 text-red-700' :
                            'bg-gray-50 border-gray-300 text-gray-700'
                          }`}
                        >
                          {Object.entries(statusLabels).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                          ))}
                        </select>
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    {/* Arandı Durumu */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500">Arandı Durumu</span>
                      <button
                        onClick={() => toggleCalledStatus(selectedOrder.id, selectedOrder.called)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                          selectedOrder.called 
                            ? 'bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 text-white shadow-lg shadow-purple-300' 
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                      >
                        {selectedOrder.called ? '✅ Arandı' : '📞 Aranmadı'}
                      </button>
                    </div>
                    {/* Vergi Girişleri */}
                    <div className="pt-2 border-t border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">Vergi Girişleri</span>
                        <span className="text-sm font-bold text-emerald-600">Toplam: {formatPrice(getTotalTax(selectedOrder))}</span>
                      </div>
                      
                      {/* Mevcut vergi girişleri */}
                      {selectedOrder.taxEntries && selectedOrder.taxEntries.length > 0 && (
                        <div className="space-y-2 mb-3">
                          {selectedOrder.taxEntries.map((entry, idx) => (
                            <div key={entry.id} className="flex items-center justify-between p-2 bg-emerald-50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-emerald-600 font-medium">#{idx + 1}</span>
                                <span className="text-sm text-gray-700">{entry.note || 'Vergi'}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-emerald-700">{formatPrice(entry.amount)}</span>
                                <button
                                  onClick={() => deleteTaxEntry(selectedOrder.id, entry.id)}
                                  className="w-6 h-6 flex items-center justify-center bg-red-100 text-red-500 rounded-md hover:bg-red-200 transition-colors"
                                >
                                  <HiOutlineX className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Yeni vergi ekle */}
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Tutar"
                          className="flex-1 px-3 py-2 text-sm rounded-lg border-2 border-gray-200 outline-none focus:border-emerald-400"
                          id="modal-tax-input"
                        />
                        <input
                          type="text"
                          placeholder="Not (opsiyonel)"
                          className="flex-1 px-3 py-2 text-sm rounded-lg border-2 border-gray-200 outline-none focus:border-emerald-400"
                          id="modal-tax-note"
                        />
                        <button
                          onClick={() => {
                            const input = document.getElementById('modal-tax-input');
                            const note = document.getElementById('modal-tax-note');
                            if (input.value) {
                              addTaxEntry(selectedOrder.id, input.value, note.value);
                              input.value = '';
                              note.value = '';
                            }
                          }}
                          className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
                        >
                          Ekle
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Receipt Section */}
                  {selectedOrder.receiptUrl ? (
                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                            <HiOutlineDocumentText className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-emerald-800">Dekont Yüklendi</p>
                            <p className="text-xs text-emerald-600">
                              {selectedOrder.receiptUploadedAt ? formatDate(selectedOrder.receiptUploadedAt) : 'Tarih bilinmiyor'}
                              {selectedOrder.receiptUploadedBy === 'admin' && ' (Admin tarafından)'}
                            </p>
                          </div>
                        </div>
                        <a
                          href={selectedOrder.receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors"
                        >
                          <HiOutlineExternalLink className="w-4 h-4" />
                          Görüntüle
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                            <HiOutlineCloudUpload className="w-5 h-5 text-amber-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-amber-800">Dekont Yüklenmedi</p>
                            <p className="text-xs text-amber-600">Müşteri henüz dekont yüklememiş</p>
                          </div>
                        </div>
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleAdminReceiptUpload(selectedOrder.id, file);
                                // Update selectedOrder state to reflect the change
                                setTimeout(() => {
                                  const updatedOrder = orders.find(o => o.id === selectedOrder.id);
                                  if (updatedOrder) setSelectedOrder(updatedOrder);
                                }, 2500);
                              }
                            }}
                          />
                          {uploadingOrderId === selectedOrder.id ? (
                            <div className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-medium">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Yükleniyor... %{uploadProgress}
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 px-4 py-2 bg-amber-600 text-white rounded-xl text-sm font-medium hover:bg-amber-700 transition-colors">
                              <HiOutlineUpload className="w-4 h-4" />
                              Dekont Yükle
                            </div>
                          )}
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Customer Info */}
                  <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-3">Müşteri Bilgileri</h3>
                    <p className="text-gray-900">{selectedOrder.customer?.firstName} {selectedOrder.customer?.lastName}</p>
                    <p className="text-sm text-gray-500">{selectedOrder.customer?.phone}</p>
                    <p className="text-sm text-gray-500">{selectedOrder.customer?.email}</p>
                  </div>

                  {/* Shipping Address */}
                  <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-3">Teslimat Adresi</h3>
                    <p className="text-gray-900">{selectedOrder.shippingAddress?.address}</p>
                    <p className="text-sm text-gray-500">
                      {selectedOrder.shippingAddress?.district}, {selectedOrder.shippingAddress?.city}
                    </p>
                    <p className="text-sm text-gray-500">{selectedOrder.shippingAddress?.postalCode}</p>
                  </div>

                  {/* Items */}
                  <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-3">Ürünler</h3>
                    <div className="space-y-3">
                      {selectedOrder.items?.map((item, index) => (
                        <div key={index} className="flex gap-3">
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-white">
                            <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-500">x{item.quantity}</p>
                            <p className="text-sm font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
                      <div className="flex justify-between text-gray-600">
                        <span>Ürün Toplamı</span>
                        <span className="font-semibold">{formatPrice(selectedOrder.total)}</span>
                      </div>
                      {getTotalTax(selectedOrder) > 0 && (
                        <div className="flex justify-between text-emerald-600">
                          <span>Vergi ({selectedOrder.taxEntries?.length || 1} giriş)</span>
                          <span className="font-semibold">+ {formatPrice(getTotalTax(selectedOrder))}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold text-lg text-gray-900 pt-2 border-t border-gray-200">
                        <span>Genel Toplam</span>
                        <span>{formatPrice((selectedOrder.total || 0) + getTotalTax(selectedOrder))}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Receipt Modal */}
      <AnimatePresence>
        {showReceiptModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowReceiptModal(null)}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-3xl w-full max-h-[90vh] bg-white rounded-2xl overflow-hidden"
            >
              <div className="bg-gray-900 p-4 text-white flex items-center justify-between">
                <h3 className="font-bold">Dekont Görüntüle</h3>
                <div className="flex items-center gap-2">
                  <a
                    href={showReceiptModal}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-colors"
                  >
                    <HiOutlineExternalLink className="w-4 h-4" />
                    Yeni Sekmede Aç
                  </a>
                  <button
                    onClick={() => setShowReceiptModal(null)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <HiOutlineX className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-4 max-h-[calc(90vh-80px)] overflow-auto">
                <img
                  src={showReceiptModal}
                  alt="Dekont"
                  className="w-full h-auto rounded-xl"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Update Notification */}
      <AnimatePresence>
        {statusNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className={`fixed bottom-6 left-1/2 z-[100] px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 ${
              statusNotification.status === 'pending' ? 'bg-amber-500 text-white' :
              statusNotification.status === 'processing' ? 'bg-blue-500 text-white' :
              statusNotification.status === 'shipped' ? 'bg-purple-500 text-white' :
              statusNotification.status === 'completed' ? 'bg-green-500 text-white' :
              statusNotification.status === 'cancelled' ? 'bg-red-500 text-white' :
              'bg-gray-800 text-white'
            }`}
          >
            <HiOutlineCheck className="w-5 h-5" />
            <span className="font-medium text-sm">{statusNotification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tax Input Modal */}
      <AnimatePresence>
        {showTaxModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowTaxModal(null)}
            className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <HiOutlineReceiptTax className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold">Vergi Ekle</h3>
                      <p className="text-xs text-white/70">Birden fazla vergi ekleyebilirsiniz</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/70">Mevcut Toplam</p>
                    <p className="font-bold">{formatPrice(getTotalTax(orders.find(o => o.id === showTaxModal) || {}))}</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                {/* Mevcut vergi girişleri */}
                {(() => {
                  const order = orders.find(o => o.id === showTaxModal);
                  if (order?.taxEntries && order.taxEntries.length > 0) {
                    return (
                      <div className="mb-4 space-y-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mevcut Vergiler
                        </label>
                        {order.taxEntries.map((entry, idx) => (
                          <div key={entry.id} className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl">
                            <div>
                              <span className="text-xs text-emerald-600 font-medium">#{idx + 1} </span>
                              <span className="text-sm text-gray-700">{entry.note || 'Vergi'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-emerald-700">{formatPrice(entry.amount)}</span>
                              <button
                                onClick={() => deleteTaxEntry(showTaxModal, entry.id)}
                                className="w-7 h-7 flex items-center justify-center bg-red-100 text-red-500 rounded-lg hover:bg-red-200 transition-colors"
                              >
                                <HiOutlineTrash className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                })()}

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Yeni Vergi Ekle
                  </label>
                  <div className="space-y-3">
                    <input
                      type="number"
                      value={taxInput}
                      onChange={(e) => setTaxInput(e.target.value)}
                      placeholder="Tutar (₺)"
                      className="w-full px-4 py-3 text-lg font-semibold rounded-xl border-2 border-gray-200 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      autoFocus
                    />
                    <input
                      type="text"
                      value={taxNote}
                      onChange={(e) => setTaxNote(e.target.value)}
                      placeholder="Not (opsiyonel - örn: KDV, ÖTV...)"
                      className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowTaxModal(null);
                      setTaxInput('');
                      setTaxNote('');
                    }}
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                  >
                    Kapat
                  </button>
                  <button
                    onClick={() => addTaxEntry(showTaxModal, taxInput, taxNote)}
                    disabled={!taxInput || parseFloat(taxInput) <= 0}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    + Vergi Ekle
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
