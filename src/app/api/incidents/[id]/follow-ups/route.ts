import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { incidents, incidentFollowUps } from "@/lib/db/schema";
import { getServerSession } from "next-auth";
import { auth as authOptions } from '@/lib/auth';
import { eq, desc } from "drizzle-orm";

// Olay takip kayıtlarını getir
export async function GET(_req: Request, { params }: { params: { id: string } }) {
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

    // Takip kayıtlarını getir
    const followUps = await db.query.incidentFollowUps.findMany({
      where: eq(incidentFollowUps.incidentId, params.id),
      orderBy: [desc(incidentFollowUps.createdAt)],
      with: {
        incident: true,
      },
    });

    return NextResponse.json(followUps);
  } catch (error) {
    console.error("Takip kayıtları hatası:", error);
    return NextResponse.json({ error: "Takip kayıtları alınamadı" }, { status: 500 });
  }
}

// Yeni takip kaydı ekle
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    const { title, description, date, status } = await req.json();

    // Olayı kontrol et
    const incident = await db.query.incidents.findFirst({
      where: eq(incidents.id, params.id),
    });

    if (!incident) {
      return NextResponse.json({ error: "Olay bulunamadı" }, { status: 404 });
    }

    // Takip kaydı oluştur
    const now = new Date().toISOString();
    const [followUp] = await db
      .insert(incidentFollowUps)
      .values({
        id: crypto.randomUUID(),
        incidentId: params.id,
        title,
        description,
        status: status || "pending",
        date: new Date(date).toISOString(),
        createdBy: session.user.id,
        createdAt: now,
        updatedAt: now
      })
      .returning();

    // Oluşturulan takip kaydını getir
    const newFollowUp = await db.query.incidentFollowUps.findFirst({
      where: eq(incidentFollowUps.id, followUp.id),
      with: {
        incident: true,
      },
    });

    return NextResponse.json(newFollowUp);
  } catch (error) {
    console.error("Takip kaydı oluşturma hatası:", error);
    return NextResponse.json({ error: "Takip kaydı oluşturulamadı" }, { status: 500 });
  }
}
