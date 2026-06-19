import { getAuth } from 'firebase/auth';
import { firebaseApp, isFirebaseConfigured } from './firebase';

export { isFirebaseConfigured };
export const auth = firebaseApp ? getAuth(firebaseApp) : null;
