# İSG Yönetim Sistemi

İş Sağlığı ve Güvenliği (İSG) profesyonelleri için geliştirilmiş kapsamlı bir yönetim sistemi.

## Özellikler

- 📊 Risk Değerlendirme

  - Risk analizi araçları
  - Risk değerlendirme raporları
  - Risk takibi

- 🚨 Olay Takibi

  - İş kazası kayıtları
  - Olay raporlama
  - İstatistiksel analizler

- 📚 Eğitim Yönetimi

  - Eğitim planlaması
  - Sertifikasyon takibi
  - Eğitim materyalleri yönetimi

- ✓ Denetim ve Kontrol
  - Denetim planlaması
  - Kontrol listeleri
  - Denetim raporları

## Teknolojiler

- Next.js 14
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL

## Kurulum

1. Projeyi klonlayın:

   ```bash
   git clone [repo-url]
   cd isg-management
   ```

2. Bağımlılıkları yükleyin:

   ```bash
   npm install
   ```

3. Veritabanı bağlantısını yapılandırın:

   - `.env` dosyası oluşturun
   - Aşağıdaki değişkeni ekleyin:
     ```
     DATABASE_URL="postgresql://user:password@localhost:5432/isg_db"
     ```

4. Veritabanı şemasını oluşturun:

   ```bash
   npx prisma db push
   ```

5. Geliştirme sunucusunu başlatın:
   ```bash
   npm run dev
   ```

## Geliştirme

- `src/app`: Sayfa bileşenleri
- `src/components`: Yeniden kullanılabilir bileşenler
- `prisma/schema.prisma`: Veritabanı şeması
- `public`: Statik dosyalar

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.
