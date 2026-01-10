// Visitor Tracking Service
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy,
  serverTimestamp,
  updateDoc,
  getDocs,
  where,
  Timestamp,
  getDoc
} from 'firebase/firestore';
import { db } from './firebase';

// Collection reference
const VISITORS_COLLECTION = 'active_visitors';
const VISITOR_HISTORY_COLLECTION = 'visitor_history';

// Stale timeout in minutes (visitors inactive for this long will be removed)
const STALE_TIMEOUT_MINUTES = 2;

// Generate unique visitor ID
export const generateVisitorId = () => {
  return 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// Get device info
export const getDeviceInfo = () => {
  if (typeof window === 'undefined') return {};
  
  const ua = navigator.userAgent;
  let device = 'Bilinmiyor';
  let browser = 'Bilinmiyor';
  let os = 'Bilinmiyor';
  
  // Detect OS
  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac OS')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
  
  // Detect Browser
  if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Chrome';
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
  else if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Edg')) browser = 'Edge';
  else if (ua.includes('Opera') || ua.includes('OPR')) browser = 'Opera';
  
  // Detect Device Type
  if (/Mobi|Android/i.test(ua)) device = 'Mobil';
  else if (/Tablet|iPad/i.test(ua)) device = 'Tablet';
  else device = 'Masaüstü';
  
  return {
    device,
    browser,
    os,
    userAgent: ua,
    screenWidth: window.screen?.width || 0,
    screenHeight: window.screen?.height || 0,
    language: navigator.language || 'tr-TR'
  };
};

// Get IP address using external service with timeout
export const getIPAddress = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
    
    const response = await fetch('https://api.ipify.org?format=json', {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    
    if (!response.ok) throw new Error('IP API error');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    // Silently fail - don't log to avoid console spam
    return 'Bilinmiyor';
  }
};

// Get location from IP with timeout
export const getLocationFromIP = async (ip) => {
  try {
    if (ip === 'Bilinmiyor') return { city: 'Bilinmiyor', country: 'Bilinmiyor' };
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
    
    const response = await fetch(`https://ipapi.co/${ip}/json/`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    
    if (!response.ok) throw new Error('Location API error');
    const data = await response.json();
    return {
      city: data.city || 'Bilinmiyor',
      country: data.country_name || 'Bilinmiyor',
      region: data.region || 'Bilinmiyor'
    };
  } catch (error) {
    // Silently fail - don't log to avoid console spam
    return { city: 'Bilinmiyor', country: 'Bilinmiyor' };
  }
};

// Check if visitor is stale (no activity for STALE_TIMEOUT_MINUTES)
const isVisitorStale = (lastActivity) => {
  if (!lastActivity) return true;
  
  const lastActivityDate = lastActivity.toDate ? lastActivity.toDate() : new Date(lastActivity);
  const staleThreshold = new Date();
  staleThreshold.setMinutes(staleThreshold.getMinutes() - STALE_TIMEOUT_MINUTES);
  
  return lastActivityDate < staleThreshold;
};

// Register visitor as active (non-blocking)
export const registerVisitor = async (visitorId) => {
  try {
    const deviceInfo = getDeviceInfo();
    
    // Get basic visitor data first without waiting for external APIs
    const visitorData = {
      visitorId,
      ip: 'Yükleniyor...',
      ...deviceInfo,
      city: 'Yükleniyor...',
      country: 'Yükleniyor...',
      currentPage: typeof window !== 'undefined' ? window.location.pathname : '/',
      referrer: typeof document !== 'undefined' ? (document.referrer || 'Doğrudan') : 'Doğrudan',
      enteredAt: serverTimestamp(),
      lastActivity: serverTimestamp(),
      isActive: true
    };
    
    // Save immediately with basic data
    await setDoc(doc(db, VISITORS_COLLECTION, visitorId), visitorData);
    
    // Also save to history
    await setDoc(doc(db, VISITOR_HISTORY_COLLECTION, visitorId), {
      ...visitorData,
      exitedAt: null
    });
    
    // Fetch IP and location in background (non-blocking)
    getIPAddress().then(async (ip) => {
      if (ip && ip !== 'Bilinmiyor') {
        const location = await getLocationFromIP(ip);
        try {
          await updateDoc(doc(db, VISITORS_COLLECTION, visitorId), {
            ip,
            ...location
          });
          await updateDoc(doc(db, VISITOR_HISTORY_COLLECTION, visitorId), {
            ip,
            ...location
          });
        } catch (e) {
          // Document might have been deleted, ignore
        }
      }
    }).catch(() => {
      // Silently ignore IP/location errors
    });
    
    // Clean up stale visitors in background
    setTimeout(() => cleanupStaleVisitors(), 1000);
    
    return visitorData;
  } catch (error) {
    // Silently fail - don't block page load
    return null;
  }
};

// Update visitor activity
export const updateVisitorActivity = async (visitorId, currentPage) => {
  try {
    const visitorRef = doc(db, VISITORS_COLLECTION, visitorId);
    
    // Check if document exists first
    const docSnap = await getDoc(visitorRef);
    if (!docSnap.exists()) {
      // Re-register if document doesn't exist (was cleaned up)
      return null;
    }
    
    await updateDoc(visitorRef, {
      currentPage,
      lastActivity: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Ziyaretçi aktivitesi güncellenemedi:', error);
    return null;
  }
};

// Remove visitor (on page close)
export const removeVisitor = async (visitorId) => {
  try {
    // Update history with exit time
    try {
      const historyRef = doc(db, VISITOR_HISTORY_COLLECTION, visitorId);
      await updateDoc(historyRef, {
        exitedAt: serverTimestamp(),
        isActive: false
      });
    } catch (e) {
      // History doc might not exist
    }
    
    // Remove from active visitors
    await deleteDoc(doc(db, VISITORS_COLLECTION, visitorId));
  } catch (error) {
    console.error('Ziyaretçi kaldırılamadı:', error);
  }
};

// Listen to active visitors (real-time) - filters out stale visitors
export const subscribeToActiveVisitors = (callback) => {
  const q = query(
    collection(db, VISITORS_COLLECTION),
    orderBy('lastActivity', 'desc')
  );
  
  // Clean up stale visitors on subscription
  cleanupStaleVisitors();
  
  return onSnapshot(q, (snapshot) => {
    const now = new Date();
    const staleThreshold = new Date(now.getTime() - STALE_TIMEOUT_MINUTES * 60 * 1000);
    
    const visitors = snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      .filter(visitor => {
        // Filter out stale visitors client-side for immediate effect
        if (!visitor.lastActivity) return false;
        const lastActivityDate = visitor.lastActivity.toDate ? visitor.lastActivity.toDate() : new Date(visitor.lastActivity);
        return lastActivityDate >= staleThreshold;
      });
    
    callback(visitors);
  });
};

// Get visitor history (last 24 hours)
export const getVisitorHistory = async () => {
  try {
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
    
    const q = query(
      collection(db, VISITOR_HISTORY_COLLECTION),
      where('enteredAt', '>=', Timestamp.fromDate(twentyFourHoursAgo)),
      orderBy('enteredAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Ziyaretçi geçmişi alınamadı:', error);
    return [];
  }
};

// Clean up stale visitors (older than STALE_TIMEOUT_MINUTES without activity)
export const cleanupStaleVisitors = async () => {
  try {
    const staleThreshold = new Date();
    staleThreshold.setMinutes(staleThreshold.getMinutes() - STALE_TIMEOUT_MINUTES);
    
    const q = query(
      collection(db, VISITORS_COLLECTION),
      where('lastActivity', '<', Timestamp.fromDate(staleThreshold))
    );
    
    const snapshot = await getDocs(q);
    
    if (snapshot.docs.length > 0) {
      console.log(`🧹 ${snapshot.docs.length} eski ziyaretçi temizleniyor...`);
      
      const promises = snapshot.docs.map(async (docSnap) => {
        const visitorId = docSnap.id;
        
        // Update history
        try {
          const historyRef = doc(db, VISITOR_HISTORY_COLLECTION, visitorId);
          await updateDoc(historyRef, {
            exitedAt: serverTimestamp(),
            isActive: false
          });
        } catch (e) {
          // Ignore history errors
        }
        
        // Delete from active
        return deleteDoc(docSnap.ref);
      });
      
      await Promise.all(promises);
    }
  } catch (error) {
    console.error('Eski ziyaretçiler temizlenemedi:', error);
  }
};

// Force cleanup all visitors (admin function)
export const forceCleanupAllVisitors = async () => {
  try {
    const snapshot = await getDocs(collection(db, VISITORS_COLLECTION));
    
    const promises = snapshot.docs.map(async (docSnap) => {
      const visitorId = docSnap.id;
      
      // Update history
      try {
        const historyRef = doc(db, VISITOR_HISTORY_COLLECTION, visitorId);
        await updateDoc(historyRef, {
          exitedAt: serverTimestamp(),
          isActive: false
        });
      } catch (e) {
        // Ignore history errors
      }
      
      // Delete from active
      return deleteDoc(docSnap.ref);
    });
    
    await Promise.all(promises);
    console.log(`🧹 Tüm ziyaretçiler temizlendi (${snapshot.docs.length})`);
    return snapshot.docs.length;
  } catch (error) {
    console.error('Ziyaretçiler temizlenemedi:', error);
    return 0;
  }
};
