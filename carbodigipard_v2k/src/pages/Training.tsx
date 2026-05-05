import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { trpc } from '@/providers/trpc';
import { Play, FileText, Clock, BookOpen, Video, File } from 'lucide-react';

type TabType = 'video' | 'document' | 'all';

const sidebarItems = [
  { key: 'all' as TabType, tr: 'Tüm Materyaller', en: 'All Materials', icon: BookOpen },
  { key: 'video' as TabType, tr: 'Eğitim Videoları', en: 'Training Videos', icon: Video },
  { key: 'document' as TabType, tr: 'Dokümanlar', en: 'Documents', icon: File },
];

export default function Training() {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const { data: materials, isLoading } = trpc.training.list.useQuery({
    type: activeTab === 'all' ? undefined : activeTab,
    language,
  });

  const [videoModal, setVideoModal] = useState<string | null>(null);

  return (
    <main className="min-h-screen" style={{ background: 'var(--color-bg-primary)' }}>
      {/* Header */}
      <div className="relative overflow-hidden" style={{ background: 'var(--color-bg-hero)', paddingTop: 120, paddingBottom: 60 }}>
        <div className="container-custom">
          <h1
            style={{
              fontFamily: 'Space Grotesk',
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: 'var(--color-text-primary)',
            }}
          >
            {t('Eğitim Merkezi', 'Training Center')}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            {t(
              'Karbon ayak izi azaltma konusunda kapsamlı eğitim materyallerine erişin.',
              'Access comprehensive training materials on carbon footprint reduction.'
            )}
          </p>
        </div>
      </div>

      <div className="container-custom py-12">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {sidebarItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === item.key
                  ? 'text-[#0A1410]'
                  : ''
              }`}
              style={{
                background: activeTab === item.key ? 'var(--color-accent)' : 'var(--color-bg-secondary)',
                color: activeTab === item.key ? '#0A1410' : 'var(--color-text-secondary)',
                border: activeTab === item.key ? 'none' : '1px solid var(--color-border)',
              }}
            >
              <item.icon size={16} />
              {t(item.tr, item.en)}
            </button>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 rounded-xl animate-pulse" style={{ background: 'var(--color-bg-elevated)' }} />
            ))}
          </div>
        ) : materials && materials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {materials.map((material) => (
              <div
                key={material.id}
                className="dark-forest-card p-0 overflow-hidden flex flex-col"
              >
                {/* Thumbnail */}
                <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16/9' }}>
                  <img
                    src={material.thumbnailPath || '/uploads/training-placeholder.jpg'}
                    alt={material.title || ''}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  {material.materialType === 'video' && (
                    <button
                      onClick={() => material.videoUrl && setVideoModal(material.videoUrl)}
                      className="absolute inset-0 flex items-center justify-center group cursor-pointer"
                      style={{ background: 'rgba(0,0,0,0.3)' }}
                    >
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                        style={{ background: 'var(--color-accent)' }}
                      >
                        <Play size={28} style={{ color: '#0A1410', marginLeft: 2 }} />
                      </div>
                    </button>
                  )}
                  {material.materialType === 'document' && (
                    <div className="absolute top-3 right-3 w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-bg-primary)' }}>
                      <FileText size={18} style={{ color: 'var(--color-accent)' }} />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col gap-3 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded"
                      style={{
                        background: material.materialType === 'video' ? 'rgba(74,222,128,0.15)' : 'rgba(46,139,87,0.15)',
                        color: material.materialType === 'video' ? 'var(--color-accent)' : 'var(--color-accent-dim)',
                      }}
                    >
                      {material.materialType === 'video' ? t('Video', 'Video') : t('Doküman', 'Document')}
                    </span>
                    {material.duration && (
                      <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        <Clock size={12} />
                        {material.duration}
                      </span>
                    )}
                  </div>

                  <h3
                    className="text-lg font-semibold leading-snug"
                    style={{ color: 'var(--color-text-primary)', fontFamily: 'Space Grotesk' }}
                  >
                    {material.title || t('Başlıksız', 'Untitled')}
                  </h3>

                  {material.description && (
                    <p className="text-sm line-clamp-2 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                      {material.description}
                    </p>
                  )}

                  <div className="mt-auto pt-3">
                    {material.materialType === 'video' && material.videoUrl ? (
                      <button
                        onClick={() => setVideoModal(material.videoUrl)}
                        className="btn-accent text-sm py-2.5 px-5 no-underline"
                      >
                        <Play size={14} />
                        {t('İzle', 'Watch')}
                      </button>
                    ) : material.documentPath ? (
                      <a
                        href={material.documentPath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-accent text-sm py-2.5 px-5 no-underline"
                      >
                        <FileText size={14} />
                        {t('İndir', 'Download')}
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <BookOpen size={48} className="mx-auto mb-4" style={{ color: 'var(--color-text-muted)' }} />
            <p className="text-lg font-medium" style={{ color: 'var(--color-text-secondary)' }}>
              {t('Henüz eğitim materyali bulunmuyor.', 'No training materials yet.')}
            </p>
          </div>
        )}
      </div>

      {/* Video Modal */}
      {videoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.85)' }}
          onClick={() => setVideoModal(null)}
        >
          <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setVideoModal(null)}
              className="absolute -top-10 right-0 text-white hover:text-[#4ADE80] transition-colors text-sm"
            >
              {t('Kapat', 'Close')} ✕
            </button>
            <div className="rounded-xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
              <iframe
                src={videoModal}
                title="Training Video"
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
