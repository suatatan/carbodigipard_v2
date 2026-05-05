import { useState, useRef } from 'react';
import { UploadCloud, Loader2, X, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { toast } from 'sonner';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  className?: string;
}

export default function ImageUpload({ value, onChange, className = '' }: ImageUploadProps) {
  const { t } = useLanguage();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t('Dosya boyutu en fazla 5MB olabilir.', 'File size must be less than 5MB.'));
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      const data = await res.json();
      onChange(data.url);
      toast.success(t('Görsel başarıyla yüklendi.', 'Image uploaded successfully.'));
    } catch (err) {
      console.error(err);
      toast.error(t('Görsel yüklenirken bir hata oluştu.', 'An error occurred while uploading the image.'));
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    onChange('');
  };

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {value ? (
        <div className="relative group rounded-lg overflow-hidden border border-[var(--color-border)]" style={{ background: 'var(--color-bg-elevated)', aspectRatio: '16/9' }}>
          <img src={value} alt="Uploaded" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white backdrop-blur-sm transition-colors"
              title={t('Değiştir', 'Change')}
            >
              <UploadCloud size={18} />
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="w-10 h-10 rounded-full bg-red-500/80 hover:bg-red-500 flex items-center justify-center text-white backdrop-blur-sm transition-colors"
              title={t('Kaldır', 'Remove')}
            >
              <X size={18} />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="relative rounded-lg border-2 border-dashed border-[var(--color-border)] hover:border-[#4ADE80] transition-colors cursor-pointer flex flex-col items-center justify-center gap-3"
          style={{ background: 'var(--color-bg-elevated)', aspectRatio: '16/9' }}
        >
          {isUploading ? (
            <Loader2 className="animate-spin" size={24} style={{ color: 'var(--color-accent)' }} />
          ) : (
            <>
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[rgba(74,222,128,0.1)] text-[#4ADE80]">
                <ImageIcon size={24} />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                  {t('Görsel Yükle', 'Upload Image')}
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
                  {t('Sürükleyip bırakın veya tıklayın', 'Drag and drop or click')}
                </p>
              </div>
            </>
          )}
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <div className="flex gap-2 items-center">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
          className="flex-1 px-3 py-2 rounded-lg text-xs outline-none"
          style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
        />
      </div>
    </div>
  );
}
