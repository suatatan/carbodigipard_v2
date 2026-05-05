import { getDb } from "../api/queries/connection";
import bcrypt from "bcryptjs";
import {
  adminUsers,
  categories,
  news,
  newsTranslations,
  partnerLogos,
  trainingMaterials,
  socialLinks,
  siteSettings,
} from "./schema";

async function seed() {
  const db = getDb();
  console.log("Seeding database...");

  // ─── 1. Admin User ──────────────────────────────────────────────
  console.log("Creating admin user...");
  const passwordHash = await bcrypt.hash("admin123", 10);
  await db.insert(adminUsers).values({
    username: "admin",
    passwordHash,
    name: "System Admin",
    role: "admin",
    isActive: "active",
  });
  console.log("  ✓ Admin user created (username: admin, password: admin123)");

  // ─── 2. Categories ──────────────────────────────────────────────
  console.log("Creating categories...");
  await db.insert(categories).values([
    { nameTr: "Proje Haberleri", nameEn: "Project News", slug: "proje-haberleri", sortOrder: 1 },
    { nameTr: "Eğitim", nameEn: "Training", slug: "egitim", sortOrder: 2 },
    { nameTr: "Genel", nameEn: "General", slug: "genel", sortOrder: 3 },
  ]);
  console.log("  ✓ 3 categories created");

  // ─── 3. Partner Logos ───────────────────────────────────────────
  console.log("Creating partner logos...");
  await db.insert(partnerLogos).values([
    {
      nameTr: "Avrupa Birliği",
      nameEn: "European Union",
      logoPath: "/partners/eu-logo.png",
      websiteUrl: "https://european-union.europa.eu",
      sortOrder: 1,
      isActive: "active",
    },
    {
      nameTr: "Tarım ve Orman Bakanlığı",
      nameEn: "Ministry of Agriculture and Forestry",
      logoPath: "/partners/tarim-logo.png",
      websiteUrl: "https://www.tarim.gov.tr",
      sortOrder: 2,
      isActive: "active",
    },
    {
      nameTr: "Ankara Üniversitesi",
      nameEn: "Ankara University",
      logoPath: "/partners/ankara-uni-logo.png",
      websiteUrl: "https://www.ankara.edu.tr",
      sortOrder: 3,
      isActive: "active",
    },
    {
      nameTr: "TÜBİTAK",
      nameEn: "TUBITAK",
      logoPath: "/partners/tubitak-logo.png",
      websiteUrl: "https://www.tubitak.gov.tr",
      sortOrder: 4,
      isActive: "active",
    },
  ]);
  console.log("  ✓ 4 partner logos created");

  // ─── 4. News with Translations ──────────────────────────────────
  console.log("Creating news articles...");

  // News 1
  const [news1] = await db.insert(news).values({
    slug: "ipard-isletmeleri-karbon-hesaplama-egitimi",
    categoryId: 1,
    featuredImage: "/uploads/news-1.jpg",
    isActive: "active",
    viewCount: 156,
  });
  const news1Id = Number(news1.insertId);

  await db.insert(newsTranslations).values([
    {
      newsId: news1Id,
      language: "tr",
      title: "IPARD İşletmeleri için Karbon Ayak İzi Hesaplama Eğitimi Düzenlendi",
      content: `CARBODIGIPARD projesi kapsamında, IPARD destekli işletmelerin karbon ayak izi hesaplama yetkinliklerini geliştirmek amacıyla kapsamlı bir eğitim programı düzenlendi.

Eğitim programında, katılımcılara karbon ayak izi kavramları, sera gazı emisyon kategorileri (Scope 1, 2, 3), karbon hesaplama metodolojileri ve raporlama standartları hakkında detaylı bilgiler aktarıldı.

Eğitimde ayrıca, proje kapsamında geliştirilen yapay zeka destekli karbon haritalama aracı tanıtıldı ve katılımcılara canlı demo gösterimi yapıldı. İşletme temsilcileri, kendi tesislerinin karbon ayak izini hesaplamak için gerekli adımları pratik olarak uyguladılar.

Eğitim sonunda katılımcılara sertifika verildi ve ileriye dönük olarak e-öğrenme platformunun kullanımı hakkında bilgilendirme yapıldı.`,
      summary: "IPARD işletmeleri için karbon ayak izi hesaplama eğitimi başarıyla tamamlandı.",
    },
    {
      newsId: news1Id,
      language: "en",
      title: "Carbon Footprint Calculation Training Organized for IPARD Enterprises",
      content: `Within the scope of the CARBODIGIPARD project, a comprehensive training program was organized to develop the carbon footprint calculation competencies of IPARD-supported enterprises.

The training program provided participants with detailed information on carbon footprint concepts, greenhouse gas emission categories (Scope 1, 2, 3), carbon calculation methodologies, and reporting standards.

The training also introduced the AI-powered carbon mapping tool developed within the project, with a live demo for participants. Enterprise representatives practically applied the steps needed to calculate their own facilities' carbon footprints.

Certificates were awarded to participants at the end of the training, and they were informed about the use of the e-learning platform going forward.`,
      summary: "Carbon footprint calculation training for IPARD enterprises was successfully completed.",
    },
  ]);

  // News 2
  const [news2] = await db.insert(news).values({
    slug: "yesil-mutabakat-uyum-calistayi",
    categoryId: 1,
    featuredImage: "/uploads/news-2.jpg",
    isActive: "active",
    viewCount: 203,
  });
  const news2Id = Number(news2.insertId);

  await db.insert(newsTranslations).values([
    {
      newsId: news2Id,
      language: "tr",
      title: "AB Yeşil Mutabakatı ve SKDM Uyum Çalıştayı Gerçekleştirildi",
      content: `CARBODIGIPARD projesi kapsamında "AB Yeşil Mutabakatı ve Sınırda Karbon Düzenleme Mekanizması (SKDM) Uyum Çalıştayı" başarıyla tamamlandı. Çalıştay, Türkiye'nin yeşil dönüşüm sürecinde karşılaştığı fırsatları ve zorlukları ele aldı.

Çalıştayda, AB Yeşil Mutabakatı'nın Türkiye'nin gıda, tarım ve hayvancılık sektörleri üzerindeki etkileri detaylı bir şekilde incelendi. Özellikle Sınırda Karbon Düzenleme Mekanizması'nın ihracatçı işletmeler üzerindeki etkileri ve uyum stratejileri tartışıldı.

Uzmanlar, karbon sıfır hedefine ulaşma yolunda işletmelerin alması gereken adımları sıraladı ve iyi uygulama örneklerini paylaştı. Çalıştay sonucunda politika tavsiye raporu hazırlanmasına karar verildi.`,
      summary: "AB Yeşil Mutabakatı ve SKDM uyum çalıştayı sektör temsilcilerinin katılımıyla gerçekleştirildi.",
    },
    {
      newsId: news2Id,
      language: "en",
      title: "EU Green Deal and CBAM Alignment Workshop Held",
      content: `The "EU Green Deal and Carbon Border Adjustment Mechanism (CBAM) Alignment Workshop" was successfully completed within the scope of the CARBODIGIPARD project. The workshop addressed the opportunities and challenges Turkey faces in its green transformation process.

The workshop examined in detail the impacts of the EU Green Deal on Turkey's food, agriculture, and livestock sectors. The effects of the Carbon Border Adjustment Mechanism on exporting enterprises and compliance strategies were particularly discussed.

Experts outlined the steps enterprises need to take on the path to carbon neutrality and shared best practice examples. It was decided to prepare a policy recommendation report following the workshop.`,
      summary: "The EU Green Deal and CBAM alignment workshop was held with the participation of sector representatives.",
    },
  ]);

  // News 3
  const [news3] = await db.insert(news).values({
    slug: "yapay-zeka-karbon-harita-araci",
    categoryId: 2,
    featuredImage: "/uploads/news-3.jpg",
    isActive: "active",
    viewCount: 312,
  });
  const news3Id = Number(news3.insertId);

  await db.insert(newsTranslations).values([
    {
      newsId: news3Id,
      language: "tr",
      title: "Yapay Zeka Destekli Karbon Haritalama Aracı Geliştirildi",
      content: `CARBODIGIPARD projesi kapsamında, IPARD işletmelerinin karbon ayak izini görselleştirmek ve analiz etmek amacıyla yapay zeka destekli karbon haritalama aracı geliştirildi.

Araç, işletmelerin enerji tüketimi, atık yönetimi, ulaşım ve üretim süreçlerinden elde edilen verileri yapay zeka algoritmalarıyla analiz ederek interaktif karbon haritaları oluşturuyor.

Sistem, işletmelerin sektör ortalamasıyla karşılaştırmalı analiz yapmasına, zayıf noktalarını tespit etmesine ve karbon azaltımı için kişiselleştirilmiş öneriler almasına olanak tanıyor.

Araç, pilot olarak 10 IPARD işletmesinde test edilmeye başlandı ve ilk sonuçlar olumlu bulundu.`,
      summary: "Projede yapay zeka destekli karbon haritalama aracı geliştirilmesi tamamlandı.",
    },
    {
      newsId: news3Id,
      language: "en",
      title: "AI-Powered Carbon Mapping Tool Developed",
      content: `Within the scope of the CARBODIGIPARD project, an AI-powered carbon mapping tool was developed to visualize and analyze the carbon footprint of IPARD enterprises.

The tool analyzes data obtained from enterprises' energy consumption, waste management, transportation, and production processes using AI algorithms to create interactive carbon maps.

The system enables enterprises to perform comparative analysis with sector averages, identify weak points, and receive personalized recommendations for carbon reduction.

The tool has begun pilot testing at 10 IPARD enterprises, and initial results have been positive.`,
      summary: "The AI-powered carbon mapping tool development in the project has been completed.",
    },
  ]);

  console.log("  ✓ 3 news articles with translations created");

  // ─── 5. Training Materials ──────────────────────────────────────
  console.log("Creating training materials...");
  await db.insert(trainingMaterials).values([
    {
      titleTr: "Karbon Ayak İzi Temelleri",
      titleEn: "Carbon Footprint Fundamentals",
      descriptionTr: "Karbon ayak izi kavramları, sera gazları, hesaplama metodolojileri ve raporlama standartları hakkında kapsamlı eğitim modülü.",
      descriptionEn: "Comprehensive training module on carbon footprint concepts, greenhouse gases, calculation methodologies, and reporting standards.",
      materialType: "video",
      videoUrl: "https://www.youtube.com/embed/ScMzIvxBSi4",
      thumbnailPath: "/uploads/training-1.jpg",
      duration: "45 dk / min",
      sortOrder: 1,
      isActive: "active",
    },
    {
      titleTr: "AB Yeşil Mutabakatı Rehberi",
      titleEn: "EU Green Deal Guide",
      descriptionTr: "AB Yeşil Mutabakatı'nın temel ilkeleri, SKDM mekanizması ve işletmeler için uyum stratejilerini kapsayan detaylı rehber.",
      descriptionEn: "Detailed guide covering the basic principles of the EU Green Deal, the CBAM mechanism, and compliance strategies for enterprises.",
      materialType: "document",
      documentPath: "/uploads/green-deal-guide.pdf",
      thumbnailPath: "/uploads/training-2.jpg",
      duration: "30 dk / min",
      sortOrder: 2,
      isActive: "active",
    },
  ]);
  console.log("  ✓ 2 training materials created");

  // ─── 6. Social Links ────────────────────────────────────────────
  console.log("Creating social links...");
  await db.insert(socialLinks).values([
    { platform: "linkedin", url: "https://linkedin.com/company/carbodigipard", isActive: "active" },
    { platform: "instagram", url: "https://instagram.com/carbodigipard", isActive: "active" },
  ]);
  console.log("  ✓ 2 social links created");

  // ─── 7. Site Settings ───────────────────────────────────────────
  console.log("Creating site settings...");
  await db.insert(siteSettings).values([
    { key: "project_title_tr", value: "CARBODIGIPARD" },
    { key: "project_title_en", value: "CARBODIGIPARD" },
    { key: "site_logo", value: "/logo-project.png" },
  ]);
  console.log("  ✓ Site settings created");

  console.log("\n✅ Seed completed successfully!");
  console.log("   Admin login: username=admin, password=admin123");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
