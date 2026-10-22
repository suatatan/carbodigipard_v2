# Haber ekleme ve yayınlama

## 1. Haber metnini ekleme

1. Türkçe haber için `content/tr/news/` altında küçük harfli, boşluksuz bir Markdown dosyası oluşturun. Örneğin `vilnius-toplantisi.md`.
2. Dosyanın başına aşağıdaki ön bilgileri ekleyin. `image` yolu, kapak fotoğrafı olarak kullanılır.

   ```yaml
   ---
   title: "Haber başlığı"
   date: "2026-10-22"
   summary: "Haber listesinde görünecek kısa özet."
   category: "Etkinlik"
   image: "/uploads/vilnius-toplantisi.webp"
   featured: false
   ---
   ```

3. Haber gövdesini ön bilgi bloğunun altına Markdown olarak yazın. Gövdeye fotoğraf eklemek için:

   ```md
   ![Toplanti katilimcilari](/uploads/vilnius-toplantisi-2.webp)
   ```

## 2. Fotoğraf ekleme

1. Orijinal fotoğrafları `raw-images/` klasörüne koyun. Dosya adlarında boşluk ve Türkçe karakter kullanmamak dosya yollarını kolaylaştırır.
2. Fotoğrafları WebP'ye dönüştürmek için proje kökünde şu komutu çalıştırın:

   ```sh
   npm run optimize-images
   ```

   VS Code'da `Terminal > Run Task...` menüsünü açıp `Optimize News Photos (WebP)` görevini de seçebilirsiniz. Komut, `public/uploads/` altına tam boy, kart ve küçük WebP sürümlerini oluşturur; aynı adlı eski JPEG kopyalarını kaldırır.
3. Haberde kullanacağınız yol, oluşan dosyanın `/uploads/dosya-adi.webp` biçimindeki URL'sidir. Kapak fotoğrafı ve gövde fotoğraflarında bu yolu kullanın. Orijinal dosyaları `raw-images/` içinde saklayın.

## 3. İngilizce haber ekleme

İngilizce karşılığını aynı dosya adı/slug ile `content/en/news/` altına ekleyin. Başlık, özet ve gövdeyi çevirin; tarih ve fotoğraf yollarını Türkçe haberle aynı tutun. Dil değiştirme bağlantısı iki dilde aynı slug'ı kullandığı için dosya adları birebir aynı olmalıdır.

## 4. Yerelde kontrol etme

- VS Code'da `F5` tuşuna basın ve `🚀 Lokalde Çalıştır (npm run dev)` seçeneğini başlatın. Alternatif olarak terminalde `npm run dev` çalıştırıp `http://localhost:4321` adresini açın.
- Türkçe haberi `/tr/haberler/vilnius-toplantisi`, İngilizce haberi `/en/news/vilnius-toplantisi` adreslerinde kontrol edin.
- Yayın öncesi üretim derlemesini doğrulayın:

  ```sh
  npm run build
  ```

## 5. Netlify'a yayınlama

Projeyi ilk kez bu makineden yayınlıyorsanız Netlify kimlik doğrulaması yapın ve siteyi bağlayın:

```sh
npm run netlify:login
npm run netlify:link
```

Değişiklikleri önce taslak olarak yayınlamak için:

```sh
npm run deploy:draft
```

Canlı siteye yayınlamak için:

```sh
npm run deploy:prod
```

Her iki komut da önce üretim derlemesini alır ve ardından Netlify'a yükler. Canlı yayın görevi VS Code'da `Terminal > Run Task... > Deploy to Netlify (Production)` altında da bulunur. İlk kez site oluşturulacaksa `npm run deploy:first` komutunu kullanın; site zaten oluşturulduysa bunu tekrar kullanmayın.
