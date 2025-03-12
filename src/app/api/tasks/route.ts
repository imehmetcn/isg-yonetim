import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { auth as authOptions } from "@/lib/auth";

// Görevler listesi
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    // Mock data for tasks
    const mockTasks = [
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
      {
        id: "4",
        title: "Ekipman bakımı",
        description: "Yangın söndürücülerin bakımını yaptır",
        status: "COMPLETED",
        priority: "HIGH",
        dueDate: new Date("2024-03-15"),
        assignedTo: session.user.id,
        assignedToName: "Ahmet Yılmaz",
        createdBy: "Mehmet Demir",
        createdAt: new Date("2024-03-01"),
        updatedAt: new Date("2024-03-14"),
      },
      {
        id: "5",
        title: "Kaza raporu hazırlama",
        description: "Geçen haftaki kaza için detaylı rapor hazırla",
        status: "IN_PROGRESS",
        priority: "HIGH",
        dueDate: new Date("2024-03-20"),
        assignedTo: session.user.id,
        assignedToName: "Ahmet Yılmaz",
        createdBy: "Mehmet Demir",
        createdAt: new Date("2024-03-13"),
        updatedAt: new Date("2024-03-16"),
      },
    ];

    return NextResponse.json(mockTasks);
  } catch (error) {
    console.error("Görevler getirme hatası:", error);
    return NextResponse.json({ error: "Görevler getirilirken bir hata oluştu" }, { status: 500 });
  }
}

// Yeni görev oluştur
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, priority, dueDate, assignedTo } = body;

    if (!title || !dueDate) {
      return NextResponse.json({ error: "Gerekli alanlar eksik" }, { status: 400 });
    }

    // Mock response - just return the body with an id
    return NextResponse.json({
      id: Math.floor(Math.random() * 1000).toString(),
      title,
      description: description || "",
      status: "PENDING",
      priority: priority || "MEDIUM",
      dueDate: new Date(dueDate),
      assignedTo: assignedTo || session.user.id,
      assignedToName: "Ahmet Yılmaz", // Mock name
      createdBy: session.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Görev oluşturma hatası:", error);
    return NextResponse.json({ error: "Görev oluşturulurken bir hata oluştu" }, { status: 500 });
  }
}

// Görev güncelle
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    const body = await req.json();
    const { id, status, completionNotes } = body;

    // Mock update - just return the body with updated fields
    return NextResponse.json({
      id,
      status,
      completionNotes: completionNotes || "",
      updatedAt: new Date().toISOString(),
      updatedBy: session.user.id,
    });
  } catch (error) {
    console.error("Görev güncelleme hatası:", error);
    return NextResponse.json({ error: "Görev güncellenirken bir hata oluştu" }, { status: 500 });
  }
}

// Görev sil
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Görev ID gerekli" }, { status: 400 });
    }

    // Mock delete - just return success message
    return NextResponse.json({ message: "Görev başarıyla silindi" });
  } catch (error) {
    console.error("Görev silme hatası:", error);
    return NextResponse.json({ error: "Görev silinirken bir hata oluştu" }, { status: 500 });
  }
}
