import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { indicators } from "@/lib/db/schema";
import { getServerSession } from "next-auth";
import { auth as authOptions } from "@/lib/auth";
import { eq, and, sql } from "drizzle-orm";
import crypto from "crypto";

// Performans göstergeleri hedeflerini getir
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
    const name = searchParams.get("name");
    const year = searchParams.get("year");
    const month = searchParams.get("month");

    // Gerekli parametreleri kontrol et
    if (!year) {
      return NextResponse.json({ error: "Yıl parametresi gerekli" }, { status: 400 });
    }

    // Sorgu koşullarını hazırla
    const conditions = [];
    conditions.push(eq(indicators.year, parseInt(year)));

    // İsim, kategori veya ay filtresi
    if (name) {
      conditions.push(eq(indicators.name, name));
    }

    if (category) {
      conditions.push(eq(indicators.category, category));
    }

    if (month) {
      conditions.push(eq(indicators.month, parseInt(month)));
    }

    // Performans göstergeleri hedeflerini getir
    const targetList = await db.query.indicators.findMany({
      where: and(...conditions),
      orderBy: [
        sql`${indicators.category} ASC`,
        sql`${indicators.name} ASC`,
        sql`${indicators.month} ASC`,
      ],
    });

    // Hedefleri formatla
    const formattedTargets = targetList.map((indicator) => ({
      id: indicator.id,
      name: indicator.name,
      category: indicator.category,
      year: indicator.year,
      month: indicator.month,
      target: indicator.target,
      unit: indicator.unit,
      description: indicator.description,
      createdBy: indicator.createdBy,
    }));

    return NextResponse.json(formattedTargets);
  } catch (error) {
    console.error("Performans göstergeleri hedefleri hatası:", error);
    return NextResponse.json(
      { error: "Performans göstergeleri hedefleri alınamadı" },
      { status: 500 }
    );
  }
}

// Yeni performans göstergesi hedefi oluştur veya güncelle
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

    const { name, description, category, year, month, target, unit, isUpdate } = await req.json();

    // Gerekli alanları kontrol et
    if (!name || !category || !year || !month || target === undefined || !unit) {
      return NextResponse.json({ error: "Gerekli alanlar eksik" }, { status: 400 });
    }

    // Aynı ay ve yıl için aynı göstergenin olup olmadığını kontrol et
    const existingIndicator = await db.query.indicators.findFirst({
      where: and(
        eq(indicators.name, name),
        eq(indicators.category, category),
        eq(indicators.year, year),
        eq(indicators.month, month)
      ),
    });

    // Güncelleme veya oluşturma işlemi
    if (existingIndicator) {
      if (!isUpdate) {
        return NextResponse.json(
          { error: "Bu ay ve yıl için aynı isimde gösterge zaten mevcut" },
          { status: 400 }
        );
      }

      // Hedefi güncelle
      await db
        .update(indicators)
        .set({
          target,
          description: description || existingIndicator.description,
          unit: unit || existingIndicator.unit,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(indicators.id, existingIndicator.id));

      // Güncellenmiş hedefi getir
      const updatedTarget = await db.query.indicators.findFirst({
        where: eq(indicators.id, existingIndicator.id),
        with: {
          createdByUser: true,
        },
      });

      return NextResponse.json({
        ...updatedTarget,
        message: "Performans göstergesi hedefi güncellendi",
      });
    } else {
      // Yeni hedef oluştur
      const [newIndicator] = await db
        .insert(indicators)
        .values({
          id: crypto.randomUUID(),
          name,
          description: description || "",
          category,
          year,
          month,
          target,
          actual: 0, // Henüz gerçekleşen değer yok
          unit,
          status: "pending",
          createdBy: session.user.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .returning();

      // Oluşturulan hedefi getir
      const createdTarget = await db.query.indicators.findFirst({
        where: eq(indicators.id, newIndicator.id),
        with: {
          createdByUser: true,
        },
      });

      return NextResponse.json({
        ...createdTarget,
        message: "Performans göstergesi hedefi oluşturuldu",
      });
    }
  } catch (error) {
    console.error("Performans göstergesi hedefi oluşturma/güncelleme hatası:", error);
    return NextResponse.json(
      { error: "Performans göstergesi hedefi oluşturulamadı/güncellenemedi" },
      { status: 500 }
    );
  }
}
