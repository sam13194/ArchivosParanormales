import { initializeApp, getApps, cert, ServiceAccount } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Check if Firebase Admin can be initialized
const canInitializeFirebaseAdmin = () => {
  return !!(
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  );
};

let adminAuth: any = null;

// Firebase Admin configuration
if (canInitializeFirebaseAdmin()) {
  const serviceAccount: ServiceAccount = {
    projectId: "archivosparanormales-a24a5",
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
    privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
  };

  // Initialize Firebase Admin if not already initialized
  if (!getApps().length) {
    try {
      initializeApp({
        credential: cert(serviceAccount),
        projectId: serviceAccount.projectId,
      });
      console.log('Firebase Admin initialized successfully');
    } catch (error) {
      console.error('Error initializing Firebase Admin:', error);
    }
  }

  // Export Firebase Admin Auth
  adminAuth = getAuth();
} else {
  console.warn('Firebase Admin not initialized: Missing environment variables');
}

export { adminAuth, getApps, canInitializeFirebaseAdmin };