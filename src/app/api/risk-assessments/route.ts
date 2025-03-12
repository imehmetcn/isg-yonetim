import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { auth as authOptions } from "@/lib/auth";

function calculateRiskLevel(severity: number, likelihood: number): string {
  const riskScore = severity * likelihood;

  if (riskScore >= 15) return "CRITICAL";
  if (riskScore >= 8) return "HIGH";
  if (riskScore >= 4) return "MEDIUM";
  return "LOW";
}

// Risk değerlendirmeleri listesi
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    // Mock data for risk assessments
    const mockAssessments = [
      {
        id: "1",
        title: "Üretim Alanı Risk Değerlendirmesi",
        description: "Üretim alanındaki tehlikelerin değerlendirilmesi",
        department: "Üretim",
        assessorId: session.user.id,
        status: "COMPLETED",
        date: new Date("2024-02-15"),
        updatedAt: new Date("2024-02-16"),
        risks: [
          {
            id: "101",
            hazard: "Hareketli makine parçaları",
            description: "Koruyucu muhafazası olmayan hareketli parçalar",
            likelihood: 3,
            severity: 4,
            riskLevel: "HIGH",
            controls: "Makine koruyucuları takılmalı, çalışanlara eğitim verilmeli",
            status: "PENDING",
          },
          {
            id: "102",
            hazard: "Kaygan zemin",
            description: "Yağ sızıntısı nedeniyle kaygan zemin",
            likelihood: 3,
            severity: 3,
            riskLevel: "MEDIUM",
            controls: "Sızıntılar giderilmeli, uyarı levhaları konulmalı",
            status: "COMPLETED",
          },
        ],
      },
      {
        id: "2",
        title: "Ofis Alanı Risk Değerlendirmesi",
        description: "Ofis alanındaki ergonomik risklerin değerlendirilmesi",
        department: "İdari İşler",
        assessorId: session.user.id,
        status: "COMPLETED",
        date: new Date("2024-02-20"),
        updatedAt: new Date("2024-02-21"),
        risks: [
          {
            id: "201",
            hazard: "Ergonomik olmayan çalışma istasyonları",
            description: "Uzun süreli bilgisayar kullanımı ve uygun olmayan oturma düzeni",
            likelihood: 3,
            severity: 2,
            riskLevel: "MEDIUM",
            controls: "Ergonomik sandalyeler temin edilmeli, mola süreleri düzenlenmeli",
            status: "IN_PROGRESS",
          },
        ],
      },
      {
        id: "3",
        title: "Depo Alanı Risk Değerlendirmesi",
        description: "Depo alanındaki yüksekte çalışma ve malzeme taşıma riskleri",
        department: "Lojistik",
        assessorId: session.user.id,
        status: "IN_PROGRESS",
        date: new Date("2024-03-05"),
        updatedAt: new Date("2024-03-06"),
        risks: [
          {
            id: "301",
            hazard: "Yüksekten düşme",
            description: "Raf sistemlerinde yüksekte çalışma",
            likelihood: 2,
            severity: 5,
            riskLevel: "HIGH",
            controls: "Yüksekte çalışma izni sistemi kurulmalı, emniyet kemerleri kullanılmalı",
            status: "PENDING",
          },
          {
            id: "302",
            hazard: "Ağır yük kaldırma",
            description: "Manuel malzeme taşıma işlemleri",
            likelihood: 4,
            severity: 3,
            riskLevel: "HIGH",
            controls: "Mekanik kaldırma ekipmanları kullanılmalı, çalışanlara eğitim verilmeli",
            status: "PENDING",
          },
        ],
      },
    ];

    return NextResponse.json(mockAssessments);
  } catch (error) {
    console.error("Risk değerlendirmeleri getirme hatası:", error);
    return NextResponse.json(
      { error: "Risk değerlendirmeleri getirilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// Yeni risk değerlendirmesi oluştur
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      department,
      date,
      severity,
      likelihood,
      nextAssessmentDate,
    } = body;

    if (!title || !department || !date) {
      return NextResponse.json({ error: "Gerekli alanlar eksik" }, { status: 400 });
    }

    // Log the next assessment date
    console.log(`Next assessment date: ${nextAssessmentDate || 'Not specified'}`);

    // Calculate risk level
    const riskLevel = calculateRiskLevel(severity || 1, likelihood || 1);

    // Mock response - just return the body with an id
    return NextResponse.json({
      id: Math.floor(Math.random() * 1000).toString(),
      title,
      description: description || "",
      department,
      assessorId: session.user.id,
      status: "DRAFT",
      date: new Date(date),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      risks: [
        {
          id: Math.floor(Math.random() * 1000).toString(),
          hazard: title,
          description: description || "",
          likelihood: likelihood || 1,
          severity: severity || 1,
          riskLevel,
          controls: "",
          status: "PENDING",
        },
      ],
    });
  } catch (error) {
    console.error("Risk değerlendirme oluşturma hatası:", error);
    return NextResponse.json(
      { error: "Risk değerlendirme oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}
