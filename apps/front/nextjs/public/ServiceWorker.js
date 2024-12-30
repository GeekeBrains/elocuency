// TODO: make the serviworker usefull for the desktop with the same code.

/**
 * Push notification
 */
self.addEventListener('push', function (event) {
  const data = event.data ? event.data.json() : {};

  // SendMessage to all clients
  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clients) => {
        clients.forEach((client) => {
          client.postMessage(data);
        });
      })
  );
});

/**
 * Ready service worker
navigator.serviceWorker.ready.then(async (serviceWorker) => {
  const subscription = await serviceWorker.pushManager.getSubscription();

  // Si no existe una suscripción, crea una nueva
  if (!subscription) {
    await subscribeUser();
  } else {
    // Realiza cualquier lógica adicional, como enviar la suscripción al servidor
    await sendSubscriptionToServer(subscription);
  }
});
 */

/**
 * Install service worker
 */
self.addEventListener('install', (event) => {});
