import { Link } from 'react-router';
import { useLanguage } from '@/hooks/useLanguage';
import { ArrowRight } from 'lucide-react';
import HeroShader from './HeroShader';

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <section
      className="relative w-full flex items-center justify-center overflow-hidden"
      style={{ height: '100vh', minHeight: '600px', background: 'var(--color-bg-hero)' }}
    >
      <HeroShader />

      {/* Content overlay */}
      <div className="relative z-10 text-center px-6" style={{ pointerEvents: 'none' }}>
        {/* Caption */}
        <p
          className="text-xs font-semibold uppercase tracking-[0.1em] mb-6"
          style={{ color: 'var(--color-accent)', opacity: 0.7, fontFamily: 'Space Grotesk' }}
        >
          {t(
            'IPARD İŞLETMELERİNDE KARBON AYAK İZİ FARKINDALIĞI',
            'CARBON FOOTPRINT AWARENESS IN IPARD ENTERPRISES'
          )}
        </p>

        {/* H1 */}
        <h1
          className="font-bold leading-[1.05] mb-6"
          style={{
            fontFamily: 'Space Grotesk',
            fontSize: 'clamp(40px, 8vw, 96px)',
            letterSpacing: '-0.03em',
            color: 'var(--color-text-primary)',
          }}
        >
          <span className="block">{t('Karbon Ayak İzini', 'Reducing Carbon')}</span>
          <span className="block" style={{ color: 'var(--color-accent)' }}>
            {t('Azaltıyoruz', 'Footprint')}
          </span>
        </h1>

        {/* Body */}
        <p
          className="max-w-xl mx-auto mb-10 leading-relaxed"
          style={{
            fontSize: '18px',
            color: 'var(--color-text-secondary)',
          }}
        >
          {t(
            'Gıda, tarım ve hayvancılık sektöründeki IPARD işletmelerinin karbon ayak izi konusundaki bilgi ve becerilerini bilimsel, inovatif ve dijital araçlarla geliştiriyoruz.',
            'We are developing the knowledge and skills of IPARD enterprises in the food, agriculture, and livestock sectors on carbon footprint through scientific, innovative, and digital tools.'
          )}
        </p>

        {/* CTA */}
        <Link
          to="/#about"
          className="btn-accent inline-flex no-underline"
          style={{ pointerEvents: 'auto' }}
        >
          {t('Projeyi Keşfet', 'Explore Project')}
          <ArrowRight size={18} />
        </Link>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        style={{ pointerEvents: 'none' }}
      >
        <div
          className="w-px h-10 relative overflow-hidden"
          style={{ background: 'var(--color-text-muted)' }}
        >
          <div
            className="absolute top-0 left-0 w-full h-3 rounded-full"
            style={{
              background: 'var(--color-accent)',
              animation: 'scrollPulse 2s ease-in-out infinite',
            }}
          />
        </div>
        <style>{`
          @keyframes scrollPulse {
            0%, 100% { transform: translateY(0); opacity: 1; }
            50% { transform: translateY(28px); opacity: 0.3; }
          }
        `}</style>
      </div>
    </section>
  );
}
