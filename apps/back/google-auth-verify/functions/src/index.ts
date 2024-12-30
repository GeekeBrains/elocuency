import { onRequest } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import * as logger from 'firebase-functions/logger';

// Inicializa el SDK de Firebase Admin
admin.initializeApp();

// Cloud Function para verificar el token de Firebase usando Firebase Functions v2
export const googleAuthVerify = onRequest(async (req, res) => {
  const idToken = req.body.idToken;

  // Verificar si el idToken está presente
  if (!idToken) {
    logger.error('Missing idToken');
    res.status(400).send('Missing idToken');
    return;
  }

  try {
    // Verificar el ID Token usando el SDK de Firebase Admin
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // Loggear la información del token
    logger.info('Token verificado correctamente', { decodedToken });

    // Si la verificación es exitosa, devolver el token decodificado
    res.status(200).json({ decodedToken });
  } catch (error: any) {
    // Manejo de errores en caso de que el token no sea válido o haya expirado
    logger.error('Token verification failed:', { message: error.message });
    res.status(401).send('Token verification failed');
  }
});
