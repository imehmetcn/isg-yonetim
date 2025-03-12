import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { auth as authOptions } from '@/lib/auth';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    // Mock report data
    const mockReports: Record<string, any> = {
      "1": {
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
        content: {
          summary: {
            totalIncidents: 3,
            openRisks: 5,
            completedTrainings: 12,
            pendingActions: 8,
          },
          kpis: [
            { name: "Kaza Sıklık Oranı", value: 1.2, target: 2.0, status: "good" },
            { name: "Eğitim Tamamlanma Oranı", value: 92, target: 90, status: "good" },
            { name: "Risk Kapatma Oranı", value: 78, target: 85, status: "warning" },
            { name: "Denetim Uyum Oranı", value: 95, target: 90, status: "good" },
          ],
          charts: [
            { type: "bar", title: "Departman Bazlı Olaylar", data: "chart-data-url-1" },
            { type: "line", title: "Aylık Trend Analizi", data: "chart-data-url-2" },
            { type: "pie", title: "Risk Dağılımı", data: "chart-data-url-3" },
          ],
          recommendations: [
            "Üretim alanında risk değerlendirmesi güncellenmeli",
            "Yeni çalışanlar için ek İSG eğitimleri planlanmalı",
            "Acil durum tatbikatı yapılmalı",
          ],
        },
      },
      "2": {
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
        content: {
          summary: {
            totalRisks: 28,
            criticalRisks: 3,
            highRisks: 8,
            mediumRisks: 12,
            lowRisks: 5,
          },
          risksByDepartment: [
            { department: "Üretim", critical: 2, high: 5, medium: 6, low: 2 },
            { department: "Depo", critical: 1, high: 2, medium: 3, low: 1 },
            { department: "Ofis", critical: 0, high: 1, medium: 3, low: 2 },
          ],
          topRisks: [
            {
              id: "R001",
              title: "Yüksekte çalışma riskleri",
              severity: "critical",
              department: "Üretim",
            },
            { id: "R002", title: "Kimyasal maruziyeti", severity: "high", department: "Üretim" },
            {
              id: "R003",
              title: "Forklift çarpışma riski",
              severity: "critical",
              department: "Depo",
            },
          ],
          riskTrends: {
            newRisks: 5,
            closedRisks: 7,
            escalatedRisks: 2,
            deescalatedRisks: 3,
          },
          recommendations: [
            "Yüksekte çalışma prosedürlerinin gözden geçirilmesi",
            "Kimyasal madde depolama alanlarının yeniden düzenlenmesi",
            "Forklift operatörleri için tazeleme eğitimi",
          ],
        },
      },
      "3": {
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
        content: {
          summary: {
            totalTrainings: 8,
            completedTrainings: 6,
            ongoingTrainings: 2,
            totalParticipants: 45,
            totalHours: 32,
          },
          trainingsByType: [
            { type: "İSG Temel Eğitimi", count: 2, participants: 15, hours: 16 },
            { type: "Acil Durum Eğitimi", count: 3, participants: 20, hours: 6 },
            { type: "Kimyasal Güvenliği", count: 1, participants: 5, hours: 4 },
            { type: "Yüksekte Çalışma", count: 2, participants: 5, hours: 6 },
          ],
          participationByDepartment: [
            { department: "Üretim", participants: 25, completionRate: 92 },
            { department: "Depo", participants: 10, completionRate: 85 },
            { department: "Ofis", participants: 10, completionRate: 100 },
          ],
          upcomingTrainings: [
            { title: "İlk Yardım Eğitimi", date: "2024-03-15", participants: 12 },
            { title: "Yangın Güvenliği", date: "2024-03-20", participants: 30 },
          ],
        },
      },
      "4": {
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
        content: {
          draft: true,
          notes: "Mart ayı verileri henüz tamamlanmadı. Rapor taslak halinde.",
        },
      },
      "5": {
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
        content: {
          summary: {
            totalAudits: 4,
            completedAudits: 4,
            totalFindings: 15,
            openFindings: 5,
            closedFindings: 10,
          },
          auditsByType: [
            { type: "İç Denetim", count: 3, findings: 12 },
            { type: "Dış Denetim", count: 1, findings: 3 },
          ],
          findingsBySeverity: {
            critical: 2,
            high: 5,
            medium: 6,
            low: 2,
          },
          topFindings: [
            { id: "F001", title: "Acil çıkış işaretleri eksik", severity: "high", area: "Üretim" },
            { id: "F002", title: "Kimyasal depolama uygunsuz", severity: "critical", area: "Depo" },
            {
              id: "F003",
              title: "Yangın söndürücü bakımları eksik",
              severity: "high",
              area: "Ofis",
            },
          ],
        },
      },
      "6": {
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
        content: {
          executiveSummary:
            "Bu rapor, 2023 yılı boyunca şirketimizin İSG performansını değerlendirmektedir. Genel olarak, kaza sıklık oranımız önceki yıla göre %15 azalmış, eğitim tamamlanma oranımız %95'e ulaşmıştır. Ancak, risk kapatma oranımız hedefin altında kalmıştır.",
          keyMetrics: [
            {
              name: "Kaza Sıklık Oranı",
              value: 1.5,
              previousYear: 1.8,
              change: -16.7,
              target: 1.6,
              status: "good",
            },
            {
              name: "Kayıp Gün Oranı",
              value: 12.3,
              previousYear: 15.2,
              change: -19.1,
              target: 12.0,
              status: "warning",
            },
            {
              name: "Eğitim Tamamlanma Oranı",
              value: 95,
              previousYear: 88,
              change: 8.0,
              target: 90,
              status: "good",
            },
            {
              name: "Risk Kapatma Oranı",
              value: 82,
              previousYear: 75,
              change: 9.3,
              target: 85,
              status: "warning",
            },
          ],
          annualTrends: {
            incidents: [5, 4, 3, 2, 4, 3, 2, 1, 2, 3, 2, 1],
            trainings: [3, 2, 4, 3, 2, 5, 3, 2, 4, 3, 4, 5],
            audits: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
          },
          achievements: [
            "ISO 45001 sertifikasyonu başarıyla tamamlandı",
            "Sıfır kayıp günlü kaza hedefine 3 ay boyunca ulaşıldı",
            "Tüm çalışanlar için İSG temel eğitimi tamamlandı",
          ],
          challenges: [
            "Yeni üretim hattında risk değerlendirme süreçleri",
            "Taşeron firma çalışanlarının İSG uyumu",
            "Kimyasal madde yönetimi",
          ],
          recommendations: [
            "Risk değerlendirme süreçlerinin güçlendirilmesi",
            "Taşeron firma İSG denetimlerinin artırılması",
            "Kimyasal madde yönetimi için özel eğitim programı",
          ],
        },
      },
    };

    const { id } = params;
    const report = mockReports[id];

    if (!report) {
      return NextResponse.json({ error: "Rapor bulunamadı" }, { status: 404 });
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error("Rapor detayı getirme hatası:", error);
    return NextResponse.json(
      { error: "Rapor detayı getirilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// Raporu güncelle
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
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
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Rapor güncelleme hatası:", error);
    return NextResponse.json({ error: "Rapor güncellenirken bir hata oluştu" }, { status: 500 });
  }
}

// Raporu sil
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    // Log the ID being deleted
    console.log(`Deleting report with ID: ${params.id}`);

    // Mock delete - just return success message
    return NextResponse.json({ message: "Rapor başarıyla silindi" });
  } catch (error) {
    console.error("Rapor silme hatası:", error);
    return NextResponse.json({ error: "Rapor silinirken bir hata oluştu" }, { status: 500 });
  }
}
