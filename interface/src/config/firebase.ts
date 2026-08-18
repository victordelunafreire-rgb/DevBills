import {
	type FirebaseApp,
	type FirebaseOptions,
	getApp,
	getApps,
	initializeApp,
} from 'firebase/app';

import {
	type Auth,
	browserLocalPersistence,
	browserPopupRedirectResolver,
	GoogleAuthProvider,
	getAuth,
	indexedDBLocalPersistence,
	initializeAuth,
	inMemoryPersistence,
} from 'firebase/auth';

const firebaseConfig: FirebaseOptions = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const firebaseApp: FirebaseApp = getApps().length
	? getApp()
	: initializeApp(firebaseConfig);

const persistence = [
	browserLocalPersistence,
	indexedDBLocalPersistence,
	inMemoryPersistence,
];

let firebaseAuth: Auth;
try {
	firebaseAuth = initializeAuth(firebaseApp, {
		persistence,
		popupRedirectResolver: browserPopupRedirectResolver,
	});
} catch {
	firebaseAuth = getAuth(firebaseApp);
}

const googleAuthProvider = new GoogleAuthProvider();

export { firebaseApp, firebaseAuth, googleAuthProvider };
