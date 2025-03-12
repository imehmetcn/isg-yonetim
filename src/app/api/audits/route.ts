import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { auth as authOptions } from "@/lib/auth";

// Denetimler listesi
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    // Mock data for audits
    const mockAudits = [
      {
        id: "1",
        title: "İş Güvenliği Denetimi",
        description: "Üretim alanında iş güvenliği denetimi",
        department: "Üretim",
        date: new Date("2024-02-15"),
        status: "COMPLETED",
        findings: "Koruyucu ekipman eksiklikleri tespit edildi",
      },
      {
        id: "2",
        title: "Yangın Güvenliği Denetimi",
        description: "Tüm tesiste yangın güvenliği denetimi",
        department: "Tesis Yönetimi",
        date: new Date("2024-02-28"),
        status: "COMPLETED",
        findings: "Yangın söndürücülerin bakımları yapılmalı",
      },
      {
        id: "3",
        title: "Ergonomi Denetimi",
        description: "Ofis alanlarında ergonomi denetimi",
        department: "İnsan Kaynakları",
        date: new Date("2024-03-10"),
        status: "IN_PROGRESS",
        findings: null,
      },
      {
        id: "4",
        title: "Kimyasal Madde Denetimi",
        description: "Laboratuvar ve depolarda kimyasal madde denetimi",
        department: "AR-GE",
        date: new Date("2024-03-25"),
        status: "PLANNED",
        findings: null,
      },
    ];

    return NextResponse.json(mockAudits);
  } catch (error) {
    console.error("Denetimler getirme hatası:", error);
    return NextResponse.json({ error: "Denetimler getirilirken bir hata oluştu" }, { status: 500 });
  }
}

// Yeni denetim oluştur
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, department, date, type } = body;

    if (!title || !department || !date) {
      return NextResponse.json({ error: "Gerekli alanlar eksik" }, { status: 400 });
    }

    // Mock response - just return the body with an id
    return NextResponse.json({
      id: Math.floor(Math.random() * 1000).toString(),
      title,
      description: description || "",
      department,
      date: new Date(date),
      type: type || "INTERNAL",
      status: "PLANNED",
      auditorId: session.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Denetim oluşturma hatası:", error);
    return NextResponse.json({ error: "Denetim oluşturulurken bir hata oluştu" }, { status: 500 });
  }
}
