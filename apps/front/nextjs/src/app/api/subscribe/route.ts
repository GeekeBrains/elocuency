import { EnvEnum, getEnv } from 'elo/front/react/Shared';
import { NextRequest, NextResponse } from 'next/server';
import webpush from 'web-push';

export async function POST(req: NextRequest) {
  try {
    const subscription = await req.json();
    const payload = JSON.stringify({
      title: '¡Hola desde Next.js! 2ZZ',
      body: '¡Notificación de prueba!',
    });
    console.log('ºº ~ file: route.ts:24 ~ POST ~ payload:', payload);

    await webpush.sendNotification(subscription, payload);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error enviando la notificación:', error);
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}
