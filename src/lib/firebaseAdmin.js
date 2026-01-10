// Server-side Firebase Admin Configuration
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { firebaseConfig } from "./firebaseConfig";

// Initialize Firebase Admin (only once)
let app;
if (!getApps().length) {
  // Check if service account credentials are available
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      app = initializeApp({
        credential: cert(serviceAccount),
        projectId: firebaseConfig.projectId,
        storageBucket: firebaseConfig.storageBucket,
      });
      console.log("🔥 Firebase Admin: Service Account ile başlatıldı (Güvenli mod)");
    } catch (error) {
      console.error("Firebase Admin credential parse error:", error);
      // Fallback to test mode
      app = initializeApp({
        projectId: firebaseConfig.projectId,
        storageBucket: firebaseConfig.storageBucket,
      });
      console.log("⚠️ Firebase Admin: Test modunda başlatıldı (credential parse hatası)");
    }
  } else {
    // Test mode without credentials
    app = initializeApp({
      projectId: firebaseConfig.projectId,
      storageBucket: firebaseConfig.storageBucket,
    });
    console.log("⚠️ Firebase Admin: Test modunda başlatıldı (FIREBASE_SERVICE_ACCOUNT_KEY yok)");
  }
} else {
  app = getApps()[0];
}

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Storage
export const bucket = getStorage(app).bucket();

// Collection names
export const COLLECTIONS = {
  SETTINGS: "settings",
  SUBMISSIONS: "submissions",
  USER_LOGINS: "userLogins",
};


export default app;
