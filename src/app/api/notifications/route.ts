import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { auth as authOptions } from "@/lib/auth";

// Mock bildirimler
const mockNotifications = [
  {
    id: "1",
    title: "Risk değerlendirme raporu onaylandı",
    message: "Hazırladığınız risk değerlendirme raporu yönetici tarafından onaylandı.",
    type: "SUCCESS",
    category: "Risk Değerlendirme",
    isRead: false,
    link: "/risk-assessment",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 dakika önce
    userId: "user@example.com",
  },
  {
    id: "2",
    title: "Yeni denetim göreviniz var",
    message: "Size yeni bir denetim görevi atandı. Lütfen detayları kontrol edin.",
    type: "INFO",
    category: "Denetim",
    isRead: false,
    link: "/audits",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 saat önce
    userId: "user@example.com",
  },
  {
    id: "3",
    title: "Eğitim tarihi yaklaşıyor",
    message: "Katılmanız gereken İSG eğitimi 3 gün içinde gerçekleşecek.",
    type: "WARNING",
    category: "Eğitim",
    isRead: true,
    link: "/trainings",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 gün önce
    userId: "user@example.com",
  },
  {
    id: "4",
    title: "Acil durum tatbikatı",
    message:
      "Yarın saat 14:00'da acil durum tatbikatı gerçekleştirilecek. Tüm personelin katılımı zorunludur.",
    type: "DANGER",
    category: "Acil Durum",
    isRead: false,
    link: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), // 1.5 gün önce
    userId: "user@example.com",
  },
  {
    id: "5",
    title: "Yeni belge yüklendi",
    message: "İSG dokümanları klasörüne yeni bir belge yüklendi. İncelemeniz gerekiyor.",
    type: "INFO",
    category: "Doküman",
    isRead: false,
    link: "/documents",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 gün önce
    userId: "user@example.com",
  },
  {
    id: "6",
    title: "Ekipman bakım hatırlatması",
    message: "Yangın söndürücülerin yıllık bakım zamanı geldi. Lütfen gerekli işlemleri başlatın.",
    type: "WARNING",
    category: "Ekipman",
    isRead: true,
    link: "/equipment",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 gün önce
    userId: "user@example.com",
  },
  {
    id: "7",
    title: "İş kazası bildirimi",
    message: "Üretim bölümünde bir iş kazası meydana geldi. Detaylı rapor için tıklayın.",
    type: "DANGER",
    category: "Kaza",
    isRead: true,
    link: "/incidents",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(), // 4 gün önce
    userId: "user@example.com",
  },
];

// Bildirimleri getir
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    // Mock verileri kullan
    const userNotifications = mockNotifications.filter(
      notification =>
        notification.userId === session.user.email || notification.userId === "user@example.com"
    );

    return NextResponse.json(userNotifications);
  } catch (error) {
    console.error("Bildirimler getirme hatası:", error);
    return NextResponse.json(
      { error: "Bildirimler getirilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// Yeni bildirim oluştur
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    const body = await req.json();
    const { title, message, type, category, link } = body;

    if (!title || !message || !type || !category) {
      return NextResponse.json({ error: "Gerekli alanlar eksik" }, { status: 400 });
    }

    // Yeni bildirim oluştur (mock)
    const newNotification = {
      id: Date.now().toString(),
      title,
      message,
      type,
      category,
      link: link || null,
      isRead: false,
      createdAt: new Date().toISOString(),
      userId: session.user.email,
    };

    // Gerçek bir veritabanı olmadığı için sadece oluşturulan bildirimi döndür
    return NextResponse.json(newNotification);
  } catch (error) {
    console.error("Bildirim oluşturma hatası:", error);
    return NextResponse.json({ error: "Bildirim oluşturulurken bir hata oluştu" }, { status: 500 });
  }
}
