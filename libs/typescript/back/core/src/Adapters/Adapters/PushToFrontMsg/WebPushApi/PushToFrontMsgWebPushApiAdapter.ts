import { Injectable } from '@nestjs/common';
import webpush from 'web-push';

import { getEnv } from 'elo/back/core/Shared';
import { PushToFrontMsgPort } from 'elo/back/core/Chats/Ports';

/*
const pushSubscription = {
  endpoint: '< Push Subscription URL >',
  keys: {
    p256dh: '< User Public Encryption Key >',
    auth: '< User Auth Secret >'
  }
};

const payload = '< Push Payload String >';

const options = {
  gcmAPIKey: '< GCM API Key >',
  vapidDetails: {
    subject: '< \'mailto\' Address or URL >',
    publicKey: '< URL Safe Base64 Encoded Public Key >',
    privateKey: '< URL Safe Base64 Encoded Private Key >'
  },
  timeout: <Number>
  TTL: <Number>,
  headers: {
    '< header name >': '< header value >'
  },
  contentEncoding: '< Encoding type, e.g.: aesgcm or aes128gcm >',
  urgency:'< Default is "normal" >',
  topic:'< Use a maximum of 32 characters from the URL or filename-safe Base64 characters sets. >',

  proxy: '< proxy server options >',
  agent: '< https.Agent instance >'
}
*/

@Injectable()
export class PushToFrontMsgWebPushApiAdapter implements PushToFrontMsgPort {
  constructor() {
    const vapidPublicKey = getEnv().pushNotificationsPublicVapid ?? ''; // Clave pública VAPID
    const vapidPrivateKey = getEnv().pushNotificationsPrivateVapid ?? '';
    console.log(
      'ºº ~ file: route.ts:6 ~ vapid:',
      vapidPublicKey,
      vapidPrivateKey
    );

    // Configurar VAPID
    webpush.setVapidDetails(
      'https://elocuency.com',
      vapidPublicKey,
      vapidPrivateKey
    );
  }

  async push(subscription: any, payload: any) {
    // console.log('PushToFrontMsgWebPushApiAdapter ~ push:', {
    //   subscription,
    //   payload,
    // });
    await webpush.sendNotification(subscription, JSON.stringify(payload));
  }
}
