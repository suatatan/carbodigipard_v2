import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Calendar, Target, Flag } from 'lucide-react';

const stats = [
  { icon: Calendar, labelTr: 'PROJE SÜRESİ', labelEn: 'PROJECT DURATION', valueTr: '26 AY', valueEn: '26 MONTHS' },
  { icon: Target, labelTr: 'ODAK SEKTÖRLER', labelEn: 'FOCUS SECTORS', valueTr: '5 ANA SEKTÖR', valueEn: '5 SECTORS' },
  { icon: Flag, labelTr: 'BAŞLANGIÇ', labelEn: 'START DATE', valueTr: 'KASIM 2025', valueEn: 'NOV 2025' },
];

export default function ProjectInfoSection() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="section-padding" style={{ background: 'var(--color-bg-primary)' }}>
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-16 items-start">
          {/* Left Column */}
          <div
            className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <h2
              className="mb-8"
              style={{
                fontFamily: 'Space Grotesk',
                fontSize: 'clamp(28px, 3.5vw, 44px)',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                color: 'var(--color-text-primary)',
              }}
            >
              {t('Proje Hakkında', 'About the Project')}
            </h2>
            <div className="flex flex-col gap-5 text-base leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              <p>
                {t(
                  'CARBODIGIPARD projesi, Gıda, tarım ve hayvancılık sektöründeki IPARD işletmelerinin karbon ayak izi konusundaki bilgi ve becerilerini bilimsel, inovatif ve dijital araçlarla geliştirmeyi amaçlamaktadır.',
                  'The CARBODIGIPARD project aims to develop the knowledge and skills of IPARD enterprises in the food, agriculture, and livestock sectors on carbon footprint through scientific, innovative, and digital tools.'
                )}
              </p>
              <p>
                {t(
                  'Proje, işletmelerde "karbon sıfır" anlayışını güçlendirmek, AB Yeşil Mutabakatı ve Sınırda Karbon Düzenleme Mekanizması (SKDM) gerekliliklerine hazırlamak ve kırsal kalkınmada dijital ve yeşil dönüşümü desteklemek için yürütülmektedir.',
                  'The project is carried out to strengthen the "carbon zero" understanding in enterprises, prepare them for the EU Green Deal and Carbon Border Adjustment Mechanism (CBAM) requirements, and support digital and green transformation in rural development.'
                )}
              </p>
              <p>
                {t(
                  'Özellikle et ve süt üretimi/işlemesi ile meyve-sebze paketleme ve soğuk hava depoculuğu gibi yüksek riskli 5 ana sektöre odaklanan proje, 26 ay sürecek olup 3 Kasım 2025 tarihinde başlamıştır.',
                  'Focusing on 5 main high-risk sectors such as meat and dairy production/processing and fruit-vegetable packaging and cold storage, the project will last 26 months and started on November 3, 2025.'
                )}
              </p>
            </div>
          </div>

          {/* Right Column: Stat Cards */}
          <div className="flex flex-col gap-4">
            {stats.map((stat, i) => (
              <div
                key={stat.labelTr}
                className={`dark-forest-card flex items-center gap-5 transition-all duration-700 ${
                  visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${(i + 1) * 150}ms` }}
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}
                >
                  <stat.icon size={22} style={{ color: 'var(--color-accent)' }} />
                </div>
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-wider mb-1"
                    style={{ color: 'var(--color-text-muted)', fontFamily: 'Space Grotesk' }}
                  >
                    {t(stat.labelTr, stat.labelEn)}
                  </p>
                  <p
                    className="text-xl font-bold"
                    style={{ color: 'var(--color-accent)', fontFamily: 'Space Grotesk' }}
                  >
                    {t(stat.valueTr, stat.valueEn)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
