import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { audits } from "@/lib/db/schema";
import { getServerSession } from "next-auth";
import { auth as authOptions } from '@/lib/auth';
import { eq } from "drizzle-orm";

// Denetim detaylarını getir
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    const { id } = params;

    // Mock audit data
    const mockAudits: Record<string, any> = {
      "1": {
        id: "1",
        title: "İş Güvenliği Denetimi",
        description: "Üretim alanında iş güvenliği denetimi",
        department: "Üretim",
        date: "2024-02-15T10:00:00Z",
        status: "COMPLETED",
        findings: [
          {
            id: "101",
            title: "Koruyucu ekipman eksikliği",
            description: "Bazı çalışanların koruyucu gözlük kullanmadığı tespit edildi",
            status: "closed",
            severity: "high",
            assignedTo: "user1",
            assignedToUser: {
              name: "Mehmet Yılmaz",
              email: "mehmet@example.com",
            },
            createdBy: "user2",
            createdByUser: {
              name: "Ayşe Demir",
              email: "ayse@example.com",
            },
          },
          {
            id: "102",
            title: "Acil çıkış işaretleri",
            description: "Acil çıkış işaretlerinin bazıları görünür değil",
            status: "open",
            severity: "medium",
            assignedTo: "user3",
            assignedToUser: {
              name: "Ali Kaya",
              email: "ali@example.com",
            },
            createdBy: "user2",
            createdByUser: {
              name: "Ayşe Demir",
              email: "ayse@example.com",
            },
          },
        ],
        createdByUser: {
          name: "Ayşe Demir",
          email: "ayse@example.com",
        },
      },
      "2": {
        id: "2",
        title: "Yangın Güvenliği Denetimi",
        description: "Tüm tesiste yangın güvenliği denetimi",
        department: "Tesis Yönetimi",
        date: "2024-02-28T14:00:00Z",
        status: "COMPLETED",
        findings: [
          {
            id: "201",
            title: "Yangın söndürücü bakımları",
            description: "Bazı yangın söndürücülerin bakım tarihleri geçmiş",
            status: "closed",
            severity: "high",
            assignedTo: "user1",
            assignedToUser: {
              name: "Mehmet Yılmaz",
              email: "mehmet@example.com",
            },
            createdBy: "user2",
            createdByUser: {
              name: "Ayşe Demir",
              email: "ayse@example.com",
            },
          },
        ],
        createdByUser: {
          name: "Ayşe Demir",
          email: "ayse@example.com",
        },
      },
      "3": {
        id: "3",
        title: "Ergonomi Denetimi",
        description: "Ofis alanlarında ergonomi denetimi",
        department: "İnsan Kaynakları",
        date: "2024-03-10T11:00:00Z",
        status: "IN_PROGRESS",
        findings: [
          {
            id: "301",
            title: "Ergonomik olmayan sandalyeler",
            description: "Bazı çalışanların ergonomik olmayan sandalye kullandığı tespit edildi",
            status: "in_progress",
            severity: "medium",
            assignedTo: "user3",
            assignedToUser: {
              name: "Ali Kaya",
              email: "ali@example.com",
            },
            createdBy: "user2",
            createdByUser: {
              name: "Ayşe Demir",
              email: "ayse@example.com",
            },
          },
        ],
        createdByUser: {
          name: "Ayşe Demir",
          email: "ayse@example.com",
        },
      },
      "4": {
        id: "4",
        title: "Kimyasal Madde Denetimi",
        description: "Laboratuvar ve depolarda kimyasal madde denetimi",
        department: "AR-GE",
        date: "2024-03-25T09:00:00Z",
        status: "PLANNED",
        findings: [],
        createdByUser: {
          name: "Ayşe Demir",
          email: "ayse@example.com",
        },
      },
    };

    const audit = mockAudits[id];

    if (!audit) {
      return NextResponse.json({ error: "Denetim bulunamadı" }, { status: 404 });
    }

    // Denetim istatistiklerini hesapla
    const stats = {
      totalFindings: audit.findings.length,
      openFindings: audit.findings.filter((f: any) => f.status === "open").length,
      inProgressFindings: audit.findings.filter((f: any) => f.status === "in_progress").length,
      closedFindings: audit.findings.filter((f: any) => f.status === "closed").length,
      overdueFindings: audit.findings.filter((f: any) => f.status === "overdue").length,
      criticalFindings: audit.findings.filter((f: any) => f.severity === "critical").length,
      highFindings: audit.findings.filter((f: any) => f.severity === "high").length,
      mediumFindings: audit.findings.filter((f: any) => f.severity === "medium").length,
      lowFindings: audit.findings.filter((f: any) => f.severity === "low").length,
    };

    return NextResponse.json({
      ...audit,
      stats,
    });
  } catch (error) {
    console.error("Denetim detay hatası:", error);
    return NextResponse.json({ error: "Denetim detayları alınamadı" }, { status: 500 });
  }
}

// Denetimi güncelle
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
    const { title, description, type, date, department, location, auditor, scope, status } =
      await req.json();

    // Denetimin var olup olmadığını kontrol et
    const existingAudit = await db.query.audits.findFirst({
      where: eq(audits.id, id),
    });

    if (!existingAudit) {
      return NextResponse.json({ error: "Denetim bulunamadı" }, { status: 404 });
    }

    // Güncellenecek alanları hazırla
    const updates: Record<string, any> = {
      updatedAt: new Date(),
    };

    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (type !== undefined) updates.type = type;
    if (date !== undefined) updates.date = new Date(date);
    if (department !== undefined) updates.department = department;
    if (location !== undefined) updates.location = location;
    if (auditor !== undefined) updates.auditor = auditor;
    if (scope !== undefined) updates.scope = scope;
    if (status !== undefined) updates.status = status;

    // Denetimi güncelle
    await db.update(audits).set(updates).where(eq(audits.id, id));

    // Güncellenmiş denetimi getir
    const updatedAudit = await db.query.audits.findFirst({
      where: eq(audits.id, id),
      with: {
        createdByUser: true,
        findings: {
          with: {
            assignedToUser: true,
          },
        },
      },
    });

    return NextResponse.json(updatedAudit);
  } catch (error) {
    console.error("Denetim güncelleme hatası:", error);
    return NextResponse.json({ error: "Denetim güncellenemedi" }, { status: 500 });
  }
}

// Denetimi sil
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

    // Denetimin var olup olmadığını kontrol et
    const existingAudit = await db.query.audits.findFirst({
      where: eq(audits.id, id),
    });

    if (!existingAudit) {
      return NextResponse.json({ error: "Denetim bulunamadı" }, { status: 404 });
    }

    // Denetimi sil (ilişkili bulgular cascade ile silinecek)
    await db.delete(audits).where(eq(audits.id, id));

    return NextResponse.json({ message: "Denetim başarıyla silindi" });
  } catch (error) {
    console.error("Denetim silme hatası:", error);
    return NextResponse.json({ error: "Denetim silinemedi" }, { status: 500 });
  }
}
