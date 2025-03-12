import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checklists, checklistItems } from "@/lib/db/schema";
import { getServerSession } from "next-auth";
import { auth as authOptions } from "@/lib/auth";
import { eq } from "drizzle-orm";

// Kontrol listesi detaylarını getir
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    // Kontrol listesini getir
    const checklist = await db.query.checklists.findFirst({
      where: eq(checklists.id, params.id),
      with: {
        items: true,
        createdByUser: true,
      },
    });

    if (!checklist) {
      return NextResponse.json({ error: "Kontrol listesi bulunamadı" }, { status: 404 });
    }

    return NextResponse.json(checklist);
  } catch (error) {
    console.error("Kontrol listesi detayları hatası:", error);
    return NextResponse.json({ error: "Kontrol listesi detayları alınamadı" }, { status: 500 });
  }
}

// Kontrol listesini güncelle
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    const { title, description, type, department, location, dueDate, status, items } =
      await req.json();

    // Kontrol listesini kontrol et
    const existingChecklist = await db.query.checklists.findFirst({
      where: eq(checklists.id, params.id),
    });

    if (!existingChecklist) {
      return NextResponse.json({ error: "Kontrol listesi bulunamadı" }, { status: 404 });
    }

    // Sadece oluşturan kişi veya admin güncelleyebilir
    if (existingChecklist.createdBy !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ error: "Bu işlem için yetkiniz yok" }, { status: 403 });
    }

    // Güncellenecek alanları hazırla
    const updates: any = {};
    if (title) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (type) updates.type = type;
    if (department) updates.department = department;
    if (location) updates.location = location;
    if (dueDate) updates.dueDate = new Date(dueDate).toISOString();
    if (status) updates.status = status;

    // Kontrol listesini güncelle
    const [updatedChecklist] = await db
      .update(checklists)
      .set(updates)
      .where(eq(checklists.id, params.id))
      .returning();

    // Öğeleri güncelle
    if (items && Array.isArray(items)) {
      // Mevcut öğeleri sil
      await db.delete(checklistItems).where(eq(checklistItems.checklistId, params.id));

      // Yeni öğeleri ekle
      if (items.length > 0) {
        const now = new Date().toISOString();
        await db.insert(checklistItems).values(
          items.map((item, index) => ({
            id: crypto.randomUUID(),
            checklistId: updatedChecklist.id,
            title: item.title || `Öğe ${index + 1}`,
            description: item.description,
            status: item.status || "pending",
            order: index,
            createdAt: now,
            updatedAt: now
          }))
        );
      }
    }

    // Güncellenmiş kontrol listesini getir
    const checklist = await db.query.checklists.findFirst({
      where: eq(checklists.id, updatedChecklist.id),
      with: {
        items: true,
        createdByUser: true,
      },
    });

    return NextResponse.json(checklist);
  } catch (error) {
    console.error("Kontrol listesi güncelleme hatası:", error);
    return NextResponse.json({ error: "Kontrol listesi güncellenemedi" }, { status: 500 });
  }
}

// Kontrol listesini sil
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    // Kontrol listesini kontrol et
    const existingChecklist = await db.query.checklists.findFirst({
      where: eq(checklists.id, params.id),
    });

    if (!existingChecklist) {
      return NextResponse.json({ error: "Kontrol listesi bulunamadı" }, { status: 404 });
    }

    // Sadece oluşturan kişi veya admin silebilir
    if (existingChecklist.createdBy !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ error: "Bu işlem için yetkiniz yok" }, { status: 403 });
    }

    // Öğeleri sil
    await db.delete(checklistItems).where(eq(checklistItems.checklistId, params.id));

    // Kontrol listesini sil
    await db.delete(checklists).where(eq(checklists.id, params.id));

    return NextResponse.json({ message: "Kontrol listesi başarıyla silindi" });
  } catch (error) {
    console.error("Kontrol listesi silme hatası:", error);
    return NextResponse.json({ error: "Kontrol listesi silinemedi" }, { status: 500 });
  }
}
