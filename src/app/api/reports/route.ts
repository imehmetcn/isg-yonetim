import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { auth as authOptions } from "@/lib/auth";

// Rapor listesi
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    // Mock data for reports
    const mockReports = [
      {
        id: "1",
        title: "Aylık İSG Performans Raporu - Mart 2024",
        type: "MONTHLY",
        period: "Mart 2024",
        status: "PUBLISHED",
        generatedAt: "2024-03-05T10:30:00Z",
        fileUrl: "/reports/isg-performans-mart-2024.pdf",
        parameters: {
          type: "performance",
          startDate: "2024-03-01",
          endDate: "2024-03-31",
        },
        createdAt: "2024-03-05T10:00:00Z",
        updatedAt: "2024-03-05T10:30:00Z",
      },
      {
        id: "2",
        title: "Risk Değerlendirme Raporu - Q1 2024",
        type: "QUARTERLY",
        period: "Q1 2024",
        status: "PUBLISHED",
        generatedAt: "2024-03-10T14:15:00Z",
        fileUrl: "/reports/risk-degerlendirme-q1-2024.pdf",
        parameters: {
          type: "risk",
          startDate: "2024-01-01",
          endDate: "2024-03-31",
          severity: "all",
        },
        createdAt: "2024-03-10T13:45:00Z",
        updatedAt: "2024-03-10T14:15:00Z",
      },
      {
        id: "3",
        title: "Eğitim Durum Raporu - Şubat 2024",
        type: "MONTHLY",
        period: "Şubat 2024",
        status: "PUBLISHED",
        generatedAt: "2024-02-28T16:00:00Z",
        fileUrl: "/reports/egitim-durum-subat-2024.pdf",
        parameters: {
          type: "training",
          startDate: "2024-02-01",
          endDate: "2024-02-29",
          trainingStatus: "all",
        },
        createdAt: "2024-02-28T15:30:00Z",
        updatedAt: "2024-02-28T16:00:00Z",
      },
      {
        id: "4",
        title: "Kaza İstatistikleri - 2024 İlk Çeyrek",
        type: "QUARTERLY",
        period: "Q1 2024",
        status: "DRAFT",
        generatedAt: null,
        fileUrl: null,
        parameters: {
          type: "accident",
          startDate: "2024-01-01",
          endDate: "2024-03-31",
          severity: "all",
          department: "all",
        },
        createdAt: "2024-03-15T09:00:00Z",
        updatedAt: "2024-03-15T09:00:00Z",
      },
      {
        id: "5",
        title: "Denetim Sonuçları - Ocak 2024",
        type: "MONTHLY",
        period: "Ocak 2024",
        status: "PUBLISHED",
        generatedAt: "2024-02-05T11:30:00Z",
        fileUrl: "/reports/denetim-sonuclari-ocak-2024.pdf",
        parameters: {
          type: "audit",
          startDate: "2024-01-01",
          endDate: "2024-01-31",
          status: "all",
        },
        createdAt: "2024-02-05T11:00:00Z",
        updatedAt: "2024-02-05T11:30:00Z",
      },
      {
        id: "6",
        title: "Yıllık İSG Performans Raporu - 2023",
        type: "ANNUAL",
        period: "2023",
        status: "PUBLISHED",
        generatedAt: "2024-01-15T13:00:00Z",
        fileUrl: "/reports/yillik-isg-performans-2023.pdf",
        parameters: {
          type: "performance",
          startDate: "2023-01-01",
          endDate: "2023-12-31",
        },
        createdAt: "2024-01-15T12:30:00Z",
        updatedAt: "2024-01-15T13:00:00Z",
      },
    ];

    return NextResponse.json(mockReports);
  } catch (error) {
    console.error("Rapor getirme hatası:", error);
    return NextResponse.json({ error: "Raporlar getirilirken bir hata oluştu" }, { status: 500 });
  }
}

// Yeni rapor oluştur
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    const body = await request.json();

    // Mock response - just return the body with an id
    return NextResponse.json({
      id: Math.floor(Math.random() * 1000).toString(),
      ...body,
      status: "DRAFT",
      generatedAt: null,
      fileUrl: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Rapor oluşturma hatası:", error);
    return NextResponse.json({ error: "Rapor oluşturulurken bir hata oluştu" }, { status: 500 });
  }
}
