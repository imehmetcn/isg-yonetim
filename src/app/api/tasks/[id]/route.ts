import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { auth as authOptions } from '@/lib/auth';

// Görev detaylarını getir
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    // Mock task data
    const mockTasks: Record<string, any> = {
      "1": {
        id: "1",
        title: "Risk değerlendirmesi güncelleme",
        description: "Üretim alanı risk değerlendirmesini güncelle",
        status: "PENDING",
        priority: "HIGH",
        dueDate: "2024-03-25T10:00:00Z",
        assignedTo: session.user.id,
        assignedToName: "Ahmet Yılmaz",
        createdBy: "Mehmet Demir",
        createdAt: "2024-03-10T09:00:00Z",
        updatedAt: "2024-03-10T09:00:00Z",
        completionNotes: null,
        completedAt: null,
        attachments: [],
        relatedItems: [{ type: "risk", id: "1", title: "Üretim Alanı Risk Değerlendirmesi" }],
      },
      "2": {
        id: "2",
        title: "Acil durum tatbikatı",
        description: "Yangın tatbikatı planla ve uygula",
        status: "IN_PROGRESS",
        priority: "MEDIUM",
        dueDate: "2024-03-28T14:00:00Z",
        assignedTo: session.user.id,
        assignedToName: "Ahmet Yılmaz",
        createdBy: "Mehmet Demir",
        createdAt: "2024-03-05T11:30:00Z",
        updatedAt: "2024-03-15T10:15:00Z",
        completionNotes: null,
        completedAt: null,
        attachments: [
          { id: "1", name: "Tatbikat planı.docx", url: "/attachments/tatbikat-plani.docx" },
        ],
        relatedItems: [],
      },
      "3": {
        id: "3",
        title: "İSG eğitimi planlaması",
        description: "Yeni çalışanlar için İSG eğitimi planla",
        status: "PENDING",
        priority: "LOW",
        dueDate: "2024-03-30T09:00:00Z",
        assignedTo: session.user.id,
        assignedToName: "Ahmet Yılmaz",
        createdBy: "Ayşe Demir",
        createdAt: "2024-03-12T14:20:00Z",
        updatedAt: "2024-03-12T14:20:00Z",
        completionNotes: null,
        completedAt: null,
        attachments: [],
        relatedItems: [{ type: "training", id: "3", title: "Yüksekte Çalışma Eğitimi" }],
      },
      "4": {
        id: "4",
        title: "Ekipman bakımı",
        description: "Yangın söndürücülerin bakımını yaptır",
        status: "COMPLETED",
        priority: "HIGH",
        dueDate: "2024-03-15T16:00:00Z",
        assignedTo: session.user.id,
        assignedToName: "Ahmet Yılmaz",
        createdBy: "Mehmet Demir",
        createdAt: "2024-03-01T09:45:00Z",
        updatedAt: "2024-03-14T15:30:00Z",
        completionNotes: "Tüm yangın söndürücülerin bakımı yapıldı ve etiketleri yenilendi.",
        completedAt: "2024-03-14T15:30:00Z",
        attachments: [{ id: "2", name: "Bakım raporu.pdf", url: "/attachments/bakim-raporu.pdf" }],
        relatedItems: [{ type: "equipment", id: "1", title: "Yangın Söndürücü A-1" }],
      },
      "5": {
        id: "5",
        title: "Kaza raporu hazırlama",
        description: "Geçen haftaki kaza için detaylı rapor hazırla",
        status: "IN_PROGRESS",
        priority: "HIGH",
        dueDate: "2024-03-20T17:00:00Z",
        assignedTo: session.user.id,
        assignedToName: "Ahmet Yılmaz",
        createdBy: "Mehmet Demir",
        createdAt: "2024-03-13T10:00:00Z",
        updatedAt: "2024-03-16T11:45:00Z",
        completionNotes: null,
        completedAt: null,
        attachments: [
          { id: "3", name: "Kaza bildirim formu.pdf", url: "/attachments/kaza-bildirim-formu.pdf" },
        ],
        relatedItems: [{ type: "incident", id: "2", title: "Üretim Alanı Kayma Kazası" }],
      },
    };

    const { id } = params;
    const task = mockTasks[id];

    if (!task) {
      return NextResponse.json({ error: "Görev bulunamadı" }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error("Görev detayları hatası:", error);
    return NextResponse.json({ error: "Görev detayları alınamadı" }, { status: 500 });
  }
}

// Görevi güncelle
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();

    // Mock update - just return the body with the id and updated timestamp
    const updatedTask = {
      ...body,
      id,
      updatedAt: new Date().toISOString(),
    };

    // If status is COMPLETED, add completedAt
    if (body.status === "COMPLETED" && !body.completedAt) {
      updatedTask.completedAt = new Date().toISOString();
    }

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("Görev güncelleme hatası:", error);
    return NextResponse.json({ error: "Görev güncellenirken bir hata oluştu" }, { status: 500 });
  }
}

// Görevi sil
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    // Log the ID being deleted
    console.log(`Deleting task with ID: ${params.id}`);

    // Mock delete - just return success message
    return NextResponse.json({ message: "Görev başarıyla silindi" });
  } catch (error) {
    console.error("Görev silme hatası:", error);
    return NextResponse.json({ error: "Görev silinirken bir hata oluştu" }, { status: 500 });
  }
}
