import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { useLanguage } from '@/hooks/useLanguage';
import { trpc } from '@/providers/trpc';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import ImageUpload from './ImageUpload';

export default function AdminNewsForm() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const utils = trpc.useUtils();
  const isEdit = !!id;

  const { data: existing } = trpc.news.adminGet.useQuery(
    { id: Number(id) },
    { enabled: isEdit }
  );
  const { data: categories } = trpc.category.adminList.useQuery();

  const createMutation = trpc.news.create.useMutation({
    onSuccess: () => { utils.news.adminList.invalidate(); navigate('/admin/news'); },
  });
  const updateMutation = trpc.news.update.useMutation({
    onSuccess: () => { utils.news.adminList.invalidate(); navigate('/admin/news'); },
  });

  // Form state
  const [slug, setSlug] = useState('');
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [featuredImage, setFeaturedImage] = useState('');
  const [isActive, setIsActive] = useState<'active' | 'inactive'>('active');

  // TR
  const [trTitle, setTrTitle] = useState('');
  const [trContent, setTrContent] = useState('');
  const [trSummary, setTrSummary] = useState('');

  // EN
  const [enTitle, setEnTitle] = useState('');
  const [enContent, setEnContent] = useState('');
  const [enSummary, setEnSummary] = useState('');

  // Images
  const [images, setImages] = useState<Array<{ id?: number; imagePath: string; altText: string; sortOrder: number }>>([]);

  useEffect(() => {
    if (existing) {
      setSlug(existing.slug);
      setCategoryId(existing.categoryId ?? undefined);
      setFeaturedImage(existing.featuredImage || '');
      setIsActive(existing.isActive as 'active' | 'inactive');

      const tr = existing.translations.find((t) => t.language === 'tr');
      const en = existing.translations.find((t) => t.language === 'en');

      if (tr) { setTrTitle(tr.title); setTrContent(tr.content); setTrSummary(tr.summary || ''); }
      if (en) { setEnTitle(en.title); setEnContent(en.content); setEnSummary(en.summary || ''); }

      setImages(existing.images.map((img) => ({
        id: img.id,
        imagePath: img.imagePath,
        altText: img.altText || '',
        sortOrder: img.sortOrder,
      })));
    }
  }, [existing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      slug,
      categoryId,
      featuredImage: featuredImage || undefined,
      isActive,
      tr: { title: trTitle, content: trContent, summary: trSummary || undefined },
      en: enTitle && enContent ? { title: enTitle, content: enContent, summary: enSummary || undefined } : undefined,
      images: images.length > 0 ? images : undefined,
    };

    if (isEdit) {
      updateMutation.mutate({ id: Number(id), ...payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const addImage = () => {
    setImages([...images, { imagePath: '', altText: '', sortOrder: images.length }]);
  };

  const removeImage = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  const updateImage = (idx: number, field: string, value: string) => {
    const updated = [...images];
    updated[idx] = { ...updated[idx], [field]: value };
    setImages(updated);
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="p-6 md:p-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/admin/news"
          className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors hover:bg-[rgba(74,222,128,0.1)]"
          style={{ color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}
        >
          <ArrowLeft size={16} />
        </Link>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)', fontFamily: 'Space Grotesk' }}>
          {isEdit ? t('Haberi Düzenle', 'Edit News') : t('Yeni Haber', 'New News')}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        {/* General Settings */}
        <div className="dark-forest-card !p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-5" style={{ color: 'var(--color-text-muted)', fontFamily: 'Space Grotesk' }}>
            {t('Genel Ayarlar', 'General Settings')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: 'var(--color-text-muted)' }}>Slug</label>
              <input
                type="text" value={slug} onChange={(e) => setSlug(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#4ADE8040]"
                style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: 'var(--color-text-muted)' }}>{t('Kategori', 'Category')}</label>
              <select
                value={categoryId || ''} onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-4 py-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#4ADE8040]"
                style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
              >
                <option value="">{t('Seçiniz', 'Select')}</option>
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.nameTr}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: 'var(--color-text-muted)' }}>{t('Kapak Görseli', 'Featured Image')}</label>
              <ImageUpload value={featuredImage} onChange={setFeaturedImage} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: 'var(--color-text-muted)' }}>{t('Durum', 'Status')}</label>
              <select
                value={isActive} onChange={(e) => setIsActive(e.target.value as 'active' | 'inactive')}
                className="w-full px-4 py-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#4ADE8040]"
                style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
              >
                <option value="active">{t('Aktif', 'Active')}</option>
                <option value="inactive">{t('Pasif', 'Inactive')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Two Column: TR + EN */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Turkish */}
          <div className="dark-forest-card !p-6">
            <div className="flex items-center gap-2 mb-5">
              <span className="eu-badge">TR</span>
              <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-primary)', fontFamily: 'Space Grotesk' }}>
                {t('Türkçe İçerik', 'Turkish Content')}
              </h2>
              <span className="text-xs ml-auto" style={{ color: '#ef4444' }}>* {t('Zorunlu', 'Required')}</span>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: 'var(--color-text-muted)' }}>{t('Başlık', 'Title')}</label>
                <input
                  type="text" value={trTitle} onChange={(e) => setTrTitle(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#4ADE8040]"
                  style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: 'var(--color-text-muted)' }}>{t('Özet', 'Summary')}</label>
                <input
                  type="text" value={trSummary} onChange={(e) => setTrSummary(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#4ADE8040]"
                  style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: 'var(--color-text-muted)' }}>{t('İçerik', 'Content')}</label>
                <textarea
                  value={trContent} onChange={(e) => setTrContent(e.target.value)}
                  required rows={12}
                  className="w-full px-4 py-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#4ADE8040] resize-y"
                  style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
                />
              </div>
            </div>
          </div>

          {/* English */}
          <div className="dark-forest-card !p-6">
            <div className="flex items-center gap-2 mb-5">
              <span className="eu-badge">EN</span>
              <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-primary)', fontFamily: 'Space Grotesk' }}>
                {t('İngilizce İçerik', 'English Content')}
              </h2>
              <span className="text-xs ml-auto" style={{ color: 'var(--color-text-muted)' }}>{t('İsteğe Bağlı', 'Optional')}</span>
            </div>
            <p className="text-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>
              {t('Boş bırakılırsa İngilizce versiyon gösterilmeyecektir.', 'Leave empty to hide the English version.')}
            </p>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: 'var(--color-text-muted)' }}>{t('Başlık', 'Title')}</label>
                <input
                  type="text" value={enTitle} onChange={(e) => setEnTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#4ADE8040]"
                  style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: 'var(--color-text-muted)' }}>{t('Özet', 'Summary')}</label>
                <input
                  type="text" value={enSummary} onChange={(e) => setEnSummary(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#4ADE8040]"
                  style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: 'var(--color-text-muted)' }}>{t('İçerik', 'Content')}</label>
                <textarea
                  value={enContent} onChange={(e) => setEnContent(e.target.value)}
                  rows={12}
                  className="w-full px-4 py-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#4ADE8040] resize-y"
                  style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Photo Gallery */}
        <div className="dark-forest-card !p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)', fontFamily: 'Space Grotesk' }}>
              {t('Fotoğraf Galerisi', 'Photo Gallery')}
            </h2>
            <button type="button" onClick={addImage} className="btn-outline text-xs py-1.5 px-3">
              <Plus size={14} />
              {t('Görsel Ekle', 'Add Image')}
            </button>
          </div>
          <div className="flex flex-col gap-6">
            {images.map((img, idx) => (
              <div key={idx} className="flex flex-col md:flex-row gap-5 items-start p-4 rounded-lg border border-[var(--color-border)]" style={{ background: 'var(--color-bg-elevated)' }}>
                <div className="w-full md:w-64 shrink-0">
                  <ImageUpload value={img.imagePath} onChange={(url) => updateImage(idx, 'imagePath', url)} />
                </div>
                <div className="flex-1 w-full flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-muted)' }}>Alt Text</label>
                    <input
                      type="text" value={img.altText}
                      onChange={(e) => updateImage(idx, 'altText', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                      style={{ background: 'var(--color-bg-primary)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
                    />
                  </div>
                  <button type="button" onClick={() => removeImage(idx)} className="btn-outline text-xs w-fit text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10">
                    <Trash2 size={14} className="mr-1 inline" /> {t('Görseli Kaldır', 'Remove Image')}
                  </button>
                </div>
              </div>
            ))}
            {images.length === 0 && (
              <p className="text-sm text-center py-4" style={{ color: 'var(--color-text-muted)' }}>
                {t('Henüz görsel eklenmemiş.', 'No images added yet.')}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button type="submit" disabled={isSubmitting} className="btn-accent disabled:opacity-60">
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {t('Kaydet', 'Save')}
          </button>
          <Link to="/admin/news" className="btn-outline no-underline inline-flex items-center">
            {t('İptal', 'Cancel')}
          </Link>
        </div>
      </form>
    </div>
  );
}
