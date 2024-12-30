import { createUserWithEmailAndPassword } from 'firebase/auth';
import { firebaseAuth } from '../firebase';

export const createUserFirebaseAdapter = async (params: {
  email: string;
  password: string;
}) => {
  try {
    const resp = await createUserWithEmailAndPassword(
      firebaseAuth,
      params.email,
      params.password
    );
    console.log('ºº ~ file: createUserFireBaseAdapter.ts:10 ~ resp:', resp);
  } catch (error) {
    console.log(error);
  }
};
