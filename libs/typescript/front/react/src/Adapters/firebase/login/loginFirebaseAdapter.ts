import { signInWithEmailAndPassword } from 'firebase/auth';
import { firebaseAuth } from '../firebase';
// import { firebaseAuth } from '../firebase/firebase';

export const loginFireBaseAdapter = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<string> => {
  const resp = signInWithEmailAndPassword(firebaseAuth, email, password);
  console.log('ºº ~ file: googleAuth.ts:10 ~ singInWithGoogle ~ res:', resp);

  return firebaseAuth?.currentUser?.getIdToken(/* forceRefresh */ true) ?? '';
};
