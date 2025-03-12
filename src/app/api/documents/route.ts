import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { auth as authOptions } from "@/lib/auth";

// Belgeler listesi
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    // Mock data for documents
    const mockDocuments = [
      {
        id: "1",
        title: "İSG Politikası",
        category: "PROCEDURE",
        description: "Şirketin İş Sağlığı ve Güvenliği politikası",
        fileUrl: "/documents/isg-politikasi.pdf",
        version: "1.2",
        status: "ACTIVE",
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-02-05T14:20:00Z",
      },
      {
        id: "2",
        title: "Acil Durum Planı",
        category: "PLAN",
        description: "Acil durumlarda uygulanacak prosedürler",
        fileUrl: "/documents/acil-durum-plani.pdf",
        version: "2.1",
        status: "ACTIVE",
        createdAt: "2024-01-20T09:15:00Z",
        updatedAt: "2024-02-10T11:30:00Z",
      },
      {
        id: "3",
        title: "Risk Değerlendirme Raporu",
        category: "REPORT",
        description: "Üretim alanı risk değerlendirme raporu",
        fileUrl: "/documents/risk-degerlendirme.pdf",
        version: "1.0",
        status: "DRAFT",
        createdAt: "2024-02-15T13:45:00Z",
        updatedAt: "2024-02-15T13:45:00Z",
      },
      {
        id: "4",
        title: "Yangın Talimatı",
        category: "INSTRUCTION",
        description: "Yangın durumunda yapılacaklar",
        fileUrl: "/documents/yangin-talimati.pdf",
        version: "1.1",
        status: "ACTIVE",
        createdAt: "2024-01-25T15:20:00Z",
        updatedAt: "2024-02-08T10:10:00Z",
      },
      {
        id: "5",
        title: "İş Kazası Bildirim Formu",
        category: "FORM",
        description: "İş kazası bildiriminde kullanılacak form",
        fileUrl: "/documents/kaza-bildirim-formu.pdf",
        version: "1.3",
        status: "ACTIVE",
        createdAt: "2024-01-10T11:00:00Z",
        updatedAt: "2024-02-12T09:30:00Z",
      },
      {
        id: "6",
        title: "Eski Acil Durum Planı",
        category: "PLAN",
        description: "Eski acil durum planı (arşivlenmiş)",
        fileUrl: "/documents/eski-acil-durum-plani.pdf",
        version: "1.0",
        status: "ARCHIVED",
        createdAt: "2023-06-15T10:00:00Z",
        updatedAt: "2024-01-20T09:15:00Z",
      },
    ];

    return NextResponse.json(mockDocuments);
  } catch (error) {
    console.error("Belgeler getirme hatası:", error);
    return NextResponse.json({ error: "Belgeler getirilirken bir hata oluştu" }, { status: 500 });
  }
}

// Yeni belge oluştur
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    const body = await request.json();
    const { title, category, description, fileUrl, version } = body;

    if (!title || !category) {
      return NextResponse.json({ error: "Gerekli alanlar eksik" }, { status: 400 });
    }

    // Mock response - just return the body with an id
    return NextResponse.json({
      id: Math.floor(Math.random() * 1000).toString(),
      title,
      category,
      description: description || "",
      fileUrl: fileUrl || null,
      version: version || "1.0",
      status: "ACTIVE",
      userId: session.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Belge oluşturma hatası:", error);
    return NextResponse.json({ error: "Belge oluşturulurken bir hata oluştu" }, { status: 500 });
  }
}
