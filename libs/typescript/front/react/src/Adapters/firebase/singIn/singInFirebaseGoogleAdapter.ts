import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

import { firebaseAuth } from '../firebase';
import {
  SingInProviderEnum,
  SingInResponseType,
} from './singInAbstractAdapter';

export const singInFirebaseGoogleAdapter =
  async (): Promise<SingInResponseType> => {
    const googleProvider = new GoogleAuthProvider();

    try {
      const res = await signInWithPopup(firebaseAuth, googleProvider);
      console.log('ºº ~ file: googleAuth.ts:10 ~ singInWithGoogle ~ res:', res);

      if (!res.user.email) {
        return null;
      }

      const providerToken =
        (await firebaseAuth?.currentUser?.getIdToken(
          /* forceRefresh */ false
        )) ?? '';

      return {
        email: res.user.email,
        name: res.user.displayName as string,
        avatarUrl: res.user.photoURL as string,
        providerId: res.user.uid,
        providerType: SingInProviderEnum.google,
        providerToken,
      };
    } catch (error) {
      return null;
    }
  };
