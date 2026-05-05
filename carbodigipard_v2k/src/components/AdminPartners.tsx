import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { trpc } from '@/providers/trpc';
import { Plus, Pencil, Trash2, AlertCircle, Globe, Image } from 'lucide-react';

export default function AdminPartners() {
  const { t } = useLanguage();
  const utils = trpc.useUtils();
  const { data: partners, isLoading } = trpc.partner.adminList.useQuery();

  const createMutation = trpc.partner.create.useMutation({
    onSuccess: () => { utils.partner.adminList.invalidate(); resetForm(); },
  });
  const updateMutation = trpc.partner.update.useMutation({ onSuccess: () => utils.partner.adminList.invalidate() });
  const deleteMutation = trpc.partner.delete.useMutation({ onSuccess: () => utils.partner.adminList.invalidate() });

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [nameTr, setNameTr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [logoPath, setLogoPath] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const resetForm = () => {
    setFormOpen(false);
    setEditingId(null);
    setNameTr('');
    setNameEn('');
    setLogoPath('');
    setWebsiteUrl('');
    setSortOrder(0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameTr) return;
    if (editingId) {
      updateMutation.mutate({ id: editingId, nameTr, nameEn: nameEn || undefined, logoPath, websiteUrl, sortOrder });
    } else {
      createMutation.mutate({ nameTr, nameEn: nameEn || undefined, logoPath, websiteUrl, sortOrder });
    }
    resetForm();
  };

  const startEdit = (p: NonNullable<typeof partners>[number]) => {
    setEditingId(p.id);
    setNameTr(p.nameTr);
    setNameEn(p.nameEn || '');
    setLogoPath(p.logoPath);
    setWebsiteUrl(p.websiteUrl || '');
    setSortOrder(p.sortOrder);
    setFormOpen(true);
  };

  return (
    <div className="p-6 md:p-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)', fontFamily: 'Space Grotesk' }}>
          {t('Ortak Logo Yönetimi', 'Partner Logo Management')}
        </h1>
        <button onClick={() => setFormOpen(!formOpen)} className="btn-accent text-sm py-2.5 px-5">
          <Plus size={16} /> {formOpen ? t('Kapat', 'Close') : t('Yeni Logo', 'New Logo')}
        </button>
      </div>

      {formOpen && (
        <form onSubmit={handleSubmit} className="dark-forest-card !p-5 mb-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--color-text-muted)', fontFamily: 'Space Grotesk' }}>
            {editingId ? t('Logoyu Düzenle', 'Edit Logo') : t('Yeni Logo Ekle', 'Add New Logo')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-muted)' }}>{t('İsim (TR)', 'Name (TR)')} *</label>
              <input type="text" value={nameTr} onChange={(e) => setNameTr(e.target.value)} required
                className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-muted)' }}>{t('İsim (EN)', 'Name (EN)')}</label>
              <input type="text" value={nameEn} onChange={(e) => setNameEn(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-muted)' }}>{t('Logo URL', 'Logo URL')}</label>
              <input type="text" value={logoPath} onChange={(e) => setLogoPath(e.target.value)} placeholder="https://..."
                className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-muted)' }}>{t('Website URL', 'Website URL')}</label>
              <input type="text" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://..."
                className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="btn-accent text-sm py-2.5">
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
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase" style={{ color: 'var(--color-text-muted)' }}>{t('Logo', 'Logo')}</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase" style={{ color: 'var(--color-text-muted)' }}>{t('İsim', 'Name')}</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase" style={{ color: 'var(--color-text-muted)' }}>URL</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase" style={{ color: 'var(--color-text-muted)' }}>{t('İşlemler', 'Actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i}>{Array.from({ length: 5 }).map((_, j) => (
                  <td key={j} className="px-4 py-3"><div className="h-4 rounded animate-pulse" style={{ background: 'var(--color-bg-elevated)' }} /></td>
                ))}</tr>
              ))
            ) : partners?.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3" style={{ color: 'var(--color-text-muted)' }}>#{p.id}</td>
                <td className="px-4 py-3">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}>
                    {p.logoPath ? (
                      <img src={p.logoPath} alt="" className="w-10 h-10 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    ) : (
                      <Image size={18} style={{ color: 'var(--color-text-muted)' }} />
                    )}
                  </div>
                </td>
                <td className="px-4 py-3" style={{ color: 'var(--color-text-primary)' }}>{p.nameTr}</td>
                <td className="px-4 py-3">
                  {p.websiteUrl ? (
                    <a href={p.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs no-underline hover:underline" style={{ color: 'var(--color-accent)' }}>
                      <Globe size={12} /> Link
                    </a>
                  ) : (
                    <span style={{ color: 'var(--color-text-muted)' }}>-</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => startEdit(p)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ color: 'var(--color-accent)' }}>
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => setConfirmDelete(p.id)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ color: '#ef4444' }}>
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
