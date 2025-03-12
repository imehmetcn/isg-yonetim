import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { auth as authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { trainings } from '@/lib/db/schema';

// Eğitim detaylarını getir
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    // Mock training data
    const mockTrainings: Record<string, any> = {
      "1": {
        id: "1",
        title: "İş Sağlığı ve Güvenliği Temel Eğitimi",
        description: "Tüm çalışanlar için temel İSG eğitimi",
        status: "COMPLETED",
        startDate: "2024-02-10T09:00:00Z",
        endDate: "2024-02-11T17:00:00Z",
        attendees: "25",
        instructor: "Ahmet Yılmaz",
        location: "Eğitim Salonu A",
        duration: "8 saat",
        capacity: 30,
        participants: 25,
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-02-12T09:15:00Z",
        participants_list: [
          { id: "101", name: "Mehmet Yılmaz", department: "Üretim", attendance: true },
          { id: "102", name: "Ayşe Demir", department: "İK", attendance: true },
          { id: "103", name: "Ali Kaya", department: "Bakım", attendance: false },
        ],
        topics: [
          "İSG Mevzuatı",
          "Risk Değerlendirme",
          "Acil Durumlar",
          "İş Kazaları ve Meslek Hastalıkları",
        ],
        materials: [
          { id: "1", name: "Eğitim Sunumu", type: "pdf" },
          { id: "2", name: "Değerlendirme Testi", type: "doc" },
        ],
      },
      "2": {
        id: "2",
        title: "Acil Durum ve Yangın Eğitimi",
        description: "Acil durum prosedürleri ve yangın söndürme eğitimi",
        status: "COMPLETED",
        startDate: "2024-02-20T10:00:00Z",
        endDate: "2024-02-20T14:00:00Z",
        attendees: "30",
        instructor: "Mehmet Demir",
        location: "Eğitim Salonu B",
        duration: "4 saat",
        capacity: 30,
        participants: 30,
        createdAt: "2024-01-25T11:45:00Z",
        updatedAt: "2024-02-21T08:30:00Z",
        participants_list: [
          { id: "201", name: "Zeynep Kara", department: "Muhasebe", attendance: true },
          { id: "202", name: "Mustafa Şahin", department: "Satış", attendance: true },
        ],
        topics: ["Yangın Türleri", "Yangın Söndürücü Kullanımı", "Tahliye Prosedürleri"],
        materials: [
          { id: "1", name: "Eğitim Videosu", type: "mp4" },
          { id: "2", name: "Acil Durum Planı", type: "pdf" },
        ],
      },
      "3": {
        id: "3",
        title: "Yüksekte Çalışma Eğitimi",
        description: "Yüksekte güvenli çalışma teknikleri",
        status: "PENDING",
        startDate: "2024-03-15T09:00:00Z",
        endDate: "2024-03-16T17:00:00Z",
        attendees: "15",
        instructor: "Ali Kaya",
        location: "Uygulama Alanı",
        duration: "16 saat",
        capacity: 20,
        participants: 15,
        createdAt: "2024-02-10T14:20:00Z",
        updatedAt: "2024-02-15T09:10:00Z",
        participants_list: [
          { id: "301", name: "Ahmet Demir", department: "Bakım", attendance: null },
          { id: "302", name: "Mehmet Çelik", department: "Bakım", attendance: null },
        ],
        topics: [
          "Yüksekte Çalışma Riskleri",
          "Kişisel Koruyucu Donanımlar",
          "Emniyet Kemeri Kullanımı",
          "Pratik Uygulamalar",
        ],
        materials: [{ id: "1", name: "Eğitim Kılavuzu", type: "pdf" }],
      },
      "4": {
        id: "4",
        title: "Kimyasal Madde Güvenliği",
        description: "Kimyasal maddelerle güvenli çalışma eğitimi",
        status: "IN_PROGRESS",
        startDate: "2024-03-05T09:00:00Z",
        endDate: "2024-03-07T17:00:00Z",
        attendees: "20",
        instructor: "Ayşe Demir",
        location: "Laboratuvar",
        duration: "12 saat",
        capacity: 25,
        participants: 20,
        createdAt: "2024-02-15T10:00:00Z",
        updatedAt: "2024-03-05T08:45:00Z",
        participants_list: [
          { id: "401", name: "Fatma Yıldız", department: "Laboratuvar", attendance: true },
          { id: "402", name: "Emre Can", department: "Üretim", attendance: true },
        ],
        topics: [
          "Kimyasal Madde Sınıflandırması",
          "GBF Okuma",
          "Koruyucu Ekipmanlar",
          "Dökülme ve Sızıntı Müdahalesi",
        ],
        materials: [
          { id: "1", name: "Güvenlik Bilgi Formları", type: "pdf" },
          { id: "2", name: "Laboratuvar Güvenliği", type: "ppt" },
        ],
      },
    };

    const { id } = params;
    const training = mockTrainings[id];

    if (!training) {
      return NextResponse.json({ error: "Eğitim bulunamadı" }, { status: 404 });
    }

    return NextResponse.json(training);
  } catch (error) {
    console.error("Eğitim detayları hatası:", error);
    return NextResponse.json({ error: "Eğitim detayları alınamadı" }, { status: 500 });
  }
}

// Eğitimi güncelle
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();

    // Mock update - just return the body with the id
    return NextResponse.json({
      ...body,
      id,
    });
  } catch (error) {
    console.error("Eğitim güncelleme hatası:", error);
    return NextResponse.json({ error: "Eğitim güncellenemedi" }, { status: 500 });
  }
}

// Eğitimi sil
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    // Eğitimi veritabanından sil
    const [deletedTraining] = await db
      .delete(trainings)
      .where(eq(trainings.id, params.id))
      .returning();

    if (!deletedTraining) {
      return NextResponse.json({ error: "Eğitim bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({ message: "Eğitim başarıyla silindi" });
  } catch (error) {
    console.error("Eğitim silme hatası:", error);
    return NextResponse.json({ error: "Eğitim silinemedi" }, { status: 500 });
  }
}
