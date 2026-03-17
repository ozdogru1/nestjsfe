import { FormEvent, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/auth';
import { ApiError } from '../../services/api';

type AuthMode = 'login' | 'register';

type Props = {
  mode: AuthMode;
};

export function AuthPage({ mode }: Props) {
  const { login, register, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: Location })?.from?.pathname || '/products';

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/products', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      if (mode === 'login') {
        await login(email, password);
        navigate(from, { replace: true });
      } else {
        await register(email, password);
        setSuccess('Kayýt baþarýlý. Þimdi giriþ yapabilirsiniz.');
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Bir hata oluþtu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center px-4 py-12">
      <div className="card w-full max-w-md p-8">
        <div className="mb-6">
          <p className="badge">Ürün Yönetimi</p>
          <h1 className="mt-3 font-display text-3xl font-semibold">
            {mode === 'login' ? 'Giriþ Yap' : 'Hesap Oluþtur'}
          </h1>
          <p className="mt-2 text-sm text-steel">
            {mode === 'login'
              ? 'Paneli yönetmek için hesabýnýza giriþ yapýn.'
              : 'Yeni bir hesap oluþturarak ürünlerinizi yönetin.'}
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="label" htmlFor="email">
              E-posta
            </label>
            <input
              id="email"
              className="input"
              type="email"
              placeholder="ornek@firma.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="label" htmlFor="password">
              Þifre
            </label>
            <input
              id="password"
              className="input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={6}
            />
          </div>

          {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
          {success && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
              {success}
            </div>
          )}

          <button className="btn btn-primary w-full" type="submit" disabled={loading}>
            {loading ? 'Ýþleniyor...' : mode === 'login' ? 'Giriþ Yap' : 'Kayýt Ol'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-steel">
          {mode === 'login' ? (
            <>
              Hesabýnýz yok mu?{' '}
              <Link to="/register" className="font-semibold text-ink">
                Kayýt Ol
              </Link>
            </>
          ) : (
            <>
              Zaten hesabýnýz var mý?{' '}
              <Link to="/login" className="font-semibold text-ink">
                Giriþ Yap
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
