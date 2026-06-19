import { FormEvent, useState } from 'react';
import { LockKeyhole, LogIn, Mail } from 'lucide-react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { BrandLogo } from '../../../shared/components/BrandLogo';
import { Seo } from '../../../shared/components/Seo';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { isFirebaseConfigured } from '../../../shared/services/firebase-auth';
import { loginAdmin } from '../../../shared/services/auth';
import { useAuth } from '../context/AuthContext';

export function AdminLoginPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const from = location.state?.from?.pathname || '/admin';

  if (user) return <Navigate to="/admin" replace />;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Informe email e senha.');
      return;
    }

    setLoading(true);
    try {
      await loginAdmin(email, password);
      navigate(from, { replace: true });
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Nao foi possivel entrar.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f2ea] px-4 py-12 dark:bg-[#170c09] sm:px-6 lg:px-8">
      <Seo title="Admin | Cesta.com" description="Acesso administrativo da Cesta.com." />
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-[2rem] border border-white/70 bg-white p-6 shadow-premium dark:border-white/14 dark:bg-[#24150f]">
        <div className="mx-auto grid h-28 w-32 place-items-center overflow-hidden">
          <BrandLogo className="h-28 w-32" />
        </div>
        <h1 className="mt-5 text-center text-3xl font-extrabold text-coffee dark:text-cream">Admin Cesta.com</h1>
        <p className="mx-auto mt-3 max-w-sm text-center text-sm leading-6 text-coffee/72 dark:text-cream/78">Acesso restrito ao dono da loja para gerenciar o catalogo.</p>

        {!isFirebaseConfigured && (
          <p className="mt-5 rounded-2xl bg-gold/20 px-4 py-3 text-sm font-bold text-coffee">
            Configure as variaveis Firebase no arquivo .env para habilitar o login.
          </p>
        )}

        <div className="mt-6 grid gap-4">
          <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" icon={<Mail size={17} />} />
          <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Senha" icon={<LockKeyhole size={17} />} />
        </div>

        {error && <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p>}

        <Button type="submit" className="mt-6 w-full" disabled={loading || !isFirebaseConfigured}>
          <LogIn size={18} /> {loading ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>
    </div>
  );
}
