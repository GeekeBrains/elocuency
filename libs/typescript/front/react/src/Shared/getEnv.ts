export enum EnvEnum {
  bffUrl = 'NEXT_PUBLIC_BFF_URL',
  firebaseApiKey = 'NEXT_PUBLIC_FIREBASE_API_KEY',
  firebaseAuthDomain = 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  firebaseProjectId = 'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  firebaseStorageBucket = 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  firebaseMessagingSenderId = 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  firebaseAppId = 'NEXT_PUBLIC_FIREBASE_APP_ID',
  firebaseMeasurementId = 'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID',
  pushNotificationsPublicVapid = 'NEXT_PUBLIC_PUSH_NOTIFICATIONS_PUBLIC_VAPID',
  pushNotificationsPrivateVapid = 'PUSH_NOTIFICATIONS_PRIVATE_VAPID',
}

// On Front side, process.env is loaded from next.config.js
// and NEXT_PUBLIC_ variables are sended to the client.
// Use this function to avoid process.env usage.
export const getEnv = () => {
  return {
    bffUrl: process.env[EnvEnum.bffUrl] as string,
    firebaseApiKey: process.env[EnvEnum.firebaseApiKey] as string,
    firebaseAuthDomain: process.env[EnvEnum.firebaseAuthDomain] as string,
    firebaseProjectId: process.env[EnvEnum.firebaseProjectId] as string,
    firebaseStorageBucket: process.env[EnvEnum.firebaseStorageBucket] as string,
    firebaseMessagingSenderId: process.env[
      EnvEnum.firebaseMessagingSenderId
    ] as string,
    firebaseAppId: process.env[EnvEnum.firebaseAppId] as string,
    firebaseMeasurementId: process.env[EnvEnum.firebaseMeasurementId] as string,
    pushNotificationsPublicVapid: process.env[
      EnvEnum.pushNotificationsPublicVapid
    ] as string,
    pushNotificationsPrivateVapid: process.env[
      EnvEnum.pushNotificationsPrivateVapid
    ] as string,
    sessionToken: '',
  };
};
