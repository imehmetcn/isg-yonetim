import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { maintenanceLogs, equipment } from "@/lib/db/schema";
import { getServerSession } from "next-auth";
import { auth as authOptions } from '@/lib/auth';
import { eq } from "drizzle-orm";

// Bakım kaydı detaylarını getir
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    // Bakım kaydını getir
    const maintenanceLog = await db.query.maintenanceLogs.findFirst({
      where: eq(maintenanceLogs.id, params.id),
      with: {
        equipment: true,
      },
    });

    if (!maintenanceLog) {
      return NextResponse.json({ error: "Bakım kaydı bulunamadı" }, { status: 404 });
    }

    return NextResponse.json(maintenanceLog);
  } catch (error) {
    console.error("Bakım kaydı detayları hatası:", error);
    return NextResponse.json({ error: "Bakım kaydı detayları alınamadı" }, { status: 500 });
  }
}

// Bakım kaydını güncelle
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    const { type, findings, technician, status, date } = await req.json();

    // Bakım kaydını kontrol et
    const existingLog = await db.query.maintenanceLogs.findFirst({
      where: eq(maintenanceLogs.id, params.id),
    });

    if (!existingLog) {
      return NextResponse.json({ error: "Bakım kaydı bulunamadı" }, { status: 404 });
    }

    // Güncellenecek alanları hazırla
    const updates: any = {};
    if (type) updates.type = type;
    if (findings !== undefined) updates.findings = findings;
    if (technician) updates.technician = technician;
    if (status) updates.status = status;
    if (date) updates.date = new Date(date).toISOString();

    // Bakım kaydını güncelle
    const [updatedLog] = await db
      .update(maintenanceLogs)
      .set(updates)
      .where(eq(maintenanceLogs.id, params.id))
      .returning();

    // Eğer bakım tamamlandıysa ekipmanın son bakım tarihini güncelle
    if (status === "completed" && existingLog.status !== "completed") {
      await db
        .update(equipment)
        .set({
          lastMaintenance: new Date(date || existingLog.date).toISOString(),
          nextMaintenance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 gün sonra
        })
        .where(eq(equipment.id, existingLog.equipmentId));
    }

    return NextResponse.json(updatedLog);
  } catch (error) {
    console.error("Bakım kaydı güncelleme hatası:", error);
    return NextResponse.json({ error: "Bakım kaydı güncellenemedi" }, { status: 500 });
  }
}

// Bakım kaydını sil
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    // Sadece admin kullanıcılar erişebilir
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Bu işlem için yetkiniz yok" }, { status: 403 });
    }

    // Bakım kaydını kontrol et
    const existingLog = await db.query.maintenanceLogs.findFirst({
      where: eq(maintenanceLogs.id, params.id),
    });

    if (!existingLog) {
      return NextResponse.json({ error: "Bakım kaydı bulunamadı" }, { status: 404 });
    }

    // Bakım kaydını sil
    await db.delete(maintenanceLogs).where(eq(maintenanceLogs.id, params.id));

    return NextResponse.json({ message: "Bakım kaydı başarıyla silindi" });
  } catch (error) {
    console.error("Bakım kaydı silme hatası:", error);
    return NextResponse.json({ error: "Bakım kaydı silinemedi" }, { status: 500 });
  }
}
