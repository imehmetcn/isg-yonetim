import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { incidents, incidentActions } from "@/lib/db/schema";
import { getServerSession } from "next-auth";
import { auth as authOptions } from '@/lib/auth';
import { eq } from "drizzle-orm";

// Aksiyon detaylarını getir
export async function GET(_req: Request, { params }: { params: { id: string; actionId: string } }) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    // Olayı kontrol et
    const incident = await db.query.incidents.findFirst({
      where: eq(incidents.id, params.id),
    });

    if (!incident) {
      return NextResponse.json({ error: "Olay bulunamadı" }, { status: 404 });
    }

    // Aksiyonu getir
    const action = await db.query.incidentActions.findFirst({
      where: eq(incidentActions.id, params.actionId),
      with: {
        incident: true,
      },
    });

    if (!action) {
      return NextResponse.json({ error: "Aksiyon bulunamadı" }, { status: 404 });
    }

    return NextResponse.json(action);
  } catch (error) {
    console.error("Aksiyon detayları hatası:", error);
    return NextResponse.json({ error: "Aksiyon detayları alınamadı" }, { status: 500 });
  }
}

// Aksiyonu güncelle
export async function PUT(req: Request, { params }: { params: { id: string; actionId: string } }) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    const { title, description, assignedTo, dueDate, status } = await req.json();

    // Olayı kontrol et
    const incident = await db.query.incidents.findFirst({
      where: eq(incidents.id, params.id),
    });

    if (!incident) {
      return NextResponse.json({ error: "Olay bulunamadı" }, { status: 404 });
    }

    // Aksiyonu kontrol et
    const existingAction = await db.query.incidentActions.findFirst({
      where: eq(incidentActions.id, params.actionId),
    });

    if (!existingAction) {
      return NextResponse.json({ error: "Aksiyon bulunamadı" }, { status: 404 });
    }

    // Aksiyonu güncelle
    const now = new Date().toISOString();
    const [action] = await db
      .update(incidentActions)
      .set({
        title: title || existingAction.title,
        description: description || existingAction.description,
        assignedTo: assignedTo || existingAction.assignedTo,
        dueDate: dueDate ? new Date(dueDate).toISOString() : existingAction.dueDate,
        status: status || existingAction.status,
        updatedAt: now
      })
      .where(eq(incidentActions.id, params.actionId))
      .returning();

    // Güncellenmiş aksiyonu getir
    const updatedAction = await db.query.incidentActions.findFirst({
      where: eq(incidentActions.id, action.id),
      with: {
        incident: true,
      },
    });

    return NextResponse.json(updatedAction);
  } catch (error) {
    console.error("Aksiyon güncelleme hatası:", error);
    return NextResponse.json({ error: "Aksiyon güncellenemedi" }, { status: 500 });
  }
}

// Aksiyonu sil
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string; actionId: string } }
) {
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

    // Olayı kontrol et
    const incident = await db.query.incidents.findFirst({
      where: eq(incidents.id, params.id),
    });

    if (!incident) {
      return NextResponse.json({ error: "Olay bulunamadı" }, { status: 404 });
    }

    // Aksiyonu kontrol et
    const action = await db.query.incidentActions.findFirst({
      where: eq(incidentActions.id, params.actionId),
    });

    if (!action) {
      return NextResponse.json({ error: "Aksiyon bulunamadı" }, { status: 404 });
    }

    // Aksiyonu sil
    await db.delete(incidentActions).where(eq(incidentActions.id, params.actionId));

    return NextResponse.json({ message: "Aksiyon başarıyla silindi" });
  } catch (error) {
    console.error("Aksiyon silme hatası:", error);
    return NextResponse.json({ error: "Aksiyon silinemedi" }, { status: 500 });
  }
}
