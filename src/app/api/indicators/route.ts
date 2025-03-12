import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { indicators } from "@/lib/db/schema";
import { getServerSession } from "next-auth";
import { auth as authOptions } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import crypto from "crypto";

// Performans göstergeleri listesini getir
export async function GET(req: Request) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    // URL parametrelerini al
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const year = searchParams.get("year");
    const month = searchParams.get("month");
    const status = searchParams.get("status");

    // Sorgu koşullarını hazırla
    let query = db.query.indicators.findMany({
      orderBy: (indicators, { desc }) => [desc(indicators.year), desc(indicators.month)],
      with: {
        createdByUser: true,
      },
    });

    // Kategoriye göre filtrele
    if (category) {
      query = db.query.indicators.findMany({
        where: eq(indicators.category, category),
        orderBy: (indicators, { desc }) => [desc(indicators.year), desc(indicators.month)],
        with: {
          createdByUser: true,
        },
      });
    }

    // Yıla göre filtrele
    if (year) {
      query = db.query.indicators.findMany({
        where: eq(indicators.year, parseInt(year)),
        orderBy: (indicators, { desc }) => [desc(indicators.year), desc(indicators.month)],
        with: {
          createdByUser: true,
        },
      });
    }

    // Aya göre filtrele
    if (month) {
      query = db.query.indicators.findMany({
        where: eq(indicators.month, parseInt(month)),
        orderBy: (indicators, { desc }) => [desc(indicators.year), desc(indicators.month)],
        with: {
          createdByUser: true,
        },
      });
    }

    // Duruma göre filtrele
    if (status) {
      query = db.query.indicators.findMany({
        where: eq(indicators.status, status),
        orderBy: (indicators, { desc }) => [desc(indicators.year), desc(indicators.month)],
        with: {
          createdByUser: true,
        },
      });
    }

    // Yıl ve aya göre filtrele
    if (year && month) {
      query = db.query.indicators.findMany({
        where: and(eq(indicators.year, parseInt(year)), eq(indicators.month, parseInt(month))),
        orderBy: (indicators, { desc }) => [desc(indicators.year), desc(indicators.month)],
        with: {
          createdByUser: true,
        },
      });
    }

    // Performans göstergelerini getir
    const indicatorList = await query;

    return NextResponse.json(indicatorList);
  } catch (error) {
    console.error("Performans göstergeleri listesi hatası:", error);
    return NextResponse.json(
      { error: "Performans göstergeleri listesi alınamadı" },
      { status: 500 }
    );
  }
}

// Yeni performans göstergesi oluştur
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

    const { name, description, category, year, month, target, actual, unit, status } =
      await req.json();

    // Gerekli alanları kontrol et
    if (!name || !category || !year || !month || !target || actual === undefined || !unit) {
      return NextResponse.json({ error: "Gerekli alanlar eksik" }, { status: 400 });
    }

    // Aynı ay ve yıl için aynı göstergenin olup olmadığını kontrol et
    const existingIndicator = await db.query.indicators.findFirst({
      where: and(eq(indicators.name, name), eq(indicators.year, year), eq(indicators.month, month)),
    });

    if (existingIndicator) {
      return NextResponse.json(
        { error: "Bu ay ve yıl için aynı isimde gösterge zaten mevcut" },
        { status: 400 }
      );
    }

    // Performans göstergesi oluştur
    const [indicator] = await db
      .insert(indicators)
      .values({
        id: crypto.randomUUID(),
        name,
        description: description || "",
        category,
        year,
        month,
        target,
        actual,
        unit,
        status: status || "pending",
        createdBy: session.user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .returning();

    // Oluşturulan performans göstergesini getir
    const newIndicator = await db.query.indicators.findFirst({
      where: eq(indicators.id, indicator.id),
      with: {
        createdByUser: true,
      },
    });

    return NextResponse.json(newIndicator);
  } catch (error) {
    console.error("Performans göstergesi oluşturma hatası:", error);
    return NextResponse.json({ error: "Performans göstergesi oluşturulamadı" }, { status: 500 });
  }
}
