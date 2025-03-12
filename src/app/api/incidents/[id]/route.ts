import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { incidents, incidentActions, incidentFollowUps } from "@/lib/db/schema";
import { getServerSession } from "next-auth";
import { auth as authOptions } from '@/lib/auth';
import { eq } from "drizzle-orm";

// Olay detaylarını getir
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    // Olayı getir
    const incident = await db.query.incidents.findFirst({
      where: eq(incidents.id, params.id),
      with: {
        actions: true,
        followUps: true,
      },
    });

    if (!incident) {
      return NextResponse.json({ error: "Olay bulunamadı" }, { status: 404 });
    }

    return NextResponse.json(incident);
  } catch (error) {
    console.error("Olay detayları hatası:", error);
    return NextResponse.json({ error: "Olay detayları alınamadı" }, { status: 500 });
  }
}

// Olayı güncelle
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    const {
      title,
      description,
      date,
      location,
      severity,
      status,
      reportedBy,
      assignedTo,
      actions
    } = await req.json();

    // Olayı kontrol et
    const existingIncident = await db.query.incidents.findFirst({
      where: eq(incidents.id, params.id),
    });

    if (!existingIncident) {
      return NextResponse.json({ error: "Olay bulunamadı" }, { status: 404 });
    }

    // Olayı güncelle
    const now = new Date().toISOString();
    const [incident] = await db
      .update(incidents)
      .set({
        title: title || existingIncident.title,
        description: description || existingIncident.description,
        date: date ? new Date(date).toISOString() : existingIncident.date,
        location: location || existingIncident.location,
        severity: severity || existingIncident.severity,
        status: status || existingIncident.status,
        reportedBy: reportedBy || existingIncident.reportedBy,
        assignedTo: assignedTo || existingIncident.assignedTo,
        updatedAt: now
      })
      .where(eq(incidents.id, params.id))
      .returning();

    // Aksiyonları güncelle
    if (actions && Array.isArray(actions)) {
      // Mevcut aksiyonları sil
      await db.delete(incidentActions).where(eq(incidentActions.incidentId, params.id));

      // Yeni aksiyonları ekle
      if (actions.length > 0) {
        await db.insert(incidentActions).values(
          actions.map(action => ({
            id: crypto.randomUUID(),
            incidentId: params.id,
            title: action.title,
            description: action.description,
            status: action.status || "pending",
            dueDate: new Date(action.dueDate).toISOString(),
            assignedTo: action.assignedTo,
            createdAt: now,
            updatedAt: now
          }))
        );
      }
    }

    // Güncellenmiş olayı getir
    const updatedIncident = await db.query.incidents.findFirst({
      where: eq(incidents.id, incident.id),
      with: {
        actions: true,
        followUps: true,
      },
    });

    return NextResponse.json(updatedIncident);
  } catch (error) {
    console.error("Olay güncelleme hatası:", error);
    return NextResponse.json({ error: "Olay güncellenemedi" }, { status: 500 });
  }
}

// Olayı sil
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
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

    // İlişkili aksiyonları sil
    await db.delete(incidentActions).where(eq(incidentActions.incidentId, params.id));

    // İlişkili takip kayıtlarını sil
    await db.delete(incidentFollowUps).where(eq(incidentFollowUps.incidentId, params.id));

    // Olayı sil
    await db.delete(incidents).where(eq(incidents.id, params.id));

    return NextResponse.json({ message: "Olay başarıyla silindi" });
  } catch (error) {
    console.error("Olay silme hatası:", error);
    return NextResponse.json({ error: "Olay silinemedi" }, { status: 500 });
  }
}
