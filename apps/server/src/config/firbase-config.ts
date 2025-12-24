import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const initializeFirebase = () => {
  try {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

    if (!serviceAccountJson) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON is missing in .env');
    }

    const serviceAccount = JSON.parse(serviceAccountJson);

    if (getApps().length === 0) {
      initializeApp({
        // משתמשים בפונקציה cert המיובאת ישירות
        credential: cert(serviceAccount),
      });
      console.log('✅ Firebase Admin initialized successfully');
    }
  } catch (error) {
    console.error('❌ Firebase Admin initialization error:', error);
  }
};

export default initializeFirebase;