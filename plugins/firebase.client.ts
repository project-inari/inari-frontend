import { initializeApp, type FirebaseOptions } from 'firebase/app';
import { getAuth } from 'firebase/auth';

export default defineNuxtPlugin(nuxtApp => {
    const config = useRuntimeConfig();

    const decodedFirebaseConfig = atob(config.public.FIREBASE_CONFIG as string);

    const firebaseConfig: FirebaseOptions = JSON.parse(decodedFirebaseConfig);

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    nuxtApp.vueApp.provide('auth', auth);
    nuxtApp.provide('auth', auth);
});
