import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { maintenanceLogs, equipment } from "@/lib/db/schema";
import { getServerSession } from "next-auth";
import { auth as authOptions } from "@/lib/auth";
import { eq } from "drizzle-orm";
import crypto from "crypto";

// Bakım kayıtları listesini getir
export async function GET(req: Request) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    // URL parametrelerini al
    const { searchParams } = new URL(req.url);
    const equipmentId = searchParams.get("equipmentId");

    // Sorgu koşullarını hazırla
    let query = db.query.maintenanceLogs.findMany({
      orderBy: (maintenanceLogs, { desc }) => [desc(maintenanceLogs.date)],
      with: {
        equipment: true,
      },
    });

    // Ekipman ID'sine göre filtrele
    if (equipmentId) {
      query = db.query.maintenanceLogs.findMany({
        where: eq(maintenanceLogs.equipmentId, equipmentId),
        orderBy: (maintenanceLogs, { desc }) => [desc(maintenanceLogs.date)],
        with: {
          equipment: true,
        },
      });
    }

    // Bakım kayıtlarını getir
    const maintenanceList = await query;

    return NextResponse.json(maintenanceList);
  } catch (error) {
    console.error("Bakım kayıtları listesi hatası:", error);
    return NextResponse.json({ error: "Bakım kayıtları listesi alınamadı" }, { status: 500 });
  }
}

// Yeni bakım kaydı oluştur
export async function POST(req: Request) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    const { equipmentId, type, description, technician, status, date } = await req.json();

    // Gerekli alanları kontrol et
    if (!equipmentId || !type || !technician || !status || !date) {
      return NextResponse.json({ error: "Gerekli alanlar eksik" }, { status: 400 });
    }

    // Ekipmanı kontrol et
    const existingEquipment = await db.query.equipment.findFirst({
      where: eq(equipment.id, equipmentId),
    });

    if (!existingEquipment) {
      return NextResponse.json({ error: "Ekipman bulunamadı" }, { status: 404 });
    }

    // Bakım kaydını oluştur
    const [maintenanceLog] = await db
      .insert(maintenanceLogs)
      .values({
        id: crypto.randomUUID(),
        equipmentId,
        type,
        description,
        technician,
        status,
        date: new Date(date).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .returning();

    // Ekipmanın son bakım tarihini güncelle
    if (status === "completed") {
      await db
        .update(equipment)
        .set({
          lastMaintenance: new Date(date).toISOString(),
          nextMaintenance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 gün sonra
          updatedAt: new Date().toISOString(),
        })
        .where(eq(equipment.id, equipmentId));
    }

    return NextResponse.json(maintenanceLog);
  } catch (error) {
    console.error("Bakım kaydı oluşturma hatası:", error);
    return NextResponse.json({ error: "Bakım kaydı oluşturulamadı" }, { status: 500 });
  }
}
