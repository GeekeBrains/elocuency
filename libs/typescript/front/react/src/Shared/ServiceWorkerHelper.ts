import { getEnv } from './getEnv';

export class ServiceWorkerHelper {
  static async register() {
    if ('serviceWorker' in navigator) {
      console.log('Service Worker registering...');
      try {
        const serviceWorkerRegistration =
          await navigator.serviceWorker.register('/ServiceWorker.js');
        console.log('Service Worker registered:', serviceWorkerRegistration);
        return serviceWorkerRegistration;
      } catch (error) {
        console.error('Service Worker error:', error);
      }
    } else {
      console.warn('Service Worker not suported by browser.');
    }
  }

  // Ask to user for permission to send notifications
  static async askAllowUserNotifications() {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      throw new Error('Permiso de notificaciones denegado por usuario.');
    }
  }

  static async subscribePushNotifications(
    serviceWorkerRegistration: ServiceWorkerRegistration
  ) {
    const pushNotificationsPublicVapid = getEnv().pushNotificationsPublicVapid;
    console.log(
      'PushManager registering 3... ' + pushNotificationsPublicVapid + '|'
    );
    try {
      // const serviceWorkerRegistration: ServiceWorkerRegistration = await navigator
      //   .serviceWorker.ready;

      let subscription =
        await serviceWorkerRegistration.pushManager.getSubscription();
      if (subscription) return subscription;

      console.log('subscribePushManager creating new...');
      subscription = await serviceWorkerRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          pushNotificationsPublicVapid ?? '' // Clave pública VAPID
        ),
      });
      console.log('subscribePushManager registered');

      console.log('Comando curl para prueba:', { subscription });
      return subscription;
    } catch (error) {
      console.error('PushManager error register:', error);
    }
  }

  static async checkAll(
    callback: (params: { pushSubscriptionRaw: string }) => void
  ) {
    // Register service worker
    const serviceWorkerRegistration: ServiceWorkerRegistration | undefined =
      await ServiceWorkerHelper.register();

    if (serviceWorkerRegistration !== undefined) {
      // Ask for user permission to send notifications to user
      await this.askAllowUserNotifications();

      // Subscribe to push notifications
      const subscription = await this.subscribePushNotifications(
        serviceWorkerRegistration
      );

      // Call the callback
      const endpoint = subscription?.endpoint;
      const keys = subscription?.toJSON().keys;
      const p256dh = keys?.p256dh;
      const auth = keys?.auth;

      callback({
        pushSubscriptionRaw: `{
          "endpoint": "${endpoint}",
          "keys": {
            "p256dh": "${p256dh}",
            "auth": "${auth}"
          }
        }`,
      });
    }
  }

  /**
   * Convierte una clave VAPID base64 a un Uint8Array para ser usada en la suscripción.
   * @param base64String La clave pública en formato base64.
   */
  private static urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}
