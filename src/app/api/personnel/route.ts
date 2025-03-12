import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { auth as authOptions } from "@/lib/auth";

// Personel listesi
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    // Mock data for personnel
    const mockPersonnel = [
      {
        id: "1",
        name: "Ahmet Yılmaz",
        position: "İSG Uzmanı",
        department: "İSG",
        email: "ahmet.yilmaz@example.com",
        phone: "+90 555 123 4567",
        status: "ACTIVE",
        employeeId: "EMP001",
        safetyTrainingStatus: "COMPLETED",
        lastTrainingDate: "2024-01-15T10:00:00Z",
        nextTrainingDate: "2024-07-15T10:00:00Z",
        createdAt: "2023-05-10T09:00:00Z",
        updatedAt: "2024-01-15T10:30:00Z",
      },
      {
        id: "2",
        name: "Ayşe Demir",
        position: "İK Uzmanı",
        department: "İnsan Kaynakları",
        email: "ayse.demir@example.com",
        phone: "+90 555 234 5678",
        status: "ACTIVE",
        employeeId: "EMP002",
        safetyTrainingStatus: "COMPLETED",
        lastTrainingDate: "2024-02-10T14:00:00Z",
        nextTrainingDate: "2024-08-10T14:00:00Z",
        createdAt: "2023-06-15T11:00:00Z",
        updatedAt: "2024-02-10T14:30:00Z",
      },
      {
        id: "3",
        name: "Mehmet Kaya",
        position: "Üretim Müdürü",
        department: "Üretim",
        email: "mehmet.kaya@example.com",
        phone: "+90 555 345 6789",
        status: "ACTIVE",
        employeeId: "EMP003",
        safetyTrainingStatus: "PENDING",
        lastTrainingDate: null,
        nextTrainingDate: "2024-04-20T09:00:00Z",
        createdAt: "2023-07-20T10:00:00Z",
        updatedAt: "2024-03-01T09:30:00Z",
      },
      {
        id: "4",
        name: "Zeynep Şahin",
        position: "Muhasebe Uzmanı",
        department: "Finans",
        email: "zeynep.sahin@example.com",
        phone: "+90 555 456 7890",
        status: "INACTIVE",
        employeeId: "EMP004",
        safetyTrainingStatus: "EXPIRED",
        lastTrainingDate: "2023-06-10T10:00:00Z",
        nextTrainingDate: "2023-12-10T10:00:00Z",
        createdAt: "2023-03-15T09:00:00Z",
        updatedAt: "2024-01-05T11:30:00Z",
      },
      {
        id: "5",
        name: "Ali Can",
        position: "Bakım Teknisyeni",
        department: "Teknik",
        email: "ali.can@example.com",
        phone: "+90 555 567 8901",
        status: "ACTIVE",
        employeeId: "EMP005",
        safetyTrainingStatus: "COMPLETED",
        lastTrainingDate: "2024-02-25T10:30:00Z",
        nextTrainingDate: "2024-08-25T10:30:00Z",
        createdAt: "2024-01-10T14:00:00Z",
        updatedAt: "2024-02-25T11:00:00Z",
      },
      {
        id: "6",
        name: "Fatma Yıldız",
        position: "Laboratuvar Teknisyeni",
        department: "AR-GE",
        email: "fatma.yildiz@example.com",
        phone: "+90 555 678 9012",
        status: "ACTIVE",
        employeeId: "EMP006",
        safetyTrainingStatus: "COMPLETED",
        lastTrainingDate: "2024-03-01T09:00:00Z",
        nextTrainingDate: "2024-09-01T09:00:00Z",
        createdAt: "2024-02-15T10:00:00Z",
        updatedAt: "2024-03-01T09:30:00Z",
      },
    ];

    return NextResponse.json(mockPersonnel);
  } catch (error) {
    console.error("Personel getirme hatası:", error);
    return NextResponse.json({ error: "Personel getirilirken bir hata oluştu" }, { status: 500 });
  }
}

// Yeni personel oluştur
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
      status: "ACTIVE",
    });
  } catch (error) {
    console.error("Personel oluşturma hatası:", error);
    return NextResponse.json({ error: "Personel oluşturulurken bir hata oluştu" }, { status: 500 });
  }
}
