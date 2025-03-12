import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { accidents, accidentPersonnel } from "@/lib/db/schema";
import { getServerSession } from "next-auth";
import { auth as authOptions } from "@/lib/auth";
import { eq, and, like, desc, sql } from "drizzle-orm";

// Kazaları listele
export async function GET(req: Request) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    // URL parametrelerini al
    const { searchParams } = new URL(req.url);
    const title = searchParams.get("title");
    const typeParam = searchParams.get("type");
    const severityParam = searchParams.get("severity") as
      | "minor"
      | "moderate"
      | "major"
      | "fatal"
      | null;
    const statusParam = searchParams.get("status") as "open" | "investigating" | "closed" | null;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const location = searchParams.get("location");
    const department = searchParams.get("department");

    // Sorgu koşullarını hazırla
    const conditions = [];

    // Başlık araması
    if (title) {
      conditions.push(like(accidents.title, `%${title}%`));
    }

    // Tür filtresi
    if (typeParam) {
      conditions.push(eq(accidents.type, typeParam));
    }

    // Şiddet filtresi
    if (severityParam) {
      conditions.push(eq(accidents.severity, severityParam));
    }

    // Durum filtresi
    if (statusParam) {
      conditions.push(eq(accidents.status, statusParam));
    }

    // Lokasyon filtresi
    if (location) {
      conditions.push(like(accidents.location, `%${location}%`));
    }

    // Departman filtresi
    if (department) {
      conditions.push(eq(accidents.department, department));
    }

    // Tarih aralığı filtresi
    if (startDate && endDate) {
      const startTimestamp = Math.floor(new Date(startDate).getTime() / 1000);
      const endTimestamp = Math.floor(new Date(endDate).getTime() / 1000);
      conditions.push(sql`${accidents.date} >= ${startTimestamp}`);
      conditions.push(sql`${accidents.date} <= ${endTimestamp}`);
    } else if (startDate) {
      const startTimestamp = Math.floor(new Date(startDate).getTime() / 1000);
      conditions.push(sql`${accidents.date} >= ${startTimestamp}`);
    } else if (endDate) {
      const endTimestamp = Math.floor(new Date(endDate).getTime() / 1000);
      conditions.push(sql`${accidents.date} <= ${endTimestamp}`);
    }

    // Kazaları getir
    let query = db.query.accidents.findMany({
      orderBy: [desc(accidents.date)],
      with: {
        createdByUser: true,
        involvedPersonnel: {
          with: {
            personnel: true,
          },
        },
      },
    });

    // Koşullar varsa uygula
    if (conditions.length > 0) {
      query = db.query.accidents.findMany({
        where: and(...conditions),
        orderBy: [desc(accidents.date)],
        with: {
          createdByUser: true,
          involvedPersonnel: {
            with: {
              personnel: true,
            },
          },
        },
      });
    }

    const accidentList = await query;

    return NextResponse.json(accidentList);
  } catch (error) {
    console.error("Kaza listesi hatası:", error);
    return NextResponse.json({ error: "Kaza listesi alınamadı" }, { status: 500 });
  }
}

// Yeni kaza oluştur
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

    const {
      title,
      description,
      type,
      date,
      time,
      location,
      department,
      severity,
      rootCause,
      immediateActions,
      status,
      involvedPersonnelIds,
    } = await req.json();

    // Gerekli alanları kontrol et
    if (!title || !type || !date || !location || !department || !severity) {
      return NextResponse.json({ error: "Gerekli alanlar eksik" }, { status: 400 });
    }

    // Tarih dönüşümü
    const dateTimestamp = Math.floor(new Date(date).getTime() / 1000);
    const now = new Date().toISOString();

    // Kaza oluştur
    const [accident] = await db
      .insert(accidents)
      .values({
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        title,
        description,
        type,
        date: dateTimestamp.toString(),
        time,
        location,
        department,
        severity: severity as "minor" | "moderate" | "major" | "fatal",
        rootCause,
        immediateActions,
        status: (status as "open" | "investigating" | "closed") || "open",
        reportedBy: session.user.id,
        createdBy: session.user.id,
        createdAt: now,
        updatedAt: now
      })
      .returning();

    // İlgili personeli ekle
    if (
      involvedPersonnelIds &&
      Array.isArray(involvedPersonnelIds) &&
      involvedPersonnelIds.length > 0
    ) {
      await db.insert(accidentPersonnel).values(
        involvedPersonnelIds.map(personnelId => ({
          id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          accidentId: accident.id,
          personnelId,
          role: "involved",
          createdAt: now,
          updatedAt: now
        }))
      );
    }

    // Oluşturulan kazayı getir
    const newAccident = await db.query.accidents.findFirst({
      where: eq(accidents.id, accident.id),
      with: {
        createdByUser: true,
        involvedPersonnel: {
          with: {
            personnel: true,
          },
        },
      },
    });

    return NextResponse.json(newAccident);
  } catch (error) {
    console.error("Kaza oluşturma hatası:", error);
    return NextResponse.json({ error: "Kaza oluşturulamadı" }, { status: 500 });
  }
}
