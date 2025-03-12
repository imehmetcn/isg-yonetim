import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checklists, checklistItems } from "@/lib/db/schema";
import { getServerSession } from "next-auth";
import { auth as authOptions } from "@/lib/auth";
import { eq, and, sql } from "drizzle-orm";

// Kontrol listelerini getir
export async function GET(req: Request) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    // URL parametrelerini al
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const department = searchParams.get("department");
    const status = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Sorgu koşullarını hazırla
    let query = db.query.checklists.findMany({
      orderBy: (checklists, { desc }) => [desc(checklists.createdAt)],
      with: {
        items: true,
        createdByUser: true,
      },
    });

    // Türe göre filtrele
    if (type) {
      query = db.query.checklists.findMany({
        where: eq(
          checklists.type,
          type as "daily" | "weekly" | "monthly" | "quarterly" | "annual" | "special"
        ),
        orderBy: (checklists, { desc }) => [desc(checklists.createdAt)],
        with: {
          items: true,
          createdByUser: true,
        },
      });
    }

    // Departmana göre filtrele
    if (department) {
      query = db.query.checklists.findMany({
        where: eq(checklists.department, department),
        orderBy: (checklists, { desc }) => [desc(checklists.createdAt)],
        with: {
          items: true,
          createdByUser: true,
        },
      });
    }

    // Duruma göre filtrele
    if (status) {
      query = db.query.checklists.findMany({
        where: eq(checklists.status, status as "in_progress" | "completed" | "overdue" | "pending"),
        orderBy: (checklists, { desc }) => [desc(checklists.createdAt)],
        with: {
          items: true,
          createdByUser: true,
        },
      });
    }

    // Tarihe göre filtrele
    if (startDate && endDate) {
      const startDateISO = new Date(startDate).toISOString();
      const endDateISO = new Date(endDate).toISOString();

      query = db.query.checklists.findMany({
        where: and(
          sql`${checklists.createdAt} >= ${startDateISO}`,
          sql`${checklists.createdAt} <= ${endDateISO}`
        ),
        orderBy: (checklists, { desc }) => [desc(checklists.createdAt)],
        with: {
          items: true,
          createdByUser: true,
        },
      });
    }

    // Kontrol listelerini getir
    const checklistList = await query;

    return NextResponse.json(checklistList);
  } catch (error) {
    console.error("Kontrol listesi hatası:", error);
    return NextResponse.json({ error: "Kontrol listesi alınamadı" }, { status: 500 });
  }
}

// Yeni kontrol listesi oluştur
export async function POST(req: Request) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    const { title, description, type, department, location, dueDate, items } = await req.json();

    // Gerekli alanları kontrol et
    if (!title || !type || !department || !location || !dueDate || !items || !items.length) {
      return NextResponse.json({ error: "Gerekli alanlar eksik" }, { status: 400 });
    }

    // Kontrol listesi oluştur
    const now = new Date().toISOString();
    const [checklist] = await db
      .insert(checklists)
      .values({
        id: crypto.randomUUID(),
        title,
        description: description || null,
        type,
        department: department || null,
        location: location || null,
        dueDate: new Date(dueDate).toISOString(),
        status: "pending",
        assignedTo: session.user.id,
        createdBy: session.user.id,
        createdAt: now,
        updatedAt: now
      })
      .returning();

    // Kontrol listesi öğelerini ekle
    if (items && Array.isArray(items) && items.length > 0) {
      await db.insert(checklistItems).values(
        items.map((item, index) => ({
          id: crypto.randomUUID(),
          checklistId: checklist.id,
          title: item.title || `Öğe ${index + 1}`,
          description: item.description || null,
          status: "pending",
          order: index,
          createdAt: now,
          updatedAt: now
        }))
      );
    }

    // Oluşturulan kontrol listesini getir
    const newChecklist = await db.query.checklists.findFirst({
      where: eq(checklists.id, checklist.id),
      with: {
        items: true,
        createdByUser: true,
      },
    });

    return NextResponse.json(newChecklist);
  } catch (error) {
    console.error("Kontrol listesi oluşturma hatası:", error);
    return NextResponse.json({ error: "Kontrol listesi oluşturulamadı" }, { status: 500 });
  }
}
