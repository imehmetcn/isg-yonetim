import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { incidents, incidentFollowUps } from "@/lib/db/schema";
import { getServerSession } from "next-auth";
import { auth as authOptions } from '@/lib/auth';
import { eq } from "drizzle-orm";

// Takip kaydı detaylarını getir
export async function GET(
  _req: Request,
  { params }: { params: { id: string; followUpId: string } }
) {
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

    // Takip kaydını getir
    const followUp = await db.query.incidentFollowUps.findFirst({
      where: eq(incidentFollowUps.id, params.followUpId),
      with: {
        incident: true,
      },
    });

    if (!followUp) {
      return NextResponse.json({ error: "Takip kaydı bulunamadı" }, { status: 404 });
    }

    return NextResponse.json(followUp);
  } catch (error) {
    console.error("Takip kaydı detayları hatası:", error);
    return NextResponse.json({ error: "Takip kaydı detayları alınamadı" }, { status: 500 });
  }
}

// Takip kaydını güncelle
export async function PUT(
  req: Request,
  { params }: { params: { id: string; followUpId: string } }
) {
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

    // Takip kaydını kontrol et
    const existingFollowUp = await db.query.incidentFollowUps.findFirst({
      where: eq(incidentFollowUps.id, params.followUpId),
    });

    if (!existingFollowUp) {
      return NextResponse.json({ error: "Takip kaydı bulunamadı" }, { status: 404 });
    }

    const { title, description, date, status } = await req.json();

    // Takip kaydını güncelle
    const now = new Date().toISOString();
    const [followUp] = await db
      .update(incidentFollowUps)
      .set({
        title: title || existingFollowUp.title,
        description: description || existingFollowUp.description,
        date: date ? new Date(date).toISOString() : existingFollowUp.date,
        status: status || existingFollowUp.status,
        updatedAt: now
      })
      .where(eq(incidentFollowUps.id, params.followUpId))
      .returning();

    // Güncellenmiş takip kaydını getir
    const updatedFollowUp = await db.query.incidentFollowUps.findFirst({
      where: eq(incidentFollowUps.id, followUp.id),
      with: {
        incident: true,
      },
    });

    return NextResponse.json(updatedFollowUp);
  } catch (error) {
    console.error("Takip kaydı güncelleme hatası:", error);
    return NextResponse.json({ error: "Takip kaydı güncellenemedi" }, { status: 500 });
  }
}

// Takip kaydını sil
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string; followUpId: string } }
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

    // Takip kaydını kontrol et
    const followUp = await db.query.incidentFollowUps.findFirst({
      where: eq(incidentFollowUps.id, params.followUpId),
    });

    if (!followUp) {
      return NextResponse.json({ error: "Takip kaydı bulunamadı" }, { status: 404 });
    }

    // Takip kaydını sil
    await db.delete(incidentFollowUps).where(eq(incidentFollowUps.id, params.followUpId));

    return NextResponse.json({ message: "Takip kaydı başarıyla silindi" });
  } catch (error) {
    console.error("Takip kaydı silme hatası:", error);
    return NextResponse.json({ error: "Takip kaydı silinemedi" }, { status: 500 });
  }
}
