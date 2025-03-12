import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { auth as authOptions } from "@/lib/auth";

// Atanmış görevleri getir
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    // Mock data for assigned tasks
    const mockAssignedTasks = [
      {
        id: "1",
        title: "Risk değerlendirmesi güncelleme",
        description: "Üretim alanı risk değerlendirmesini güncelle",
        status: "PENDING",
        priority: "HIGH",
        dueDate: new Date("2024-03-25"),
        assignedTo: session.user.id,
        assignedToName: "Ahmet Yılmaz",
        createdBy: "Mehmet Demir",
        createdAt: new Date("2024-03-10"),
        updatedAt: new Date("2024-03-10"),
      },
      {
        id: "2",
        title: "Acil durum tatbikatı",
        description: "Yangın tatbikatı planla ve uygula",
        status: "IN_PROGRESS",
        priority: "MEDIUM",
        dueDate: new Date("2024-03-28"),
        assignedTo: session.user.id,
        assignedToName: "Ahmet Yılmaz",
        createdBy: "Mehmet Demir",
        createdAt: new Date("2024-03-05"),
        updatedAt: new Date("2024-03-15"),
      },
      {
        id: "3",
        title: "İSG eğitimi planlaması",
        description: "Yeni çalışanlar için İSG eğitimi planla",
        status: "PENDING",
        priority: "LOW",
        dueDate: new Date("2024-03-30"),
        assignedTo: session.user.id,
        assignedToName: "Ahmet Yılmaz",
        createdBy: "Ayşe Demir",
        createdAt: new Date("2024-03-12"),
        updatedAt: new Date("2024-03-12"),
      },
    ];

    return NextResponse.json(mockAssignedTasks);
  } catch (error) {
    console.error("Atanmış görevler getirme hatası:", error);
    return NextResponse.json(
      { error: "Atanmış görevler getirilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
