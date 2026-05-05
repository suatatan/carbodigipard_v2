import { Link } from 'react-router';
import { useLanguage } from '@/hooks/useLanguage';
import { Home } from 'lucide-react';

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg-primary)' }}>
      <div className="text-center px-6">
        <h1
          className="text-8xl font-bold mb-4"
          style={{ color: 'var(--color-accent)', fontFamily: 'Space Grotesk', opacity: 0.3 }}
        >
          404
        </h1>
        <h2
          className="text-2xl font-semibold mb-3"
          style={{ color: 'var(--color-text-primary)', fontFamily: 'Space Grotesk' }}
        >
          {t('Sayfa Bulunamadı', 'Page Not Found')}
        </h2>
        <p className="mb-8" style={{ color: 'var(--color-text-secondary)' }}>
          {t('Aradığınız sayfa mevcut değil veya taşınmış olabilir.', 'The page you are looking for does not exist or may have been moved.')}
        </p>
        <Link to="/" className="btn-accent no-underline">
          <Home size={16} />
          {t('Ana Sayfaya Dön', 'Back to Home')}
        </Link>
      </div>
    </main>
  );
}
