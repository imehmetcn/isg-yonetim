import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { accidents, accidentPersonnel } from "@/lib/db/schema";
import { getServerSession } from "next-auth";
import { auth as authOptions } from '@/lib/auth';
import { eq } from "drizzle-orm";

// Kaza detaylarını getir
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    const { id } = params;

    // Kazayı getir
    const accident = await db.query.accidents.findFirst({
      where: eq(accidents.id, id),
      with: {
        createdByUser: true,
        involvedPersonnel: {
          with: {
            personnel: true,
          },
        },
      },
    });

    // Kaza bulunamadıysa hata döndür
    if (!accident) {
      return NextResponse.json({ error: "Kaza bulunamadı" }, { status: 404 });
    }

    return NextResponse.json(accident);
  } catch (error) {
    console.error("Kaza detayları hatası:", error);
    return NextResponse.json({ error: "Kaza detayları alınamadı" }, { status: 500 });
  }
}

// Kaza güncelle
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

    // Kazanın var olup olmadığını kontrol et
    const existingAccident = await db.query.accidents.findFirst({
      where: eq(accidents.id, id),
    });

    if (!existingAccident) {
      return NextResponse.json({ error: "Kaza bulunamadı" }, { status: 404 });
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

    // Güncellenecek alanları hazırla
    const updates: any = {};

    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (type !== undefined) updates.type = type;
    if (date !== undefined) updates.date = Math.floor(new Date(date).getTime() / 1000).toString();
    if (time !== undefined) updates.time = time;
    if (location !== undefined) updates.location = location;
    if (department !== undefined) updates.department = department;
    if (severity !== undefined) updates.severity = severity;
    if (rootCause !== undefined) updates.rootCause = rootCause;
    if (immediateActions !== undefined) updates.immediateActions = immediateActions;
    if (status !== undefined) {
      updates.status = status;
      // Eğer durum kapatıldıysa, kapatılma tarihini ekle
      if (status === "closed" && existingAccident.status !== "closed") {
        updates.closedDate = Math.floor(Date.now() / 1000).toString();
      }
    }

    // Kazayı güncelle
    await db.update(accidents).set(updates).where(eq(accidents.id, id));

    // İlgili personeli güncelle
    if (involvedPersonnelIds !== undefined) {
      // Mevcut ilişkileri sil
      await db.delete(accidentPersonnel).where(eq(accidentPersonnel.accidentId, id));

      // Yeni ilişkileri ekle
      if (Array.isArray(involvedPersonnelIds) && involvedPersonnelIds.length > 0) {
        const now = new Date().toISOString();
        await db.insert(accidentPersonnel).values(
          involvedPersonnelIds.map(personnelId => ({
            id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            accidentId: id,
            personnelId,
            role: "involved",
            createdAt: now,
            updatedAt: now
          }))
        );
      }
    }

    // Güncellenmiş kazayı getir
    const updatedAccident = await db.query.accidents.findFirst({
      where: eq(accidents.id, id),
      with: {
        createdByUser: true,
        involvedPersonnel: {
          with: {
            personnel: true,
          },
        },
      },
    });

    return NextResponse.json(updatedAccident);
  } catch (error) {
    console.error("Kaza güncelleme hatası:", error);
    return NextResponse.json({ error: "Kaza güncellenemedi" }, { status: 500 });
  }
}

// Kaza sil
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

    // Kazanın var olup olmadığını kontrol et
    const existingAccident = await db.query.accidents.findFirst({
      where: eq(accidents.id, id),
    });

    if (!existingAccident) {
      return NextResponse.json({ error: "Kaza bulunamadı" }, { status: 404 });
    }

    // İlişkili personel kayıtlarını sil
    await db.delete(accidentPersonnel).where(eq(accidentPersonnel.accidentId, id));

    // Kazayı sil
    await db.delete(accidents).where(eq(accidents.id, id));

    return NextResponse.json({ message: "Kaza başarıyla silindi" });
  } catch (error) {
    console.error("Kaza silme hatası:", error);
    return NextResponse.json({ error: "Kaza silinemedi" }, { status: 500 });
  }
}
