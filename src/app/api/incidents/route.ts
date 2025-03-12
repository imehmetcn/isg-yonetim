import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { incidents, incidentActions } from "@/lib/db/schema";
import { getServerSession } from "next-auth";
import { auth as authOptions } from "@/lib/auth";
import { eq, and, sql } from "drizzle-orm";

// Olay listesini getir
export async function GET(req: Request) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    // URL parametrelerini al
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const severity = searchParams.get("severity");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Sorgu koşullarını hazırla
    let query = db.query.incidents.findMany({
      orderBy: (incidents, { desc }) => [desc(incidents.date)],
      with: {
        actions: true,
      },
    });

    // Duruma göre filtrele
    if (status) {
      query = db.query.incidents.findMany({
        where: eq(incidents.status, status),
        orderBy: (incidents, { desc }) => [desc(incidents.date)],
        with: {
          actions: true,
        },
      });
    }

    // Şiddete göre filtrele
    if (severity) {
      query = db.query.incidents.findMany({
        where: eq(incidents.severity, severity),
        orderBy: (incidents, { desc }) => [desc(incidents.date)],
        with: {
          actions: true,
        },
      });
    }

    // Tarihe göre filtrele
    if (startDate && endDate) {
      const startDateISO = new Date(startDate).toISOString();
      const endDateISO = new Date(endDate).toISOString();

      query = db.query.incidents.findMany({
        where: and(
          sql`${incidents.date} >= ${startDateISO}`,
          sql`${incidents.date} <= ${endDateISO}`
        ),
        orderBy: (incidents, { desc }) => [desc(incidents.date)],
        with: {
          actions: true,
        },
      });
    }

    // Olayları getir
    const incidentList = await query;

    return NextResponse.json(incidentList);
  } catch (error) {
    console.error("Olay listesi hatası:", error);
    return NextResponse.json({ error: "Olay listesi alınamadı" }, { status: 500 });
  }
}

// Yeni olay oluştur
export async function POST(req: Request) {
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

    // İstek verilerini al
    const {
      title,
      description,
      severity,
      status,
      location,
      date,
      assignedTo,
      actions,
    } = await req.json();

    // Gerekli alanları kontrol et
    if (!title || !description || !severity || !location || !date) {
      return NextResponse.json({ error: "Gerekli alanlar eksik" }, { status: 400 });
    }

    // Olay oluştur
    const now = new Date().toISOString();
    const [incident] = await db.insert(incidents).values({
      id: crypto.randomUUID(),
      title,
      description,
      severity,
      status: status || "open",
      location,
      date: new Date(date).toISOString(),
      reportedBy: session.user.id,
      assignedTo: assignedTo || null,
      actions: null,
      followUps: null,
      createdAt: now,
      updatedAt: now
    }).returning();

    // Aksiyonları ekle
    if (actions && Array.isArray(actions) && actions.length > 0) {
      await db.insert(incidentActions).values(
        actions.map(action => ({
          id: crypto.randomUUID(),
          incidentId: incident.id,
          title: action.title,
          description: action.description,
          assignedTo: action.assignedTo,
          dueDate: new Date(action.dueDate).toISOString(),
          status: action.status || "pending",
          createdAt: now,
          updatedAt: now
        }))
      );
    }

    return NextResponse.json({ message: "Olay başarıyla oluşturuldu", incident }, { status: 201 });
  } catch (error) {
    console.error("Olay oluşturma hatası:", error);
    return NextResponse.json({ error: "Olay oluşturulurken bir hata oluştu" }, { status: 500 });
  }
}
