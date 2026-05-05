import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { trpc } from '@/providers/trpc';
import { Plus, Pencil, Trash2, AlertCircle } from 'lucide-react';

export default function AdminCategories() {
  const { t } = useLanguage();
  const utils = trpc.useUtils();
  const { data: categories, isLoading } = trpc.category.adminList.useQuery();

  const createMutation = trpc.category.create.useMutation({
    onSuccess: () => { utils.category.adminList.invalidate(); setNewNameTr(''); setNewNameEn(''); setNewSlug(''); },
  });
  const updateMutation = trpc.category.update.useMutation({ onSuccess: () => utils.category.adminList.invalidate() });
  const deleteMutation = trpc.category.delete.useMutation({ onSuccess: () => utils.category.adminList.invalidate() });

  const [newNameTr, setNewNameTr] = useState('');
  const [newNameEn, setNewNameEn] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [editing, setEditing] = useState<number | null>(null);
  const [editNameTr, setEditNameTr] = useState('');
  const [editNameEn, setEditNameEn] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNameTr || !newSlug) return;
    createMutation.mutate({ nameTr: newNameTr, nameEn: newNameEn || undefined, slug: newSlug, sortOrder: (categories?.length ?? 0) + 1 });
  };

  const handleUpdate = (id: number) => {
    updateMutation.mutate({ id, nameTr: editNameTr, nameEn: editNameEn });
    setEditing(null);
  };

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-text-primary)', fontFamily: 'Space Grotesk' }}>
        {t('Kategori Yönetimi', 'Category Management')}
      </h1>

      {/* Add form */}
      <form onSubmit={handleCreate} className="dark-forest-card !p-5 mb-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--color-text-muted)', fontFamily: 'Space Grotesk' }}>
          {t('Yeni Kategori', 'New Category')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-muted)' }}>{t('Ad (TR)', 'Name (TR)')} *</label>
            <input type="text" value={newNameTr} onChange={(e) => setNewNameTr(e.target.value)} required
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-muted)' }}>{t('Ad (EN)', 'Name (EN)')}</label>
            <input type="text" value={newNameEn} onChange={(e) => setNewNameEn(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-muted)' }}>Slug *</label>
            <input type="text" value={newSlug} onChange={(e) => setNewSlug(e.target.value)} required
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
          </div>
          <button type="submit" disabled={createMutation.isPending} className="btn-accent text-sm py-2.5 md:col-span-3 justify-center">
            <Plus size={14} /> {t('Ekle', 'Add')}
          </button>
        </div>
      </form>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase" style={{ color: 'var(--color-text-muted)' }}>ID</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase" style={{ color: 'var(--color-text-muted)' }}>{t('Ad (TR)', 'Name (TR)')}</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase" style={{ color: 'var(--color-text-muted)' }}>{t('Ad (EN)', 'Name (EN)')}</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase" style={{ color: 'var(--color-text-muted)' }}>Slug</th>
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
            ) : categories?.map((cat) => (
              <tr key={cat.id}>
                <td className="px-4 py-3" style={{ color: 'var(--color-text-muted)' }}>#{cat.id}</td>
                <td className="px-4 py-3">
                  {editing === cat.id ? (
                    <input type="text" value={editNameTr} onChange={(e) => setEditNameTr(e.target.value)}
                      className="w-full px-2 py-1 rounded text-sm outline-none"
                      style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
                  ) : (
                    <span style={{ color: 'var(--color-text-primary)' }}>{cat.nameTr}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {editing === cat.id ? (
                    <input type="text" value={editNameEn} onChange={(e) => setEditNameEn(e.target.value)}
                      className="w-full px-2 py-1 rounded text-sm outline-none"
                      style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
                  ) : (
                    <span style={{ color: 'var(--color-text-secondary)' }}>{cat.nameEn || '-'}</span>
                  )}
                </td>
                <td className="px-4 py-3" style={{ color: 'var(--color-text-muted)' }}>{cat.slug}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {editing === cat.id ? (
                      <>
                        <button onClick={() => handleUpdate(cat.id)} className="text-xs px-3 py-1 rounded" style={{ background: 'var(--color-accent)', color: '#0A1410' }}>
                          {t('Kaydet', 'Save')}
                        </button>
                        <button onClick={() => setEditing(null)} className="text-xs px-3 py-1 rounded" style={{ border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>
                          {t('İptal', 'Cancel')}
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => { setEditing(cat.id); setEditNameTr(cat.nameTr); setEditNameEn(cat.nameEn || ''); }}
                          className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ color: 'var(--color-accent)' }}>
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => setConfirmDelete(cat.id)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ color: '#ef4444' }}>
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
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
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle size={24} style={{ color: '#ef4444' }} />
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
