# CARBODIGIPARD — Yönetim Kılavuzu

## Lokalde Çalıştırma

```bash
# Bağımlılıkları yükle (ilk kurulumda bir kez)
npm install

# Geliştirme sunucusunu başlat
npm run dev
```

Tarayıcıda aç: **http://localhost:4321**

Değişiklikler kaydedildiğinde sayfa otomatik yenilenir.

---

## Derleme ve Önizleme

```bash
# Prodüksiyon build al (dist/ klasörüne)
npm run build

# Build çıktısını lokalde önizle
npm run preview
```

---

## İçerik Yönetimi

### Yeni Haber Eklemek

`content/tr/news/` veya `content/en/news/` altına `.md` dosyası oluştur:

```md
---
title: "Haber Başlığı"
date: "2026-05-05"
summary: "Kısa özet metni buraya."
category: "Duyuru"
image: "/uploads/gorsel-adi.webp"
featured: false
---

## Haber İçeriği

Buraya Markdown formatında içerik yazılır.
```

**Kategori seçenekleri** (`data/categories.json`):
- TR: `Duyuru`, `Etkinlik`, `Yayın`, `Rapor`
- EN: `Announcement`, `Event`, `Publication`, `Report`

Dosya adı URL slug'ı olur: `proje-guncelleme.md` → `/tr/haberler/proje-guncelleme`

---

### Yeni Eğitim Materyali Eklemek

`content/tr/training/` veya `content/en/training/` altına `.md` dosyası:

```md
---
title: "Modül Adı"
date: "2026-05-05"
summary: "Kısa açıklama."
category: "Eğitim"
duration: "30 dk"
videoUrl: "https://www.youtube.com/embed/VIDEO_ID"
image: ""
---

## Modül İçeriği
```

`videoUrl` dolu ise detay sayfasında embed player gösterilir.

---

### Ortak / Partner Eklemek

`data/partners.json` dosyasını düzenle:

```json
{
  "id": 7,
  "name": "Kuruluş Adı",
  "abbreviation": "KSA",
  "country": "Türkiye",
  "role": "Ortak",
  "website": "https://kuruluş.edu.tr",
  "logo": "/uploads/kuruluş-logo.webp"
}
```

---

### Sosyal Medya Bağlantılarını Güncellemek

`data/social-links.json` dosyasını düzenle:

```json
{
  "platform": "LinkedIn",
  "url": "https://www.linkedin.com/in/carbodigipard-carbodigipard-3615023a0/",
  "icon": "in",
  "handle": "@carbodigipard"
}
```

---

### Site Ayarlarını Güncellemek

`data/site-settings.json` → başlık, tagline, proje süresi, iletişim e-postası.

---

## Görsel Optimizasyonu

```bash
# Ham görseli raw-images/ klasörüne koy, ardından:
npm run optimize-images
```

Çıktılar otomatik olarak `public/uploads/` klasörüne kaydedilir (800 / 1200 / 1600 px, WebP + JPEG).

Acil durumda: görseli doğrudan `public/uploads/` klasörüne atabilirsin.

---

## Netlify'a Deploy

### Tek Tık Deploy (VS Code Task)

İlk kurulum (sadece 1 kez):

```bash
npm run netlify:setup
```

Ardından VS Code'da:

1. `Ctrl+Shift+P` → `Tasks: Run Task`
2. `Deploy to Netlify (Production)` seç

Bu görev tek tıkta `build + production deploy` yapar.

Alternatif komut:

```bash
npm run deploy:prod
```

### Otomatik Deploy (önerilen)

1. Repoyu GitHub'a push et
2. Netlify panelinde projeyi GitHub reposuna bağla
3. Build ayarları `netlify.toml` dosyasından otomatik okunur:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Node version:** 20

Her `git push` sonrası deploy otomatik tetiklenir.

### Manuel Deploy

```bash
npm run build
# dist/ klasörünü Netlify'a sürükle-bırak ile deploy edebilirsin
```

---

## Dil Yönetimi

| İşlem | TR dosyası | EN dosyası |
|---|---|---|
| Haber | `content/tr/news/` | `content/en/news/` |
| Eğitim | `content/tr/training/` | `content/en/training/` |
| Hakkında sayfası | `src/pages/tr/hakkinda.astro` | `src/pages/en/about.astro` |
| Nav linkleri | `src/components/Header.astro` | (aynı dosya, `navItems` sabiti) |

Dil değiştirici header'da otomatik çalışır — ekstra ayar gerekmez.

---

## Klasör Yapısı Özeti

```
content/          ← Tüm Markdown içerikler buraya
data/             ← JSON ile yönetilen veriler (partners, social, settings)
raw-images/       ← Ham görseller (optimize edilmeden önce)
public/uploads/   ← Optimize edilmiş, siteye sunulan görseller
src/components/   ← Header, Footer, kartlar
src/layouts/      ← BaseLayout (SEO meta, HTML iskelet)
src/pages/        ← Sayfa dosyaları (tr/ ve en/)
src/styles/       ← Global CSS
scripts/          ← Görsel optimizasyon scripti
dist/             ← Build çıktısı (deploy edilecek klasör)
```

---

## Sık Kullanılan Komutlar

| Komut | Açıklama |
|---|---|
| `npm run dev` | Geliştirme sunucusunu başlat |
| `npm run build` | Prodüksiyon build |
| `npm run preview` | Build çıktısını önizle |
| `npm run optimize-images` | Ham görselleri optimize et |
| `npm run deploy:prod` | Build alır ve Netlify production'a deploy eder |
| `npm run netlify:setup` | İlk kurulum: Netlify login + site link |
| `npm run netlify:login` | Netlify CLI oturum açma (ilk kurulum) |
| `npm run netlify:link` | Projeyi Netlify site ile eşleştirir (ilk kurulum) |
