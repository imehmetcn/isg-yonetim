import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { audits, auditFindings } from "@/lib/db/schema";
import { getServerSession } from "next-auth";
import { auth as authOptions } from "@/lib/auth";
import { eq } from "drizzle-orm";

// Denetim bulgusu detaylarını getir
export async function GET(_req: Request, { params }: { params: { id: string; findingId: string } }) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    const { id, findingId } = params;

    // Denetimi kontrol et
    const audit = await db.query.audits.findFirst({
      where: eq(audits.id, id),
    });

    if (!audit) {
      return NextResponse.json({ error: "Denetim bulunamadı" }, { status: 404 });
    }

    // Bulguyu getir
    const finding = await db.query.auditFindings.findFirst({
      where: eq(auditFindings.id, findingId),
    });

    if (!finding) {
      return NextResponse.json({ error: "Denetim bulgusu bulunamadı" }, { status: 404 });
    }

    // Bulgu denetim ile ilişkili mi kontrol et
    if (finding.auditId !== id) {
      return NextResponse.json(
        { error: "Bu bulgu belirtilen denetim ile ilişkili değil" },
        { status: 400 }
      );
    }

    return NextResponse.json(finding);
  } catch (error) {
    console.error("Denetim bulgusu detayları hatası:", error);
    return NextResponse.json({ error: "Denetim bulgusu detayları alınamadı" }, { status: 500 });
  }
}

// Denetim bulgusu güncelle
export async function PUT(req: Request, { params }: { params: { id: string; findingId: string } }) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    const { id, findingId } = params;

    // Denetimi kontrol et
    const existingAudit = await db.query.audits.findFirst({
      where: eq(audits.id, id),
    });

    if (!existingAudit) {
      return NextResponse.json({ error: "Denetim bulunamadı" }, { status: 404 });
    }

    // Bulguyu kontrol et
    const existingFinding = await db.query.auditFindings.findFirst({
      where: eq(auditFindings.id, findingId),
    });

    if (!existingFinding) {
      return NextResponse.json({ error: "Denetim bulgusu bulunamadı" }, { status: 404 });
    }

    // Bulgu denetim ile ilişkili mi kontrol et
    if (existingFinding.auditId !== id) {
      return NextResponse.json(
        { error: "Bu bulgu belirtilen denetim ile ilişkili değil" },
        { status: 400 }
      );
    }

    const { title, description, severity, status, dueDate, assignedTo } = await req.json();

    // Güncellenecek alanları hazırla
    const updates: any = {};
    const now = new Date().toISOString();

    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (severity !== undefined) updates.severity = severity;
    if (status !== undefined) updates.status = status;
    if (dueDate !== undefined) updates.dueDate = dueDate;
    if (assignedTo !== undefined) updates.assignedTo = assignedTo;
    updates.updatedAt = now;

    // Bulguyu güncelle
    const [updatedFinding] = await db
      .update(auditFindings)
      .set(updates)
      .where(eq(auditFindings.id, findingId))
      .returning();

    // Tüm bulguları getir
    const allFindings = await db.query.auditFindings.findMany({
      where: eq(auditFindings.auditId, id),
    });

    const allClosed = allFindings.length > 0 && allFindings.every(f => f.status === "closed");

    if (allClosed && existingAudit.status !== "completed") {
      await db
        .update(audits)
        .set({ status: "completed", updatedAt: now })
        .where(eq(audits.id, id));
    } else if (!allClosed && existingAudit.status === "completed") {
      await db
        .update(audits)
        .set({ status: "in_progress", updatedAt: now })
        .where(eq(audits.id, id));
    }

    return NextResponse.json(updatedFinding);
  } catch (error) {
    console.error("Denetim bulgusu güncelleme hatası:", error);
    return NextResponse.json({ error: "Denetim bulgusu güncellenemedi" }, { status: 500 });
  }
}

// Denetim bulgusu sil
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string; findingId: string } }
) {
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

    const { id, findingId } = params;

    // Denetimi kontrol et
    const existingAudit = await db.query.audits.findFirst({
      where: eq(audits.id, id),
    });

    if (!existingAudit) {
      return NextResponse.json({ error: "Denetim bulunamadı" }, { status: 404 });
    }

    // Bulguyu kontrol et
    const existingFinding = await db.query.auditFindings.findFirst({
      where: eq(auditFindings.id, findingId),
    });

    if (!existingFinding) {
      return NextResponse.json({ error: "Denetim bulgusu bulunamadı" }, { status: 404 });
    }

    // Bulgu denetim ile ilişkili mi kontrol et
    if (existingFinding.auditId !== id) {
      return NextResponse.json(
        { error: "Bu bulgu belirtilen denetim ile ilişkili değil" },
        { status: 400 }
      );
    }

    // Bulguyu sil
    await db.delete(auditFindings).where(eq(auditFindings.id, findingId));

    // Kalan bulguları kontrol et
    const remainingFindings = await db.query.auditFindings.findMany({
      where: eq(auditFindings.auditId, id),
    });

    // Eğer hiç bulgu kalmadıysa denetim durumunu güncelle
    if (remainingFindings.length === 0 && existingAudit.status !== "pending") {
      const now = new Date().toISOString();
      await db
        .update(audits)
        .set({ status: "pending", updatedAt: now })
        .where(eq(audits.id, id));
    }

    return NextResponse.json({ message: "Denetim bulgusu başarıyla silindi" });
  } catch (error) {
    console.error("Denetim bulgusu silme hatası:", error);
    return NextResponse.json({ error: "Denetim bulgusu silinemedi" }, { status: 500 });
  }
}
