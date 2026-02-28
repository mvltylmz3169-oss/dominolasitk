// Bu değeri şifre değiştirdiğinde güncelle → tüm aktif oturumlar otomatik çıkış yapar
export const ADMIN_SESSION_VERSION = 'v_27subat2026';

export const isAdminAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('admin_auth') === ADMIN_SESSION_VERSION;
};

export const setAdminAuthenticated = () => {
  localStorage.setItem('admin_auth', ADMIN_SESSION_VERSION);
};

export const clearAdminAuth = () => {
  localStorage.removeItem('admin_auth');
};
