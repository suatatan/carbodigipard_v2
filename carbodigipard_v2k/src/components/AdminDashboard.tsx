import { useLanguage } from '@/hooks/useLanguage';
import { trpc } from '@/providers/trpc';
import { Newspaper, BookOpen, Image, Eye, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const { t } = useLanguage();
  const { data: newsData } = trpc.news.adminList.useQuery({ limit: 100, offset: 0 });
  const { data: trainingData } = trpc.training.adminList.useQuery();
  const { data: partnerData } = trpc.partner.adminList.useQuery();

  const totalNews = newsData?.total ?? 0;
  const activeNews = newsData?.items.filter((n) => n.isActive === 'active').length ?? 0;
  const totalTraining = trainingData?.length ?? 0;
  const totalPartners = partnerData?.length ?? 0;

  const stats = [
    { labelTr: 'Toplam Haber', labelEn: 'Total News', value: totalNews, icon: Newspaper, color: '#4ADE80' },
    { labelTr: 'Aktif Haber', labelEn: 'Active News', value: activeNews, icon: TrendingUp, color: '#2E8B57' },
    { labelTr: 'Eğitim Materyali', labelEn: 'Training Materials', value: totalTraining, icon: BookOpen, color: '#5EF795' },
    { labelTr: 'Ortak Kurum', labelEn: 'Partner Institutions', value: totalPartners, icon: Image, color: '#4ADE80' },
  ];

  return (
    <div className="p-6 md:p-10">
      <h1
        className="text-2xl font-bold mb-8"
        style={{ color: 'var(--color-text-primary)', fontFamily: 'Space Grotesk' }}
      >
        {t('Dashboard', 'Dashboard')}
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {stats.map((stat) => (
          <div
            key={stat.labelTr}
            className="dark-forest-card flex items-center gap-4"
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}30` }}
            >
              <stat.icon size={22} style={{ color: stat.color }} />
            </div>
            <div>
              <p
                className="text-2xl font-bold"
                style={{ color: stat.color, fontFamily: 'Space Grotesk' }}
              >
                {stat.value}
              </p>
              <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                {t(stat.labelTr, stat.labelEn)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent News */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
      >
        <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)', fontFamily: 'Space Grotesk' }}>
            {t('Son Haberler', 'Recent News')}
          </h2>
        </div>
        <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
          {newsData?.items.slice(0, 5).map((item) => (
            <div key={item.id} className="px-6 py-4 flex items-center gap-4">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'var(--color-bg-elevated)' }}
              >
                <Newspaper size={16} style={{ color: 'var(--color-accent)' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>
                  {item.trTitle || t('Başlıksız', 'Untitled')}
                </p>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  {item.categoryName || t('Kategorisiz', 'Uncategorized')} · {item.isActive === 'active' ? t('Aktif', 'Active') : t('Pasif', 'Inactive')}
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs flex-shrink-0" style={{ color: 'var(--color-text-muted)' }}>
                <Eye size={12} />
                {item.viewCount}
              </div>
            </div>
          ))}
          {(!newsData || newsData.items.length === 0) && (
            <div className="px-6 py-10 text-center">
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                {t('Henüz haber bulunmuyor.', 'No news yet.')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
