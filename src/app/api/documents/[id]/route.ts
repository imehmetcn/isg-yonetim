import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { auth as authOptions } from '@/lib/auth';

// Doküman detaylarını getir
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    // Mock document data
    const mockDocuments: Record<string, any> = {
      "1": {
        id: "1",
        title: "İSG Politikası",
        category: "PROCEDURE",
        description: "Şirketin İş Sağlığı ve Güvenliği politikası",
        fileUrl: "/documents/isg-politikasi.pdf",
        version: "1.2",
        status: "ACTIVE",
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-02-05T14:20:00Z",
        uploadedBy: "Ahmet Yılmaz",
        uploadedByUser: {
          name: "Ahmet Yılmaz",
          email: "ahmet@example.com",
        },
        tags: ["politika", "isg", "yönetim"],
        approvedBy: "Mehmet Demir",
        approvalDate: "2024-01-20T09:00:00Z",
        reviewDate: "2024-07-15T00:00:00Z",
      },
      "2": {
        id: "2",
        title: "Acil Durum Planı",
        category: "PLAN",
        description: "Acil durumlarda uygulanacak prosedürler",
        fileUrl: "/documents/acil-durum-plani.pdf",
        version: "2.1",
        status: "ACTIVE",
        createdAt: "2024-01-20T09:15:00Z",
        updatedAt: "2024-02-10T11:30:00Z",
        uploadedBy: "Ayşe Demir",
        uploadedByUser: {
          name: "Ayşe Demir",
          email: "ayse@example.com",
        },
        tags: ["acil durum", "plan", "tahliye"],
        approvedBy: "Ahmet Yılmaz",
        approvalDate: "2024-01-25T14:00:00Z",
        reviewDate: "2024-07-20T00:00:00Z",
      },
      "3": {
        id: "3",
        title: "Risk Değerlendirme Raporu",
        category: "REPORT",
        description: "Üretim alanı risk değerlendirme raporu",
        fileUrl: "/documents/risk-degerlendirme.pdf",
        version: "1.0",
        status: "DRAFT",
        createdAt: "2024-02-15T13:45:00Z",
        updatedAt: "2024-02-15T13:45:00Z",
        uploadedBy: "Mehmet Demir",
        uploadedByUser: {
          name: "Mehmet Demir",
          email: "mehmet@example.com",
        },
        tags: ["risk", "değerlendirme", "üretim"],
        approvedBy: null,
        approvalDate: null,
        reviewDate: null,
      },
      "4": {
        id: "4",
        title: "Yangın Talimatı",
        category: "INSTRUCTION",
        description: "Yangın durumunda yapılacaklar",
        fileUrl: "/documents/yangin-talimati.pdf",
        version: "1.1",
        status: "ACTIVE",
        createdAt: "2024-01-25T15:20:00Z",
        updatedAt: "2024-02-08T10:10:00Z",
        uploadedBy: "Ali Kaya",
        uploadedByUser: {
          name: "Ali Kaya",
          email: "ali@example.com",
        },
        tags: ["yangın", "talimat", "acil durum"],
        approvedBy: "Ahmet Yılmaz",
        approvalDate: "2024-01-30T11:00:00Z",
        reviewDate: "2024-07-25T00:00:00Z",
      },
      "5": {
        id: "5",
        title: "İş Kazası Bildirim Formu",
        category: "FORM",
        description: "İş kazası bildiriminde kullanılacak form",
        fileUrl: "/documents/kaza-bildirim-formu.pdf",
        version: "1.3",
        status: "ACTIVE",
        createdAt: "2024-01-10T11:00:00Z",
        updatedAt: "2024-02-12T09:30:00Z",
        uploadedBy: "Ayşe Demir",
        uploadedByUser: {
          name: "Ayşe Demir",
          email: "ayse@example.com",
        },
        tags: ["kaza", "form", "bildirim"],
        approvedBy: "Mehmet Demir",
        approvalDate: "2024-01-15T10:00:00Z",
        reviewDate: "2024-07-10T00:00:00Z",
      },
      "6": {
        id: "6",
        title: "Eski Acil Durum Planı",
        category: "PLAN",
        description: "Eski acil durum planı (arşivlenmiş)",
        fileUrl: "/documents/eski-acil-durum-plani.pdf",
        version: "1.0",
        status: "ARCHIVED",
        createdAt: "2023-06-15T10:00:00Z",
        updatedAt: "2024-01-20T09:15:00Z",
        uploadedBy: "Ayşe Demir",
        uploadedByUser: {
          name: "Ayşe Demir",
          email: "ayse@example.com",
        },
        tags: ["acil durum", "plan", "arşiv"],
        approvedBy: "Ahmet Yılmaz",
        approvalDate: "2023-06-20T11:00:00Z",
        reviewDate: "2023-12-15T00:00:00Z",
      },
    };

    const { id } = params;
    const document = mockDocuments[id];

    if (!document) {
      return NextResponse.json({ error: "Doküman bulunamadı" }, { status: 404 });
    }

    return NextResponse.json(document);
  } catch (error) {
    console.error("Doküman detayları hatası:", error);
    return NextResponse.json({ error: "Doküman detayları alınamadı" }, { status: 500 });
  }
}

// Dokümanı güncelle
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
    console.error("Doküman güncelleme hatası:", error);
    return NextResponse.json({ error: "Doküman güncellenemedi" }, { status: 500 });
  }
}

// Dokümanı sil
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    const { id } = params;
    
    // Mock delete - just return success message
    return NextResponse.json({ message: `${id} ID'li doküman başarıyla silindi` });
  } catch (error) {
    console.error("Doküman silme hatası:", error);
    return NextResponse.json({ error: "Doküman silinemedi" }, { status: 500 });
  }
}
