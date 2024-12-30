// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// import { getAnalytics } from 'firebase/analytics';
// import { getFirestore } from 'firebase/firestore/lite';
import { getEnv } from 'elo/front/react/Shared';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const env = getEnv();

const firebaseConfig = {
  apiKey: getEnv().firebaseApiKey as string,
  authDomain: getEnv().firebaseAuthDomain as string,
  projectId: getEnv().firebaseProjectId as string,
  storageBucket: getEnv().firebaseStorageBucket as string,
  messagingSenderId: getEnv().firebaseMessagingSenderId as string,
  appId: getEnv().firebaseAppId as string,
  measurementId: getEnv().firebaseMeasurementId as string,
};

const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
// export const firebaseDb = getFirestore(firebaseApp);
// const firebaseAnalytics = getAnalytics(firebaseApp);
