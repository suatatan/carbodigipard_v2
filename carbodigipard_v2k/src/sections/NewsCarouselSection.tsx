import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { useLanguage } from '@/hooks/useLanguage';
import { trpc } from '@/providers/trpc';
import { ChevronLeft, ChevronRight, ArrowRight, Calendar } from 'lucide-react';

export default function NewsCarouselSection() {
  const { language, t } = useLanguage();
  const { data, isLoading } = trpc.news.list.useQuery({ language, limit: 8, offset: 0 });
  const carouselRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const amount = 384;
    carouselRef.current.scrollBy({
      left: dir === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <section id="news" ref={sectionRef} className="section-padding" style={{ background: 'var(--color-bg-secondary)' }}>
      <div className="container-custom">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h2
            className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{
              fontFamily: 'Space Grotesk',
              fontSize: 'clamp(28px, 3.5vw, 44px)',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              color: 'var(--color-text-primary)',
            }}
          >
            {t('Haberler', 'News')}
          </h2>
          <Link
            to="/training"
            className={`hidden sm:inline-flex items-center gap-1 text-sm font-medium transition-all duration-500 no-underline hover:underline ${
              visible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ color: 'var(--color-accent)', transitionDelay: '200ms' }}
          >
            {t('Tüm Haberler', 'All News')}
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Carousel */}
        {isLoading ? (
          <div className="flex gap-6 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-shrink-0 w-[360px] h-[420px] rounded-xl animate-pulse" style={{ background: 'var(--color-bg-elevated)' }} />
            ))}
          </div>
        ) : (
          <div className="relative">
            <div
              ref={carouselRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
              style={{ scrollSnapType: 'x mandatory' }}
            >
              {data?.items.map((item, i) => (
                <Link
                  to={`/news/${item.slug}`}
                  key={item.id}
                  className={`news-card flex-shrink-0 w-[360px] transition-all duration-500 no-underline ${
                    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ scrollSnapAlign: 'start', transitionDelay: `${i * 80}ms` }}
                >
                  {/* Image */}
                  <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16/10' }}>
                    <img
                      src={item.featuredImage || '/uploads/news-placeholder.jpg'}
                      alt={item.title || ''}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/uploads/news-placeholder.jpg'; }}
                    />
                    {item.categoryNameTr && (
                      <span className="absolute top-3 left-3 eu-badge text-[10px]">
                        {language === 'en' && item.categoryNameEn ? item.categoryNameEn : item.categoryNameTr}
                      </span>
                    )}
                  </div>
                  {/* Content */}
                  <div className="p-5 flex flex-col gap-2">
                    <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      <Calendar size={12} />
                      {formatDate(item.createdAt)}
                    </div>
                    <h3
                      className="text-base font-medium leading-snug line-clamp-2"
                      style={{ color: 'var(--color-text-primary)', fontFamily: 'Space Grotesk' }}
                    >
                      {item.title || t('Başlık yok', 'Untitled')}
                    </h3>
                    {item.summary && (
                      <p className="text-sm line-clamp-2" style={{ color: 'var(--color-text-secondary)' }}>
                        {item.summary}
                      </p>
                    )}
                    <span
                      className="inline-flex items-center gap-1 text-sm font-medium mt-1"
                      style={{ color: 'var(--color-accent)' }}
                    >
                      {t('Devamı', 'Read More')}
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Navigation arrows */}
            {data && data.items.length > 3 && (
              <>
                <button
                  onClick={() => scroll('left')}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 z-10"
                  style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => scroll('right')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 z-10"
                  style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
