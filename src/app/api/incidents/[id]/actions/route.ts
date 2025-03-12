import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { incidents, incidentActions } from "@/lib/db/schema";
import { getServerSession } from "next-auth";
import { auth as authOptions } from '@/lib/auth';
import { eq, desc } from "drizzle-orm";

// Aksiyon listesini getir
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

    // Aksiyonları getir
    const actions = await db.query.incidentActions.findMany({
      where: eq(incidentActions.incidentId, params.id),
      orderBy: [desc(incidentActions.createdAt)],
      with: {
        incident: true,
      },
    });

    return NextResponse.json(actions);
  } catch (error) {
    console.error("Aksiyon listesi hatası:", error);
    return NextResponse.json({ error: "Aksiyon listesi alınamadı" }, { status: 500 });
  }
}

// Yeni aksiyon ekle
export async function POST(req: Request, { params }: { params: { id: string } }) {
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

    // Aksiyon oluştur
    const now = new Date().toISOString();
    const [action] = await db
      .insert(incidentActions)
      .values({
        id: crypto.randomUUID(),
        incidentId: params.id,
        title,
        description,
        status: status || "pending",
        dueDate: new Date(dueDate).toISOString(),
        assignedTo,
        createdAt: now,
        updatedAt: now
      })
      .returning();

    // Oluşturulan aksiyonu getir
    const newAction = await db.query.incidentActions.findFirst({
      where: eq(incidentActions.id, action.id),
      with: {
        incident: true,
      },
    });

    return NextResponse.json(newAction);
  } catch (error) {
    console.error("Aksiyon oluşturma hatası:", error);
    return NextResponse.json({ error: "Aksiyon oluşturulamadı" }, { status: 500 });
  }
}
