import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { audits } from "@/lib/db/schema";
import { getServerSession } from "next-auth";
import { auth as authOptions } from "@/lib/auth";
import { eq, and, sql } from "drizzle-orm";

// Tip tanımlamaları
interface AuditFinding {
  id: string;
  auditId: string;
  title: string;
  description: string;
  severity: string;
  status: string;
  [key: string]: any;
}

interface Audit {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  type: string;
  status: string;
  department?: string;
  findings?: AuditFinding[];
  [key: string]: any;
}

// Denetim raporlarını getir
export async function GET(req: Request) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 });
    }

    // URL parametrelerini al
    const { searchParams } = new URL(req.url);
    const reportType = searchParams.get("type") || "summary"; // summary, detailed, department, type, trend
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const department = searchParams.get("department");
    const auditType = searchParams.get("auditType");

    // Tarih aralığı kontrolü
    if (!startDate || !endDate) {
      return NextResponse.json({ error: "Başlangıç ve bitiş tarihleri gerekli" }, { status: 400 });
    }

    // Sorgu koşullarını hazırla
    const conditions = [];

    // Tarih aralığı filtresi
    const startTimestamp = Math.floor(new Date(startDate).getTime() / 1000).toString();
    const endTimestamp = Math.floor(new Date(endDate).getTime() / 1000).toString();
    conditions.push(sql`${audits.date} >= ${startTimestamp}`);
    conditions.push(sql`${audits.date} <= ${endTimestamp}`);

    // Departman filtresi
    if (department) {
      conditions.push(eq(audits.department, department));
    }

    // Denetim türü filtresi
    if (auditType) {
      conditions.push(
        eq(audits.type, auditType as "internal" | "external" | "regulatory" | "supplier" | "other")
      );
    }

    // Tüm denetimleri getir
    const allAudits = await db.query.audits.findMany({
      where: and(...conditions),
      with: {
        findings: true
      },
      orderBy: (audits, { desc }) => [desc(audits.date)],
    }) as unknown as Audit[];

    // Rapor tipine göre veri hazırla
    let reportData: any = {};

    if (reportType === "summary") {
      // Özet rapor
      reportData = {
        totalAudits: allAudits.length,
        byStatus: {
          pending: allAudits.filter(a => a.status === "pending").length,
          inProgress: allAudits.filter(a => a.status === "in_progress").length,
          completed: allAudits.filter(a => a.status === "completed").length,
        },
        byType: {
          internal: allAudits.filter(a => a.type === "internal").length,
          external: allAudits.filter(a => a.type === "external").length,
          regulatory: allAudits.filter(a => a.type === "regulatory").length,
          supplier: allAudits.filter(a => a.type === "supplier").length,
          other: allAudits.filter(a => a.type === "other").length,
        },
      };
    } else if (reportType === "detailed") {
      // Detaylı rapor
      reportData = {
        audits: allAudits.map(audit => ({
          id: audit.id,
          title: audit.title,
          description: audit.description,
          date: new Date(parseInt(audit.date) * 1000).toISOString(),
          location: audit.location,
          type: audit.type,
          status: audit.status,
          department: audit.department || "Bilinmeyen",
          findingsCount: audit.findings ? audit.findings.length : 0,
          openFindingsCount: audit.findings ? audit.findings.filter(f => f.status === "open").length : 0,
        })),
      };
    } else if (reportType === "department") {
      // Departman bazlı rapor
      const departmentStats: Record<string, any> = {};
      
      allAudits.forEach(audit => {
        const dept = audit.department || "Bilinmeyen";
        if (!departmentStats[dept]) {
          departmentStats[dept] = {
            total: 0,
            pending: 0,
            inProgress: 0,
            completed: 0,
            findings: 0,
            openFindings: 0,
          };
        }
        
        departmentStats[dept].total++;
        departmentStats[dept][audit.status === "in_progress" ? "inProgress" : audit.status]++;
        
        if (audit.findings) {
          departmentStats[dept].findings += audit.findings.length;
          departmentStats[dept].openFindings += audit.findings.filter(f => f.status === "open").length;
        }
      });
      
      reportData = { byDepartment: departmentStats };
    } else if (reportType === "type") {
      // Tür bazlı rapor
      const typeStats: Record<string, any> = {
        internal: { total: 0, findings: 0, openFindings: 0 },
        external: { total: 0, findings: 0, openFindings: 0 },
        regulatory: { total: 0, findings: 0, openFindings: 0 },
        supplier: { total: 0, findings: 0, openFindings: 0 },
        other: { total: 0, findings: 0, openFindings: 0 },
      };
      
      allAudits.forEach(audit => {
        const type = audit.type || "other";
        typeStats[type].total++;
        
        if (audit.findings) {
          typeStats[type].findings += audit.findings.length;
          typeStats[type].openFindings += audit.findings.filter(f => f.status === "open").length;
        }
      });
      
      reportData = { byType: typeStats };
    } else if (reportType === "trend") {
      // Trend raporu
      const monthlyStats: Record<string, number> = {};
      
      allAudits.forEach(audit => {
        const date = new Date(parseInt(audit.date) * 1000);
        const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
        
        if (!monthlyStats[monthYear]) {
          monthlyStats[monthYear] = 0;
        }
        
        monthlyStats[monthYear]++;
      });
      
      reportData = { monthlyTrend: monthlyStats };
    }

    // Rapor meta verileri
    const reportMeta = {
      generatedAt: new Date().toISOString(),
      dateRange: {
        start: new Date(parseInt(startTimestamp) * 1000).toISOString(),
        end: new Date(parseInt(endTimestamp) * 1000).toISOString(),
      },
      filters: {
        department: department || undefined,
        auditType: auditType || undefined,
      },
    };

    return NextResponse.json({
      meta: reportMeta,
      data: reportData,
    });
  } catch (error) {
    console.error("Denetim raporu hatası:", error);
    return NextResponse.json({ error: "Denetim raporu oluşturulamadı" }, { status: 500 });
  }
}
