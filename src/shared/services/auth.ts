import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from './firebase';

export async function loginAdmin(email: string, password: string) {
  if (!auth) {
    throw new Error('Firebase nao configurado. Preencha as variaveis de ambiente.');
  }

  return signInWithEmailAndPassword(auth, email, password);
}

export async function logoutAdmin() {
  if (!auth) return;
  await signOut(auth);
}
