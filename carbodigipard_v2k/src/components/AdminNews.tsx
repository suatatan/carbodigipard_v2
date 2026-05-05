import { useState } from 'react';
import { Link } from 'react-router';
import { useLanguage } from '@/hooks/useLanguage';
import { trpc } from '@/providers/trpc';
import { Plus, Pencil, Trash2, Eye, EyeOff, Search, AlertCircle } from 'lucide-react';

export default function AdminNews() {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.news.adminList.useQuery({ limit: pageSize, offset: page * pageSize });
  const deleteMutation = trpc.news.delete.useMutation({ onSuccess: () => utils.news.adminList.invalidate() });
  const toggleMutation = trpc.news.toggleStatus.useMutation({ onSuccess: () => utils.news.adminList.invalidate() });

  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const filtered = data?.items.filter((item) =>
    item.trTitle?.toLowerCase().includes(search.toLowerCase()) ||
    item.enTitle?.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  const handleDelete = (id: number) => {
    deleteMutation.mutate({ id });
    setConfirmDelete(null);
  };

  return (
    <div className="p-6 md:p-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)', fontFamily: 'Space Grotesk' }}>
          {t('Haber Yönetimi', 'News Management')}
        </h1>
        <Link to="/admin/news/new" className="btn-accent text-sm py-2.5 px-5 no-underline">
          <Plus size={16} />
          {t('Yeni Haber', 'New News')}
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('Haber ara...', 'Search news...')}
          className="w-full sm:w-80 pl-10 pr-4 py-2.5 rounded-lg text-sm outline-none"
          style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
        />
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>{t('Başlık (TR)', 'Title (TR)')}</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>{t('Başlık (EN)', 'Title (EN)')}</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>{t('Kategori', 'Category')}</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>{t('Durum', 'Status')}</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>{t('İşlemler', 'Actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 rounded animate-pulse" style={{ background: 'var(--color-bg-elevated)' }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length > 0 ? (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-[rgba(74,222,128,0.03)] transition-colors">
                    <td className="px-4 py-3" style={{ color: 'var(--color-text-muted)' }}>#{item.id}</td>
                    <td className="px-4 py-3 max-w-xs truncate" style={{ color: 'var(--color-text-primary)' }}>{item.trTitle || '-'}</td>
                    <td className="px-4 py-3 max-w-xs truncate" style={{ color: 'var(--color-text-secondary)' }}>{item.enTitle || '-'}</td>
                    <td className="px-4 py-3" style={{ color: 'var(--color-text-secondary)' }}>{item.categoryName || '-'}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleMutation.mutate({ id: item.id, isActive: item.isActive === 'active' ? 'inactive' : 'active' })}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                          item.isActive === 'active' ? 'text-green-400' : 'text-gray-400'
                        }`}
                        style={{ background: item.isActive === 'active' ? 'rgba(74,222,128,0.15)' : 'rgba(100,100,100,0.15)' }}
                      >
                        {item.isActive === 'active' ? <Eye size={12} /> : <EyeOff size={12} />}
                        {item.isActive === 'active' ? t('Aktif', 'Active') : t('Pasif', 'Inactive')}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/news/edit/${item.id}`}
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-[rgba(74,222,128,0.15)]"
                          style={{ color: 'var(--color-accent)' }}
                        >
                          <Pencil size={14} />
                        </Link>
                        <button
                          onClick={() => setConfirmDelete(item.id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-[rgba(239,68,68,0.15)]"
                          style={{ color: '#ef4444' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center" style={{ color: 'var(--color-text-muted)' }}>
                    {t('Haber bulunamadı.', 'No news found.')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && data.total > pageSize && (
          <div className="px-4 py-3 flex items-center justify-between" style={{ borderTop: '1px solid var(--color-border)' }}>
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="text-sm disabled:opacity-40"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {t('Önceki', 'Previous')}
            </button>
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              {page + 1} / {Math.ceil(data.total / pageSize)}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={(page + 1) * pageSize >= data.total}
              className="text-sm disabled:opacity-40"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {t('Sonraki', 'Next')}
            </button>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {confirmDelete !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="rounded-xl p-6 max-w-sm w-full" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle size={24} style={{ color: '#ef4444' }} />
              <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)', fontFamily: 'Space Grotesk' }}>
                {t('Emin misiniz?', 'Are you sure?')}
              </h3>
            </div>
            <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
              {t('Bu haber kalıcı olarak silinecektir.', 'This news will be permanently deleted.')}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="btn-outline flex-1 text-sm py-2.5"
              >
                {t('İptal', 'Cancel')}
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="flex-1 text-sm py-2.5 rounded-full font-medium transition-all"
                style={{ background: '#ef4444', color: 'white' }}
              >
                {t('Sil', 'Delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
