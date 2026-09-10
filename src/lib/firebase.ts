import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore with the database ID specified in config
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Test server connectivity on startup
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'site_config', 'branding'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore is offline. Operating in fallback cache mode.');
      return false;
    }
    // Expected if document doesn't exist yet or connection is active
    return true;
  }
}

// Automatically test connection
testFirestoreConnection().catch((err) => {
  console.warn('Firebase initial connection check:', err);
});
