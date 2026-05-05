import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { useLanguage } from '@/hooks/useLanguage';
import { trpc } from '@/providers/trpc';
import { Calendar, ArrowLeft, Linkedin, Twitter, Facebook, Link2, ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function NewsDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { language, t } = useLanguage();
  const { data: newsItem, isLoading } = trpc.news.getBySlug.useQuery(
    { slug: slug || '', language },
    { enabled: !!slug }
  );

  const { data: relatedNews } = trpc.news.related.useQuery(
    { newsId: newsItem?.id ?? 0, language, limit: 3 },
    { enabled: !!newsItem?.id }
  );

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowLeft') setLightboxIndex((prev) => prev !== null ? (prev - 1 + (newsItem?.images?.length || 1)) % (newsItem?.images?.length || 1) : null);
      if (e.key === 'ArrowRight') setLightboxIndex((prev) => prev !== null ? (prev + 1) % (newsItem?.images?.length || 1) : null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, newsItem?.images?.length]);

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';

  const shareLinks = [
    {
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`,
      label: 'LinkedIn',
    },
    {
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(newsItem?.translation?.title || '')}`,
      label: 'Twitter',
    },
    {
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`,
      label: 'Facebook',
    },
    {
      icon: Link2,
      url: pageUrl,
      label: t('Kopyala', 'Copy'),
      onClick: () => navigator.clipboard?.writeText(pageUrl),
    },
  ];

  if (isLoading) {
    return (
      <main className="min-h-screen" style={{ background: 'var(--color-bg-primary)', paddingTop: 120 }}>
        <div className="container-custom max-w-3xl mx-auto">
          <div className="h-8 w-1/3 rounded animate-pulse mb-4" style={{ background: 'var(--color-bg-elevated)' }} />
          <div className="h-12 w-2/3 rounded animate-pulse mb-6" style={{ background: 'var(--color-bg-elevated)' }} />
          <div className="aspect-video rounded-xl animate-pulse mb-8" style={{ background: 'var(--color-bg-elevated)' }} />
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-4 rounded animate-pulse" style={{ background: 'var(--color-bg-elevated)' }} />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (!newsItem) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg-primary)' }}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text-primary)', fontFamily: 'Space Grotesk' }}>
            {t('Haber Bulunamadı', 'News Not Found')}
          </h2>
          <Link to="/" className="text-sm" style={{ color: 'var(--color-accent)' }}>
            {t('Ana Sayfaya Dön', 'Back to Home')}
          </Link>
        </div>
      </main>
    );
  }

  const title = newsItem.translation?.title || (language === 'en' ? newsItem.trTitle : newsItem.enTitle) || t('Başlıksız', 'Untitled');
  const content = newsItem.translation?.content;
  const hasTranslation = newsItem.hasTranslation;

  return (
    <main className="min-h-screen" style={{ background: 'var(--color-bg-primary)' }}>
      <div className="container-custom max-w-3xl mx-auto" style={{ paddingTop: 120, paddingBottom: 80 }}>
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs mb-6" style={{ color: 'var(--color-text-muted)' }}>
          <Link to="/" className="no-underline hover:text-[#4ADE80] transition-colors" style={{ color: 'var(--color-text-muted)' }}>
            {t('Ana Sayfa', 'Home')}
          </Link>
          <span>/</span>
          <span>{t('Haberler', 'News')}</span>
          <span>/</span>
          <span className="truncate max-w-xs">{title}</span>
        </div>

        {/* Header */}
        <h1
          className="mb-4"
          style={{
            fontFamily: 'Space Grotesk',
            fontSize: 'clamp(28px, 4vw, 48px)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: 'var(--color-text-primary)',
            lineHeight: 1.15,
          }}
        >
          {title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <span className="flex items-center gap-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            <Calendar size={14} />
            {formatDate(newsItem.createdAt)}
          </span>
          {newsItem.category && (
            <span className="eu-badge">{language === 'en' && newsItem.category.nameEn ? newsItem.category.nameEn : newsItem.category.nameTr}</span>
          )}
        </div>

        {/* Featured Image */}
        <div className="rounded-xl overflow-hidden mb-10" style={{ aspectRatio: '16/9' }}>
          <img
            src={newsItem.featuredImage || '/uploads/news-placeholder.jpg'}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = '/uploads/news-placeholder.jpg'; }}
          />
        </div>

        {/* Content */}
        {!hasTranslation && language === 'en' ? (
          <div
            className="rounded-xl p-8 mb-10 text-center"
            style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
          >
            <p className="text-lg font-medium mb-2" style={{ color: 'var(--color-text-primary)', fontFamily: 'Space Grotesk' }}>
              {t('Haber içeriğinin çevirisi hazır değil', 'Translation not available')}
            </p>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              {t('Bu haberin İngilizce çevirisi henüz eklenmemiştir.', 'The English translation of this news has not been added yet.')}
            </p>
            {newsItem.trContent && (
              <div className="mt-6 pt-6 text-left" style={{ borderTop: '1px solid var(--color-border)' }}>
                <p className="text-xs uppercase tracking-wider mb-4" style={{ color: 'var(--color-text-muted)' }}>
                  {t('Orijinal İçerik (Türkçe)', 'Original Content (Turkish)')}
                </p>
                <div
                  className="prose prose-invert max-w-none leading-relaxed"
                  style={{ color: 'var(--color-text-secondary)' }}
                  dangerouslySetInnerHTML={{ __html: newsItem.trContent.replace(/\n/g, '<br/>') }}
                />
              </div>
            )}
          </div>
        ) : (
          <div
            className="prose prose-invert max-w-none mb-10 leading-relaxed"
            style={{ color: 'var(--color-text-secondary)' }}
            dangerouslySetInnerHTML={{ __html: (content || '').replace(/\n/g, '<br/>') }}
          />
        )}

        {/* Photo Gallery */}
        {newsItem.images && newsItem.images.length > 0 && (
          <div className="mb-10">
            <h3
              className="text-xl font-semibold mb-5"
              style={{ color: 'var(--color-text-primary)', fontFamily: 'Space Grotesk' }}
            >
              {t('Fotoğraf Galerisi', 'Photo Gallery')}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {newsItem.images.map((img, idx) => (
                <div
                  key={img.id}
                  className="rounded-lg overflow-hidden cursor-pointer group"
                  style={{ aspectRatio: '4/3' }}
                  onClick={() => setLightboxIndex(idx)}
                >
                  <img
                    src={img.imagePath}
                    alt={img.altText || title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Social Sharing */}
        <div className="mb-12">
          <h3
            className="text-xl font-semibold mb-4"
            style={{ color: 'var(--color-text-primary)', fontFamily: 'Space Grotesk' }}
          >
            {t('Paylaş', 'Share')}
          </h3>
          <div className="flex gap-3">
            {shareLinks.map((link) => (
              <a
                key={link.label}
                href={link.onClick ? undefined : link.url}
                onClick={link.onClick}
                target={link.onClick ? undefined : '_blank'}
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-[#4ADE80] hover:text-[#0A1410]"
                style={{ background: 'var(--color-bg-elevated)', color: 'var(--color-text-muted)' }}
                title={link.label}
              >
                <link.icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Related News */}
        {relatedNews && relatedNews.length > 0 && (
          <div>
            <h3
              className="text-xl font-semibold mb-5"
              style={{ color: 'var(--color-text-primary)', fontFamily: 'Space Grotesk' }}
            >
              {t('Benzer Haberler', 'Related News')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedNews.map((item) => (
                <Link
                  to={`/news/${item.slug}`}
                  key={item.id}
                  className="news-card no-underline group"
                >
                  <div className="w-full overflow-hidden" style={{ aspectRatio: '16/10' }}>
                    <img
                      src={item.featuredImage || '/uploads/news-placeholder.jpg'}
                      alt={item.title || ''}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/uploads/news-placeholder.jpg'; }}
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-medium line-clamp-2" style={{ color: 'var(--color-text-primary)', fontFamily: 'Space Grotesk' }}>
                      {item.title || t('Başlıksız', 'Untitled')}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back */}
        <div className="mt-12 pt-8" style={{ borderTop: '1px solid var(--color-border)' }}>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-[#4ADE80] no-underline"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <ArrowLeft size={16} />
            {t('Ana Sayfaya Dön', 'Back to Home')}
          </Link>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && newsItem.images && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={() => setLightboxIndex(null)}
        >
          <button 
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors p-2"
            onClick={(e) => { e.stopPropagation(); setLightboxIndex(null); }}
          >
            <X size={32} />
          </button>
          
          <button 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors p-2"
            onClick={(e) => { 
              e.stopPropagation(); 
              setLightboxIndex((prev) => prev !== null ? (prev - 1 + newsItem.images.length) % newsItem.images.length : null);
            }}
          >
            <ChevronLeft size={48} />
          </button>

          <img 
            src={newsItem.images[lightboxIndex].imagePath} 
            alt={newsItem.images[lightboxIndex].altText || ''}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          <button 
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors p-2"
            onClick={(e) => { 
              e.stopPropagation(); 
              setLightboxIndex((prev) => prev !== null ? (prev + 1) % newsItem.images.length : null);
            }}
          >
            <ChevronRight size={48} />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
            {lightboxIndex + 1} / {newsItem.images.length}
          </div>
        </div>
      )}
    </main>
  );
}
