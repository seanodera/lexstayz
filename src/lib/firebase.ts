import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {
    initializeFirestore,
    memoryLocalCache,
    persistentLocalCache,
    persistentMultipleTabManager
} from 'firebase/firestore';
import {getStorage} from 'firebase/storage';
import {Analytics, getAnalytics, isSupported} from "firebase/analytics";
import algoliasearch from "algoliasearch/lite";


const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const isDev = process.env.NEXT_PUBLIC_STAGE === 'dev';

const firestore = isDev
    ? initializeFirestore(app, {
        localCache: memoryLocalCache()
    }, 'development')
    : initializeFirestore(app, {
        localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
    });
const storage = getStorage(app);
// const analytics = getAnalytics(app);
const searchClient = algoliasearch("S192CBDSDM", "07dbe0e186e0f74a4ce9915a7fb74233");


// Initialize Firebase Analytics (check if the browser supports it)
let analytics:Analytics | undefined;
if (typeof window !== "undefined") {
    isSupported().then((supported) => {
        if (supported) {
            analytics = getAnalytics(app);
        }
    });
}

export {analytics,app, auth, firestore, storage, searchClient};
