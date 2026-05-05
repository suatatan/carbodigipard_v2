import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { trpc } from '@/providers/trpc';
import { Globe } from 'lucide-react';

export default function PartnersSection() {
  const { language, t } = useLanguage();
  const { data: partners, isLoading } = trpc.partner.list.useQuery();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Fallback partner logos
  const fallbackPartners = [
    { id: 1, nameTr: 'Avrupa Birliği', nameEn: 'European Union', logoPath: '', websiteUrl: 'https://european-union.europa.eu', sortOrder: 1 },
    { id: 2, nameTr: 'Tarım ve Orman Bakanlığı', nameEn: 'Ministry of Agriculture', logoPath: '', websiteUrl: 'https://www.tarim.gov.tr', sortOrder: 2 },
    { id: 3, nameTr: 'Ankara Üniversitesi', nameEn: 'Ankara University', logoPath: '', websiteUrl: 'https://www.ankara.edu.tr', sortOrder: 3 },
    { id: 4, nameTr: 'TÜBİTAK', nameEn: 'TUBITAK', logoPath: '', websiteUrl: 'https://www.tubitak.gov.tr', sortOrder: 4 },
  ];

  const displayPartners = partners && partners.length > 0 ? partners : fallbackPartners;

  return (
    <section ref={sectionRef} className="section-padding" style={{ background: 'var(--color-bg-primary)' }}>
      <div className="container-custom text-center">
        <h2
          className={`mb-4 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          style={{
            fontFamily: 'Space Grotesk',
            fontSize: 'clamp(28px, 3.5vw, 44px)',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            color: 'var(--color-text-primary)',
          }}
        >
          {t('Proje Ortakları', 'Partners')}
        </h2>
        <p
          className={`max-w-xl mx-auto mb-12 leading-relaxed transition-all duration-700 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ color: 'var(--color-text-secondary)', transitionDelay: '100ms' }}
        >
          {t(
            'CARBODIGIPARD projesi, Türkiye ve Avrupa Birliği\'nden değerli kurum ve kuruluşların iş birliği ile yürütülmektedir.',
            'The CARBODIGIPARD project is carried out in collaboration with valuable institutions from Turkey and the European Union.'
          )}
        </p>

        {/* Logo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {isLoading
            ? [1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-20 rounded-lg animate-pulse"
                  style={{ background: 'var(--color-bg-elevated)' }}
                />
              ))
            : displayPartners.map((partner, i) => (
                <a
                  key={partner.id}
                  href={partner.websiteUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex flex-col items-center justify-center gap-3 p-6 rounded-xl transition-all duration-500 ${
                    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-bg-secondary)',
                    transitionDelay: `${(i + 1) * 100}ms`,
                    textDecoration: 'none',
                  }}
                >
                  <div
                    className="w-16 h-16 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                    style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}
                  >
                    {partner.logoPath ? (
                      <img
                        src={partner.logoPath}
                        alt={language === 'en' && partner.nameEn ? partner.nameEn : partner.nameTr}
                        className="w-12 h-12 object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <Globe size={28} style={{ color: 'var(--color-accent)' }} />
                    )}
                  </div>
                  <span
                    className="text-xs font-medium text-center leading-tight transition-colors duration-300 group-hover:text-[#4ADE80]"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {language === 'en' && partner.nameEn ? partner.nameEn : partner.nameTr}
                  </span>
                </a>
              ))}
        </div>
      </div>
    </section>
  );
}
