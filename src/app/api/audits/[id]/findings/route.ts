import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { audits, auditFindings } from "@/lib/db/schema";
import { getServerSession } from "next-auth";
import { auth as authOptions } from "@/lib/auth";
import { eq, and, desc } from "drizzle-orm";

// Denetim bulgularını listele
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    const { id } = params;

    // Denetimin var olup olmadığını kontrol et
    const existingAudit = await db.query.audits.findFirst({
      where: eq(audits.id, id),
    });

    if (!existingAudit) {
      return NextResponse.json({ error: "Denetim bulunamadı" }, { status: 404 });
    }

    // URL parametrelerini al
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const severity = searchParams.get("severity");
    const assignedTo = searchParams.get("assignedTo");

    // Sorgu koşullarını hazırla
    const conditions = [eq(auditFindings.auditId, id)];

    // Durum filtresi
    if (status) {
      conditions.push(
        eq(auditFindings.status, status as "open" | "in_progress" | "closed" | "overdue")
      );
    }

    // Önem derecesi filtresi
    if (severity) {
      conditions.push(
        eq(auditFindings.severity, severity as "critical" | "high" | "medium" | "low")
      );
    }

    // Atanan kişi filtresi
    if (assignedTo) {
      conditions.push(eq(auditFindings.assignedTo, assignedTo));
    }

    // Bulguları getir
    const findings = await db.query.auditFindings.findMany({
      where: and(...conditions),
      orderBy: [desc(auditFindings.createdAt)],
      with: {
        assignedToUser: true,
        createdByUser: true,
      },
    });

    return NextResponse.json(findings);
  } catch (error) {
    console.error("Denetim bulguları listesi hatası:", error);
    return NextResponse.json({ error: "Denetim bulguları listesi alınamadı" }, { status: 500 });
  }
}

// Yeni denetim bulgusu oluştur
export async function POST(req: Request, { params }: { params: { id: string } }) {
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

    // Denetimin var olup olmadığını kontrol et
    const existingAudit = await db.query.audits.findFirst({
      where: eq(audits.id, id),
    });

    if (!existingAudit) {
      return NextResponse.json({ error: "Denetim bulunamadı" }, { status: 404 });
    }

    const { title, description, severity, status, dueDate, assignedTo } = await req.json();

    // Gerekli alanları kontrol et
    if (!description) {
      return NextResponse.json({ error: "Açıklama alanı gerekli" }, { status: 400 });
    }

    // Tarih ve zaman
    const now = new Date().toISOString();
    const dueDateStr = dueDate ? new Date(dueDate).toISOString() : null;

    // Bulgu oluştur
    const [finding] = await db
      .insert(auditFindings)
      .values({
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        auditId: id,
        title: title || "",
        description,
        severity: severity || "medium",
        status: status || "open",
        dueDate: dueDateStr,
        assignedTo: assignedTo || null,
        createdAt: now,
        updatedAt: now
      })
      .returning();

    // Denetim durumunu güncelle
    if (existingAudit.status === "pending") {
      await db
        .update(audits)
        .set({ status: "in_progress", updatedAt: now })
        .where(eq(audits.id, id));
    }

    return NextResponse.json(finding);
  } catch (error) {
    console.error("Denetim bulgusu oluşturma hatası:", error);
    return NextResponse.json({ error: "Denetim bulgusu oluşturulamadı" }, { status: 500 });
  }
}
