import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { indicators } from "@/lib/db/schema";
import { getServerSession } from "next-auth";
import { auth as authOptions } from '@/lib/auth';
import { eq } from "drizzle-orm";

// Performans göstergesi detaylarını getir
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    const { id } = params;

    // Performans göstergesini getir
    const indicator = await db.query.indicators.findFirst({
      where: eq(indicators.id, id),
      with: {
        createdByUser: true,
      },
    });

    if (!indicator) {
      return NextResponse.json({ error: "Performans göstergesi bulunamadı" }, { status: 404 });
    }

    return NextResponse.json(indicator);
  } catch (error) {
    console.error("Performans göstergesi detay hatası:", error);
    return NextResponse.json(
      { error: "Performans göstergesi detayları alınamadı" },
      { status: 500 }
    );
  }
}

// Performans göstergesini güncelle
export async function PUT(req: Request, { params }: { params: { id: string } }) {
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

    const { id } = params;
    const { name, description, category, year, month, target, actual, unit, status, notes } =
      await req.json();

    // Performans göstergesinin var olup olmadığını kontrol et
    const existingIndicator = await db.query.indicators.findFirst({
      where: eq(indicators.id, id),
    });

    if (!existingIndicator) {
      return NextResponse.json({ error: "Performans göstergesi bulunamadı" }, { status: 404 });
    }

    // Güncellenecek alanları hazırla
    const updates: Record<string, any> = {
      updatedAt: new Date(),
    };

    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (category !== undefined) updates.category = category;
    if (year !== undefined) updates.year = year;
    if (month !== undefined) updates.month = month;
    if (target !== undefined) updates.target = target;
    if (actual !== undefined) updates.actual = actual;
    if (unit !== undefined) updates.unit = unit;
    if (status !== undefined) updates.status = status;
    if (notes !== undefined) updates.notes = notes;

    // Performans göstergesini güncelle
    await db.update(indicators).set(updates).where(eq(indicators.id, id));

    // Güncellenmiş performans göstergesini getir
    const updatedIndicator = await db.query.indicators.findFirst({
      where: eq(indicators.id, id),
      with: {
        createdByUser: true,
      },
    });

    return NextResponse.json(updatedIndicator);
  } catch (error) {
    console.error("Performans göstergesi güncelleme hatası:", error);
    return NextResponse.json({ error: "Performans göstergesi güncellenemedi" }, { status: 500 });
  }
}

// Performans göstergesini sil
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

    const { id } = params;

    // Performans göstergesinin var olup olmadığını kontrol et
    const existingIndicator = await db.query.indicators.findFirst({
      where: eq(indicators.id, id),
    });

    if (!existingIndicator) {
      return NextResponse.json({ error: "Performans göstergesi bulunamadı" }, { status: 404 });
    }

    // Performans göstergesini sil
    await db.delete(indicators).where(eq(indicators.id, id));

    return NextResponse.json({ message: "Performans göstergesi başarıyla silindi" });
  } catch (error) {
    console.error("Performans göstergesi silme hatası:", error);
    return NextResponse.json({ error: "Performans göstergesi silinemedi" }, { status: 500 });
  }
}
