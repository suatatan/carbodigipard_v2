import { Link } from 'react-router';
import { useLanguage } from '@/hooks/useLanguage';
import { Leaf, Linkedin, Instagram, Mail, Calendar } from 'lucide-react';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer style={{ background: 'var(--color-bg-primary)', borderTop: '1px solid var(--color-border)' }}>
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Column 1: Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-[#4ADE80]">
              <Leaf size={22} />
              <span className="font-semibold text-lg tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>
                CARBODIGIPARD
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              {t(
                'IPARD İşletmelerinde Karbon Ayak İzi Farkındalığı',
                'Carbon Footprint Awareness in IPARD Enterprises'
              )}
            </p>
            <div className="eu-badge inline-block self-start mt-2">
              AB Tarafından Ortak Finanse Edilmektedir
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-primary)', fontFamily: 'Space Grotesk' }}>
              {t('Bağlantılar', 'Links')}
            </h4>
            {[
              { tr: 'Ana Sayfa', en: 'Home', path: '/' },
              { tr: 'Haberler', en: 'News', path: '/#news' },
              { tr: 'Eğitim', en: 'Training', path: '/training' },
              { tr: 'Hakkında', en: 'About', path: '/#about' },
              { tr: 'Giriş', en: 'Login', path: '/login' },
            ].map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm transition-colors duration-200 hover:text-[#4ADE80] no-underline"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {t(link.tr, link.en)}
              </Link>
            ))}
          </div>

          {/* Column 3: Contact */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-primary)', fontFamily: 'Space Grotesk' }}>
              {t('İletişim', 'Contact')}
            </h4>
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              <Mail size={14} style={{ color: 'var(--color-text-muted)' }} />
              <span>info@carbodigipard.org</span>
            </div>
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              <Calendar size={14} style={{ color: 'var(--color-text-muted)' }} />
              <span>Nov 2025 - Jan 2028</span>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <a
                href="https://linkedin.com/company/carbodigipard"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-[#4ADE80] hover:text-[#0A1410]"
                style={{ background: 'var(--color-bg-elevated)', color: 'var(--color-text-muted)' }}
              >
                <Linkedin size={16} />
              </a>
              <a
                href="https://instagram.com/carbodigipard"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-[#4ADE80] hover:text-[#0A1410]"
                style={{ background: 'var(--color-bg-elevated)', color: 'var(--color-text-muted)' }}
              >
                <Instagram size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="container-custom py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs"
        style={{ color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border)' }}
      >
        <span>&copy; 2025 CARBODIGIPARD. {t('Tüm hakları saklıdır.', 'All rights reserved.')}</span>
        <span className="flex items-center gap-1">
          {t('AB Tarafından Ortak Finanse Edilmektedir', 'Co-funded by the EU')}
          <span className="inline-block w-4 h-4 rounded-full ml-1" style={{ background: '#003399', border: '2px solid #FFCC00' }} />
        </span>
      </div>
    </footer>
  );
}
