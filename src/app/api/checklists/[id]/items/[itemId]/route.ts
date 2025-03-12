import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checklists, checklistItems } from "@/lib/db/schema";
import { getServerSession } from "next-auth";
import { auth as authOptions } from "@/lib/auth";
import { eq } from "drizzle-orm";

// Kontrol listesi öğesi detaylarını getir
export async function GET(_req: Request, { params }: { params: { id: string; itemId: string } }) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    const { id, itemId } = params;

    // Kontrol listesini kontrol et
    const checklist = await db.query.checklists.findFirst({
      where: eq(checklists.id, id),
    });

    if (!checklist) {
      return NextResponse.json({ error: "Kontrol listesi bulunamadı" }, { status: 404 });
    }

    // Öğeyi getir
    const item = await db.query.checklistItems.findFirst({
      where: eq(checklistItems.id, itemId),
    });

    if (!item) {
      return NextResponse.json({ error: "Kontrol listesi öğesi bulunamadı" }, { status: 404 });
    }

    // Öğe kontrol listesi ile ilişkili mi kontrol et
    if (item.checklistId !== id) {
      return NextResponse.json(
        { error: "Bu öğe belirtilen kontrol listesi ile ilişkili değil" },
        { status: 400 }
      );
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error("Kontrol listesi öğesi detayları hatası:", error);
    return NextResponse.json(
      { error: "Kontrol listesi öğesi detayları alınamadı" },
      { status: 500 }
    );
  }
}

// Kontrol listesi öğesi güncelle
export async function PUT(req: Request, { params }: { params: { id: string; itemId: string } }) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    const { id, itemId } = params;

    // Kontrol listesini kontrol et
    const existingChecklist = await db.query.checklists.findFirst({
      where: eq(checklists.id, id),
    });

    if (!existingChecklist) {
      return NextResponse.json({ error: "Kontrol listesi bulunamadı" }, { status: 404 });
    }

    // Öğeyi kontrol et
    const existingItem = await db.query.checklistItems.findFirst({
      where: eq(checklistItems.id, itemId),
    });

    if (!existingItem) {
      return NextResponse.json({ error: "Kontrol listesi öğesi bulunamadı" }, { status: 404 });
    }

    // Öğe kontrol listesi ile ilişkili mi kontrol et
    if (existingItem.checklistId !== id) {
      return NextResponse.json(
        { error: "Bu öğe belirtilen kontrol listesi ile ilişkili değil" },
        { status: 400 }
      );
    }

    const { title, description, status } = await req.json();

    // Güncellenecek alanları hazırla
    const updates: any = {};
    const now = new Date().toISOString();

    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (status !== undefined) updates.status = status;
    updates.updatedAt = now;

    // Öğeyi güncelle
    const [updatedItem] = await db
      .update(checklistItems)
      .set(updates)
      .where(eq(checklistItems.id, itemId))
      .returning();

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("Kontrol listesi öğesi güncelleme hatası:", error);
    return NextResponse.json(
      { error: "Kontrol listesi öğesi güncellenemedi" },
      { status: 500 }
    );
  }
}

// Kontrol listesi öğesi sil
export async function DELETE(_req: Request, { params }: { params: { id: string; itemId: string } }) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    // Admin kontrolü
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Bu işlem için admin yetkisi gerekli" }, { status: 403 });
    }

    const { id, itemId } = params;

    // Kontrol listesini kontrol et
    const existingChecklist = await db.query.checklists.findFirst({
      where: eq(checklists.id, id),
    });

    if (!existingChecklist) {
      return NextResponse.json({ error: "Kontrol listesi bulunamadı" }, { status: 404 });
    }

    // Öğeyi kontrol et
    const existingItem = await db.query.checklistItems.findFirst({
      where: eq(checklistItems.id, itemId),
    });

    if (!existingItem) {
      return NextResponse.json({ error: "Kontrol listesi öğesi bulunamadı" }, { status: 404 });
    }

    // Öğe kontrol listesi ile ilişkili mi kontrol et
    if (existingItem.checklistId !== id) {
      return NextResponse.json(
        { error: "Bu öğe belirtilen kontrol listesi ile ilişkili değil" },
        { status: 400 }
      );
    }

    // Öğeyi sil
    await db.delete(checklistItems).where(eq(checklistItems.id, itemId));

    return NextResponse.json({ message: "Kontrol listesi öğesi başarıyla silindi" });
  } catch (error) {
    console.error("Kontrol listesi öğesi silme hatası:", error);
    return NextResponse.json({ error: "Kontrol listesi öğesi silinemedi" }, { status: 500 });
  }
}
