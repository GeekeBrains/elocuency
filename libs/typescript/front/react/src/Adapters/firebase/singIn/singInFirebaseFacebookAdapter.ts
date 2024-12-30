import { FacebookAuthProvider, signInWithPopup } from 'firebase/auth';

import { firebaseAuth } from '../firebase';
import {
  SingInProviderEnum,
  SingInResponseType,
} from './singInAbstractAdapter';

export const singInFirebaseFacebookAdapter =
  async (): Promise<SingInResponseType> => {
    try {
      const facebookProvider = new FacebookAuthProvider();
      console.log(
        'ºº ~ file: singInFirebaseFacebookAdapter.ts:35 ~ :SingInAdapterType= ~ singInFirebaseGoogleAdapter:',
        singInFirebaseFacebookAdapter
      );
      const res = await signInWithPopup(firebaseAuth, facebookProvider);
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
        name: res.user.displayName ?? undefined,
        avatarUrl: res.user.photoURL ?? undefined,
        providerId: res.user.uid,
        providerType: SingInProviderEnum.google,
        providerToken,
      };
    } catch (error) {
      return null;
    }
  };
