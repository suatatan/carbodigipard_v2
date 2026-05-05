import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { trpc } from '@/providers/trpc';
import { Plus, Pencil, Trash2, AlertCircle, Play, FileText } from 'lucide-react';

export default function AdminTraining() {
  const { t } = useLanguage();
  const utils = trpc.useUtils();
  const { data: materials, isLoading } = trpc.training.adminList.useQuery();
  const { data: categories } = trpc.category.adminList.useQuery();

  const createMutation = trpc.training.create.useMutation({
    onSuccess: () => { utils.training.adminList.invalidate(); resetForm(); },
  });
  const updateMutation = trpc.training.update.useMutation({ onSuccess: () => utils.training.adminList.invalidate() });
  const deleteMutation = trpc.training.delete.useMutation({ onSuccess: () => utils.training.adminList.invalidate() });

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [titleTr, setTitleTr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [descTr, setDescTr] = useState('');
  const [descEn, setDescEn] = useState('');
  const [materialType, setMaterialType] = useState<'video' | 'document'>('video');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailPath, setThumbnailPath] = useState('');
  const [duration, setDuration] = useState('');
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const resetForm = () => {
    setFormOpen(false); setEditingId(null); setTitleTr(''); setTitleEn(''); setDescTr(''); setDescEn('');
    setMaterialType('video'); setVideoUrl(''); setThumbnailPath(''); setDuration(''); setCategoryId(undefined);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleTr) return;
    const payload = {
      titleTr, titleEn: titleEn || undefined, descriptionTr: descTr || undefined, descriptionEn: descEn || undefined,
      materialType, videoUrl: materialType === 'video' ? videoUrl || undefined : undefined,
      thumbnailPath: thumbnailPath || undefined, duration: duration || undefined, categoryId, sortOrder: 0,
    };
    if (editingId) {
      updateMutation.mutate({ id: editingId, ...payload });
    } else {
      createMutation.mutate(payload);
    }
    resetForm();
  };

  const startEdit = (m: NonNullable<typeof materials>[number]) => {
    setEditingId(m.id); setTitleTr(m.titleTr); setTitleEn(m.titleEn || '');
    setDescTr(m.descriptionTr || ''); setDescEn(m.descriptionEn || '');
    setMaterialType(m.materialType as 'video' | 'document'); setVideoUrl(m.videoUrl || '');
    setThumbnailPath(m.thumbnailPath || ''); setDuration(m.duration || ''); setCategoryId(m.categoryId ?? undefined);
    setFormOpen(true);
  };

  return (
    <div className="p-6 md:p-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)', fontFamily: 'Space Grotesk' }}>
          {t('Eğitim Materyali Yönetimi', 'Training Material Management')}
        </h1>
        <button onClick={() => setFormOpen(!formOpen)} className="btn-accent text-sm py-2.5 px-5">
          <Plus size={16} /> {formOpen ? t('Kapat', 'Close') : t('Yeni Materyal', 'New Material')}
        </button>
      </div>

      {formOpen && (
        <form onSubmit={handleSubmit} className="dark-forest-card !p-5 mb-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--color-text-muted)', fontFamily: 'Space Grotesk' }}>
            {editingId ? t('Materyali Düzenle', 'Edit Material') : t('Yeni Materyal Ekle', 'Add New Material')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-muted)' }}>{t('Başlık (TR)', 'Title (TR)')} *</label>
              <input type="text" value={titleTr} onChange={(e) => setTitleTr(e.target.value)} required
                className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-muted)' }}>{t('Başlık (EN)', 'Title (EN)')}</label>
              <input type="text" value={titleEn} onChange={(e) => setTitleEn(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-muted)' }}>{t('Tür', 'Type')}</label>
              <select value={materialType} onChange={(e) => setMaterialType(e.target.value as 'video' | 'document')}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}>
                <option value="video">{t('Video', 'Video')}</option>
                <option value="document">{t('Doküman', 'Document')}</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-muted)' }}>{t('Kategori', 'Category')}</label>
              <select value={categoryId || ''} onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}>
                <option value="">{t('Seçiniz', 'Select')}</option>
                {categories?.map((c) => <option key={c.id} value={c.id}>{c.nameTr}</option>)}
              </select>
            </div>
            {materialType === 'video' && (
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-muted)' }}>YouTube URL</label>
                <input type="text" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://youtube.com/embed/..."
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
              </div>
            )}
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-muted)' }}>{t('Thumbnail URL', 'Thumbnail URL')}</label>
              <input type="text" value={thumbnailPath} onChange={(e) => setThumbnailPath(e.target.value)} placeholder="https://..."
                className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-muted)' }}>{t('Süre', 'Duration')}</label>
              <input type="text" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="45 dk / min"
                className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-muted)' }}>{t('Açıklama (TR)', 'Description (TR)')}</label>
              <textarea value={descTr} onChange={(e) => setDescTr(e.target.value)} rows={3}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-y" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" disabled={createMutation.isPending} className="btn-accent text-sm py-2.5">
                {t('Kaydet', 'Save')}
              </button>
              <button type="button" onClick={resetForm} className="btn-outline text-sm py-2.5">{t('İptal', 'Cancel')}</button>
            </div>
          </div>
        </form>
      )}

      <div className="rounded-xl overflow-hidden" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase" style={{ color: 'var(--color-text-muted)' }}>ID</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase" style={{ color: 'var(--color-text-muted)' }}>{t('Başlık', 'Title')}</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase" style={{ color: 'var(--color-text-muted)' }}>{t('Tür', 'Type')}</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase" style={{ color: 'var(--color-text-muted)' }}>{t('Kategori', 'Category')}</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase" style={{ color: 'var(--color-text-muted)' }}>{t('Durum', 'Status')}</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase" style={{ color: 'var(--color-text-muted)' }}>{t('İşlemler', 'Actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i}>{Array.from({ length: 6 }).map((_, j) => (
                  <td key={j} className="px-4 py-3"><div className="h-4 rounded animate-pulse" style={{ background: 'var(--color-bg-elevated)' }} /></td>
                ))}</tr>
              ))
            ) : materials?.map((m) => (
              <tr key={m.id}>
                <td className="px-4 py-3" style={{ color: 'var(--color-text-muted)' }}>#{m.id}</td>
                <td className="px-4 py-3" style={{ color: 'var(--color-text-primary)' }}>{m.titleTr}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded ${m.materialType === 'video' ? 'text-green-400' : 'text-teal-400'}`}
                    style={{ background: m.materialType === 'video' ? 'rgba(74,222,128,0.15)' : 'rgba(45,212,191,0.15)' }}>
                    {m.materialType === 'video' ? <Play size={12} /> : <FileText size={12} />}
                    {m.materialType === 'video' ? t('Video', 'Video') : t('Doküman', 'Document')}
                  </span>
                </td>
                <td className="px-4 py-3" style={{ color: 'var(--color-text-secondary)' }}>{m.categoryName || '-'}</td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-1 rounded" style={{ background: m.isActive === 'active' ? 'rgba(74,222,128,0.15)' : 'rgba(100,100,100,0.15)', color: m.isActive === 'active' ? '#4ADE80' : '#888' }}>
                    {m.isActive === 'active' ? t('Aktif', 'Active') : t('Pasif', 'Inactive')}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => startEdit(m)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ color: 'var(--color-accent)' }}>
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => setConfirmDelete(m.id)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ color: '#ef4444' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {confirmDelete !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="rounded-xl p-6 max-w-sm w-full" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
            <div className="flex items-center gap-3 mb-4"><AlertCircle size={24} style={{ color: '#ef4444' }} />
              <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>{t('Emin misiniz?', 'Are you sure?')}</h3>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="btn-outline flex-1 text-sm py-2.5">{t('İptal', 'Cancel')}</button>
              <button onClick={() => { deleteMutation.mutate({ id: confirmDelete }); setConfirmDelete(null); }} className="flex-1 text-sm py-2.5 rounded-full font-medium" style={{ background: '#ef4444', color: 'white' }}>{t('Sil', 'Delete')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
