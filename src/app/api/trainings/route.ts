import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { auth as authOptions } from "@/lib/auth";

// Eğitimler listesi
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    // Mock data for trainings
    const mockTrainings = [
      {
        id: "1",
        title: "İş Sağlığı ve Güvenliği Temel Eğitimi",
        description: "Tüm çalışanlar için temel İSG eğitimi",
        status: "COMPLETED",
        startDate: new Date("2024-02-10"),
        endDate: new Date("2024-02-11"),
        attendees: "25",
        instructor: "Ahmet Yılmaz",
        location: "Eğitim Salonu A",
        duration: "8 saat",
      },
      {
        id: "2",
        title: "Acil Durum ve Yangın Eğitimi",
        description: "Acil durum prosedürleri ve yangın söndürme eğitimi",
        status: "COMPLETED",
        startDate: new Date("2024-02-20"),
        endDate: new Date("2024-02-20"),
        attendees: "30",
        instructor: "Mehmet Demir",
        location: "Eğitim Salonu B",
        duration: "4 saat",
      },
      {
        id: "3",
        title: "Yüksekte Çalışma Eğitimi",
        description: "Yüksekte güvenli çalışma teknikleri",
        status: "PENDING",
        startDate: new Date("2024-03-15"),
        endDate: new Date("2024-03-16"),
        attendees: "15",
        instructor: "Ali Kaya",
        location: "Uygulama Alanı",
        duration: "16 saat",
      },
      {
        id: "4",
        title: "Kimyasal Madde Güvenliği",
        description: "Kimyasal maddelerle güvenli çalışma eğitimi",
        status: "IN_PROGRESS",
        startDate: new Date("2024-03-05"),
        endDate: new Date("2024-03-07"),
        attendees: "20",
        instructor: "Ayşe Demir",
        location: "Laboratuvar",
        duration: "12 saat",
      },
    ];

    return NextResponse.json(mockTrainings);
  } catch (error) {
    console.error("Eğitimler getirme hatası:", error);
    return NextResponse.json({ error: "Eğitimler getirilirken bir hata oluştu" }, { status: 500 });
  }
}

// Yeni eğitim oluştur
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Eğitim oluşturma hatası:", error);
    return NextResponse.json({ error: "Eğitim oluşturulurken bir hata oluştu" }, { status: 500 });
  }
}
