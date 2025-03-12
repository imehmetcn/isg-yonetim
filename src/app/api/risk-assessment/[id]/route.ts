import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { auth as authOptions } from '@/lib/auth';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    // Mock risk assessment data
    const mockAssessments: Record<string, any> = {
      "1": {
        id: "1",
        title: "Üretim Alanı Risk Değerlendirmesi",
        description: "Üretim alanındaki tehlikelerin değerlendirilmesi",
        location: "Üretim Tesisi",
        severity: 4,
        likelihood: 3,
        createdAt: "2024-02-15T10:30:00Z",
        updatedAt: "2024-02-16T08:45:00Z",
        status: "COMPLETED",
        department: "Üretim",
        assessorId: "1",
        assessorName: "Ahmet Yılmaz",
        risks: [
          {
            id: "101",
            hazard: "Hareketli makine parçaları",
            description: "Koruyucu muhafazası olmayan hareketli parçalar",
            likelihood: 3,
            severity: 4,
            controls: "Makine koruyucuları takılmalı, çalışanlara eğitim verilmeli",
            status: "PENDING",
          },
          {
            id: "102",
            hazard: "Kaygan zemin",
            description: "Yağ sızıntısı nedeniyle kaygan zemin",
            likelihood: 3,
            severity: 3,
            controls: "Sızıntılar giderilmeli, uyarı levhaları konulmalı",
            status: "COMPLETED",
          },
        ],
      },
      "2": {
        id: "2",
        title: "Ofis Alanı Risk Değerlendirmesi",
        description: "Ofis alanındaki ergonomik risklerin değerlendirilmesi",
        location: "Merkez Ofis",
        severity: 2,
        likelihood: 3,
        createdAt: "2024-02-20T14:15:00Z",
        updatedAt: "2024-02-21T09:30:00Z",
        status: "COMPLETED",
        department: "İdari İşler",
        assessorId: "1",
        assessorName: "Ahmet Yılmaz",
        risks: [
          {
            id: "201",
            hazard: "Ergonomik olmayan çalışma istasyonları",
            description: "Uzun süreli bilgisayar kullanımı ve uygun olmayan oturma düzeni",
            likelihood: 3,
            severity: 2,
            controls: "Ergonomik sandalyeler temin edilmeli, mola süreleri düzenlenmeli",
            status: "IN_PROGRESS",
          },
        ],
      },
      "3": {
        id: "3",
        title: "Depo Alanı Risk Değerlendirmesi",
        description: "Depo alanındaki yüksekte çalışma ve malzeme taşıma riskleri",
        location: "Ana Depo",
        severity: 5,
        likelihood: 2,
        createdAt: "2024-03-05T09:45:00Z",
        updatedAt: "2024-03-06T11:20:00Z",
        status: "IN_PROGRESS",
        department: "Lojistik",
        assessorId: "1",
        assessorName: "Ahmet Yılmaz",
        risks: [
          {
            id: "301",
            hazard: "Yüksekten düşme",
            description: "Raf sistemlerinde yüksekte çalışma",
            likelihood: 2,
            severity: 5,
            controls: "Yüksekte çalışma izni sistemi kurulmalı, emniyet kemerleri kullanılmalı",
            status: "PENDING",
          },
          {
            id: "302",
            hazard: "Ağır yük kaldırma",
            description: "Manuel malzeme taşıma işlemleri",
            likelihood: 4,
            severity: 3,
            controls: "Mekanik kaldırma ekipmanları kullanılmalı, çalışanlara eğitim verilmeli",
            status: "PENDING",
          },
        ],
      },
      "4": {
        id: "4",
        title: "Laboratuvar Risk Değerlendirmesi",
        description: "Kimyasal madde ve ekipman kullanımı riskleri",
        location: "AR-GE Laboratuvarı",
        severity: 4,
        likelihood: 4,
        createdAt: "2024-03-10T11:20:00Z",
        updatedAt: "2024-03-11T14:30:00Z",
        status: "COMPLETED",
        department: "AR-GE",
        assessorId: "1",
        assessorName: "Ahmet Yılmaz",
        risks: [
          {
            id: "401",
            hazard: "Kimyasal maruziyeti",
            description: "Tehlikeli kimyasallarla çalışma",
            likelihood: 3,
            severity: 4,
            controls: "Lokal havalandırma sistemleri kurulmalı, KKD kullanımı zorunlu olmalı",
            status: "COMPLETED",
          },
        ],
      },
      "5": {
        id: "5",
        title: "Bakım Alanı Risk Değerlendirmesi",
        description: "Bakım faaliyetleri sırasındaki risklerin değerlendirilmesi",
        location: "Teknik Servis",
        severity: 3,
        likelihood: 3,
        createdAt: "2024-03-15T13:00:00Z",
        updatedAt: "2024-03-16T10:15:00Z",
        status: "DRAFT",
        department: "Bakım",
        assessorId: "1",
        assessorName: "Ahmet Yılmaz",
        risks: [
          {
            id: "501",
            hazard: "Elektrik çarpması",
            description: "Elektrikli ekipmanların bakımı sırasında elektrik çarpması riski",
            likelihood: 2,
            severity: 5,
            controls: "Kilitleme-etiketleme prosedürü uygulanmalı, yalıtımlı aletler kullanılmalı",
            status: "PENDING",
          },
          {
            id: "502",
            hazard: "Sıcak yüzeyler",
            description: "Bakım sırasında sıcak yüzeylere temas",
            likelihood: 3,
            severity: 3,
            controls: "Isıya dayanıklı eldivenler kullanılmalı, uyarı işaretleri konulmalı",
            status: "PENDING",
          },
        ],
      },
    };

    const { id } = params;
    const assessment = mockAssessments[id];

    if (!assessment) {
      return NextResponse.json({ error: "Risk değerlendirmesi bulunamadı" }, { status: 404 });
    }

    return NextResponse.json(assessment);
  } catch (error) {
    console.error("Risk değerlendirmesi getirme hatası:", error);
    return NextResponse.json(
      { error: "Risk değerlendirmesi getirilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

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
    console.error("Risk değerlendirmesi güncelleme hatası:", error);
    return NextResponse.json(
      { error: "Risk değerlendirmesi güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    // Log the ID being deleted
    console.log(`Deleting risk assessment with ID: ${params.id}`);

    // Mock delete - just return success message
    return NextResponse.json({ message: "Risk değerlendirmesi başarıyla silindi" });
  } catch (error) {
    console.error("Risk değerlendirmesi silme hatası:", error);
    return NextResponse.json(
      { error: "Risk değerlendirmesi silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
