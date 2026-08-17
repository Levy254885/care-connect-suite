import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env["VITE_FIREBASE_API_KEY"] as string,
  authDomain: import.meta.env["VITE_FIREBASE_AUTH_DOMAIN"] as string,
  projectId: import.meta.env["VITE_FIREBASE_PROJECT_ID"] as string,
  storageBucket: import.meta.env["VITE_FIREBASE_STORAGE_BUCKET"] as string,
  messagingSenderId: import.meta.env["VITE_FIREBASE_MESSAGING_SENDER_ID"] as string,
  appId: import.meta.env["VITE_FIREBASE_APP_ID"] as string,
};

export function getFirebaseApp(): FirebaseApp {
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export function firebaseAuth(): Auth {
  return getAuth(getFirebaseApp());
}

export function firestore(): Firestore {
  return getFirestore(getFirebaseApp());
}

export function firebaseStorage(): FirebaseStorage {
  return getStorage(getFirebaseApp());
}

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
