import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { Leaf, LogIn, AlertCircle } from 'lucide-react';

export default function Login() {
  const { t } = useLanguage();
  const { login, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    navigate('/admin');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      navigate('/admin');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t('Giriş başarısız', 'Login failed');
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'var(--color-bg-primary)' }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-[#4ADE80] no-underline mb-4">
            <Leaf size={28} />
            <span className="font-semibold text-xl tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>
              CARBODIGIPARD
            </span>
          </Link>
          <h1
            className="text-2xl font-bold"
            style={{ color: 'var(--color-text-primary)', fontFamily: 'Space Grotesk' }}
          >
            {t('Admin Girişi', 'Admin Login')}
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            {t('Yönetim paneline erişmek için giriş yapın', 'Log in to access the admin panel')}
          </p>
        </div>

        {/* Form */}
        <div
          className="rounded-xl p-8"
          style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
        >
          {error && (
            <div
              className="flex items-center gap-2 p-3 rounded-lg mb-4 text-sm"
              style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}
            >
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-2"
                style={{ color: 'var(--color-text-muted)', fontFamily: 'Space Grotesk' }}
              >
                {t('Kullanıcı Adı', 'Username')}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-200 focus:ring-2"
                style={{
                  background: 'var(--color-bg-elevated)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-primary)',
                }}
                placeholder={t('Kullanıcı adınız', 'Your username')}
                required
              />
            </div>

            <div>
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-2"
                style={{ color: 'var(--color-text-muted)', fontFamily: 'Space Grotesk' }}
              >
                {t('Şifre', 'Password')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-200 focus:ring-2"
                style={{
                  background: 'var(--color-bg-elevated)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-primary)',
                }}
                placeholder={t('Şifreniz', 'Your password')}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-accent justify-center w-full mt-2 disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  {t('Giriş yapılıyor...', 'Logging in...')}
                </span>
              ) : (
                <>
                  <LogIn size={16} />
                  {t('Giriş Yap', 'Login')}
                </>
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-sm transition-colors hover:text-[#4ADE80] no-underline"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {t('Ana Sayfaya Dön', 'Back to Home')}
          </Link>
        </div>
      </div>
    </main>
  );
}
