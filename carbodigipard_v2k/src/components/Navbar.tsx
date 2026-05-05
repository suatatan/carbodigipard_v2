import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { useLanguage } from '@/hooks/useLanguage';
import { Menu, X, Leaf, LogIn } from 'lucide-react';

const navLinks = [
  { tr: 'Ana Sayfa', en: 'Home', path: '/' },
  { tr: 'Haberler', en: 'News', path: '/#news' },
  { tr: 'Eğitim', en: 'Training', path: '/training' },
  { tr: 'Hakkında', en: 'About', path: '/#about' },
];

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (path: string) => {
    setMobileOpen(false);
    if (path.startsWith('/#') && location.pathname === '/') {
      const id = path.replace('/#', '');
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0A1410]/90 backdrop-blur-xl border-b border-[#1E3A2E]'
          : 'bg-transparent'
      }`}
      style={{ height: 64 }}
    >
      <div className="container-custom h-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-[#4ADE80] no-underline">
          <Leaf size={24} />
          <span className="font-semibold text-lg tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>
            CARBODIGIPARD
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path.startsWith('/#') ? '/' : link.path}
              onClick={() => handleNavClick(link.path)}
              className="text-sm font-medium transition-colors duration-200 hover:text-[#4ADE80] no-underline"
              style={{ color: 'var(--color-text-secondary)', letterSpacing: '0.02em' }}
            >
              {t(link.tr, link.en)}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          {/* Language toggle */}
          <div className="flex gap-1">
            <button
              onClick={() => setLanguage('tr')}
              className={`lang-toggle ${language === 'tr' ? 'active' : ''}`}
            >
              TR
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`lang-toggle ${language === 'en' ? 'active' : ''}`}
            >
              EN
            </button>
          </div>
          {/* Login */}
          <Link
            to="/login"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:opacity-90 no-underline"
            style={{ background: 'var(--color-accent)', color: 'var(--color-bg-primary)' }}
          >
            <LogIn size={14} />
            {t('Giriş', 'Login')}
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-[#E8F5EC]"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden absolute top-16 left-0 right-0 border-b border-[#1E3A2E] p-6 flex flex-col gap-4"
          style={{ background: 'rgba(10, 20, 16, 0.98)', backdropFilter: 'blur(16px)' }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path.startsWith('/#') ? '/' : link.path}
              onClick={() => handleNavClick(link.path)}
              className="text-base font-medium transition-colors duration-200 hover:text-[#4ADE80] no-underline"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {t(link.tr, link.en)}
            </Link>
          ))}
          <div className="flex gap-2 pt-2 border-t border-[#1E3A2E]">
            <button
              onClick={() => { setLanguage('tr'); setMobileOpen(false); }}
              className={`lang-toggle ${language === 'tr' ? 'active' : ''}`}
            >
              TR
            </button>
            <button
              onClick={() => { setLanguage('en'); setMobileOpen(false); }}
              className={`lang-toggle ${language === 'en' ? 'active' : ''}`}
            >
              EN
            </button>
          </div>
          <Link
            to="/login"
            onClick={() => setMobileOpen(false)}
            className="btn-accent justify-center text-center no-underline"
          >
            <LogIn size={14} />
            {t('Giriş', 'Login')}
          </Link>
        </div>
      )}
    </nav>
  );
}
