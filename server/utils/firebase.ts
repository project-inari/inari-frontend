import { initializeApp, type FirebaseOptions } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const encodedConfig = process.env.FIREBASE_CONFIG as string;
const decodedConfig = Buffer.from(encodedConfig, 'base64').toString('utf-8');
const firebaseConfig: FirebaseOptions = JSON.parse(decodedConfig);

const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);
